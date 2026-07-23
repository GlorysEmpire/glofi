require("dotenv").config();
const { ethers } = require("ethers");
const ABI = require("./artifacts/contracts/ProxyGovernance.sol/ProxyGovernance.json");

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const gov = new ethers.Contract(
        "0x30E07C200F18736665B69454796a486377d49EB2",
        ABI.abi,
        wallet
    );

    const tx1 = await gov.createProposal(
        "Proposal #1 — Set Trader Profit Split to 80%",
        "Sets the default profit split for funded traders to 80%. Remaining 20% split between liquidity pool (15%) and platform treasury (5%)."
    );
    await tx1.wait();
    console.log("Proposal 1 created:", tx1.hash);

    const tx2 = await gov.createProposal(
        "Proposal #2 — Add Staking Challenge Tier",
        "Introduces staking-based challenge entry where traders lock governance tokens instead of paying a flat fee. On pass, stake returned. On fail, slashed to pool."
    );
    await tx2.wait();
    console.log("Proposal 2 created:", tx2.hash);
}

main().catch(console.error);