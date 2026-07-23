// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GlofiToken.sol";

/**
 * @title ProxyGovernance
 * @dev Enables traditional investors without Web3 wallets to participate
 * in governance through a designated agent system.
 * 
 * How it works:
 * - A non-Web3 investor nominates an agent address to vote on their behalf
 * - The owner (Glofi) verifies the relationship off-chain and registers it
 * - The agent can vote on proposals using the investor's token weight
 * - The investor can revoke the agent at any time through Glofi support
 */
contract ProxyGovernance is Ownable {

    // ─── Structs ───────────────────────────────────────────────────────

    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool passed;
    }

    struct ProxyRelationship {
        address investor;
        address agent;
        uint256 tokenWeight;
        bool active;
        uint256 registeredAt;
    }

    // ─── State Variables ───────────────────────────────────────────────

    GlofiToken public glofiToken;

    uint256 public proposalCount;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_PROPOSAL_THRESHOLD = 1000 * 10**18;

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => bool)) public voteDirection;

    // Proxy relationships — agent => investor details
    mapping(address => ProxyRelationship) public agentToProxy;
    // Investor address => agent address
    mapping(address => address) public investorToAgent;

    // ─── Events ────────────────────────────────────────────────────────

    event ProposalCreated(uint256 indexed proposalId, string title, uint256 endTime);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProxyVoteCast(uint256 indexed proposalId, address indexed agent, address indexed investor, bool support, uint256 weight);
    event ProxyRegistered(address indexed investor, address indexed agent, uint256 tokenWeight);
    event ProxyRevoked(address indexed investor, address indexed agent);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);

    // ─── Constructor ───────────────────────────────────────────────────

    constructor(
        address initialOwner,
        address _glofiTokenAddress
    ) Ownable(initialOwner) {
        glofiToken = GlofiToken(_glofiTokenAddress);
    }

    // ─── Proxy Management ──────────────────────────────────────────────

    /**
     * @dev Register a proxy relationship
     * Owner calls this after verifying the investor off-chain
     * tokenWeight represents the investor's token holdings verified externally
     */
    function registerProxy(
        address investor,
        address agent,
        uint256 tokenWeight
    ) external onlyOwner {
        require(investor != address(0) && agent != address(0), "Invalid addresses");
        require(investor != agent, "Investor cannot be their own agent");
        require(!agentToProxy[agent].active, "Agent already registered");
        require(tokenWeight > 0, "Token weight must be greater than zero");

        agentToProxy[agent] = ProxyRelationship({
            investor: investor,
            agent: agent,
            tokenWeight: tokenWeight,
            active: true,
            registeredAt: block.timestamp
        });

        investorToAgent[investor] = agent;

        emit ProxyRegistered(investor, agent, tokenWeight);
    }

    /**
     * @dev Revoke a proxy relationship
     * Can be called by owner (on investor request) or by agent themselves
     */
    function revokeProxy(address investor) external {
        require(
            msg.sender == owner() || msg.sender == investorToAgent[investor],
            "Not authorized"
        );

        address agent = investorToAgent[investor];
        require(agent != address(0), "No proxy registered");

        agentToProxy[agent].active = false;
        investorToAgent[investor] = address(0);

        emit ProxyRevoked(investor, agent);
    }

    // ─── Proposal Management ───────────────────────────────────────────

    /**
     * @dev Create a new governance proposal
     * Requires caller to hold minimum token threshold
     */
    function createProposal(
        string calldata title,
        string calldata description
    ) external returns (uint256) {
        require(
            glofiToken.balanceOf(msg.sender) >= MIN_PROPOSAL_THRESHOLD,
            "Insufficient tokens to propose"
        );

        uint256 proposalId = ++proposalCount;

        proposals[proposalId] = Proposal({
            id: proposalId,
            title: title,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + VOTING_PERIOD,
            executed: false,
            passed: false
        });

        emit ProposalCreated(proposalId, title, block.timestamp + VOTING_PERIOD);
        return proposalId;
    }

    // ─── Voting ────────────────────────────────────────────────────────

    /**
     * @dev Direct vote — for GLOFI token holders with Web3 wallets
     * Voting weight = token balance
     */
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.endTime, "Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 weight = glofiToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        hasVoted[proposalId][msg.sender] = true;
        voteDirection[proposalId][msg.sender] = support;

        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }

        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    /**
     * @dev Proxy vote — agent votes on behalf of non-Web3 investor
     * Voting weight = registered token weight of the investor
     */
    function voteAsProxy(uint256 proposalId, bool support) external {
        ProxyRelationship memory proxy = agentToProxy[msg.sender];
        require(proxy.active, "No active proxy relationship");

        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.endTime, "Voting period ended");
        require(!hasVoted[proposalId][proxy.investor], "Investor already voted");

        hasVoted[proposalId][proxy.investor] = true;
        voteDirection[proposalId][proxy.investor] = support;

        if (support) {
            proposal.forVotes += proxy.tokenWeight;
        } else {
            proposal.againstVotes += proxy.tokenWeight;
        }

        emit ProxyVoteCast(proposalId, msg.sender, proxy.investor, support, proxy.tokenWeight);
    }

    /**
     * @dev Execute a proposal after voting period ends
     * Passed if forVotes > againstVotes
     */
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.endTime, "Voting still active");
        require(!proposal.executed, "Already executed");

        proposal.executed = true;
        proposal.passed = proposal.forVotes > proposal.againstVotes;

        emit ProposalExecuted(proposalId, proposal.passed);
    }

    // ─── View Functions ────────────────────────────────────────────────

    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }

    function getProxyInfo(address agent) external view returns (ProxyRelationship memory) {
        return agentToProxy[agent];
    }

    function isProposalActive(uint256 proposalId) external view returns (bool) {
        return block.timestamp < proposals[proposalId].endTime;
    }

    function getVotingPower(address voter) external view returns (uint256 direct, uint256 proxy) {
        direct = glofiToken.balanceOf(voter);
        ProxyRelationship memory p = agentToProxy[voter];
        proxy = p.active ? p.tokenWeight : 0;
    }
}