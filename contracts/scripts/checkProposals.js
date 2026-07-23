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
    const count = await gov.proposalCount();
    console.log("Total proposals on-chain:", count.toString());
}

main().catch(console.error);