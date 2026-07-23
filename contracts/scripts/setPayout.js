require("dotenv").config();
const { ethers } = require("ethers");
const ChallengeABI = require("./artifacts/contracts/GlofiChallenge.sol/GlofiChallenge.json");

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const CHALLENGE = "0x5c87511BEF3CddD7e1cfdABfA7173F6DA7554784";
    const PAYOUT = "0x78A9401c255Af3Df3DA73fbE7Fd7bB423a2d5d6c";

    const challenge = new ethers.Contract(CHALLENGE, ChallengeABI.abi, wallet);

    // Set your wallet as evaluator for now — in production this will be a Chainlink oracle
    const tx = await challenge.setEvaluator(wallet.address);
    await tx.wait();
    console.log("Evaluator set on challenge contract. Tx:", tx.hash);
}

main().catch(console.error);