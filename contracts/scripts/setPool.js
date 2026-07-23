require("dotenv").config();
const { ethers } = require("ethers");
const GlofiTokenABI = require("./artifacts/contracts/GlofiToken.sol/GlofiToken.json");

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const GLOFI_TOKEN = "0x5B9dEE5d96BdF3F7E3aa4e4FD8A0ad29b4082a2C";
    const GLOFI_POOL = "0x43736a144cF4B9dcC2b9a2426C9D69F8Dd529803";

    const tokenContract = new ethers.Contract(
        GLOFI_TOKEN,
        GlofiTokenABI.abi,
        wallet
    );

    console.log("Setting liquidity pool address...");
    const tx = await tokenContract.setLiquidityPool(GLOFI_POOL);
    await tx.wait();
    console.log("Done! Transaction hash:", tx.hash);
    console.log("Pool address set to:", GLOFI_POOL);
}

main().catch(console.error);