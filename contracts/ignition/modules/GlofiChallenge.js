const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GlofiChallengeTestModule", (m) => {
  const deployer = m.getAccount(0);

  const USDC_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
  const GLOFI_TOKEN = "0x5B9dEE5d96BdF3F7E3aa4e4FD8A0ad29b4082a2C";
  const GLOFI_POOL = "0x43736a144cF4B9dcC2b9a2426C9D69F8Dd529803";

  const glofiChallenge = m.contract("GlofiChallenge", [
    deployer,
    GLOFI_POOL,
    GLOFI_TOKEN,
    USDC_ADDRESS,
  ]);

  return { glofiChallenge };
});