require("dotenv").config();
const { ethers } = require("ethers");
const PoolABI = require("./artifacts/contracts/GlofiPool.sol/GlofiPool.json");

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const pool = new ethers.Contract("0x43736a144cF4B9dcC2b9a2426C9D69F8Dd529803", PoolABI.abi, wallet);
    const tx = await pool.setChallengeContract("0x5c87511BEF3CddD7e1cfdABfA7173F6DA7554784");
    await tx.wait();
    console.log("Challenge contract set on pool. Tx:", tx.hash);
}
main().catch(console.error);