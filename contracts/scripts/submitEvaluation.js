require("dotenv").config();
const { ethers } = require("ethers");
const ABI = require("./artifacts/contracts/GlofiChallenge.sol/GlofiChallenge.json");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const challenge = new ethers.Contract(
    "0x5c87511BEF3CddD7e1cfdABfA7173F6DA7554784",
    ABI.abi,
    wallet
  );

  // Submit evaluation for challenge ID 1
  // 30 trading days completed, 850 basis points profit (8.5%)
  const tx = await challenge.submitEvaluation(1, 30, 850);
  await tx.wait();
  console.log("Evaluation submitted:", tx.hash);
  
  // Check challenge status
  const c = await challenge.getChallenge(1);
  console.log("Challenge status:", c.status.toString());
  console.log("0=Active, 1=Passed, 2=Failed, 3=Closed");
}

main().catch(console.error);