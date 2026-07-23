const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GlofiPayoutModule", (m) => {
    const deployer = m.getAccount(0);

    const USDC_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
    const GLOFI_POOL = "0x43736a144cF4B9dcC2b9a2426C9D69F8Dd529803";

    // Treasury is your wallet for now — will be a multisig in production
    const TREASURY = deployer;

    const glofiPayout = m.contract("GlofiPayout", [
        deployer,
        GLOFI_POOL,
        USDC_ADDRESS,
        TREASURY,
    ]);

    return { glofiPayout };
});