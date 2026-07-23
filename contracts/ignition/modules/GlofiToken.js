const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GlofiTokenModule", (m) => {
    // Get the deployer address — this will be the initial owner
    const deployer = m.getAccount(0);

    // Deploy the GlofiToken contract
    // Pass the deployer address as the initial owner
    const glofiToken = m.contract("GlofiToken", [deployer]);

    return { glofiToken };
});
