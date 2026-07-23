const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GlofiPoolModule", (m) => {
    const deployer = m.getAccount(0);

    // Polygon Amoy USDC test address
    const USDC_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";

    // Your deployed GLOFI token address
    const GLOFI_TOKEN_ADDRESS = "0x5B9dEE5d96BdF3F7E3aa4e4FD8A0ad29b4082a2C";

    const glofiPool = m.contract("GlofiPool", [
        deployer,
        USDC_ADDRESS,
        GLOFI_TOKEN_ADDRESS,
    ]);

    return { glofiPool };
});