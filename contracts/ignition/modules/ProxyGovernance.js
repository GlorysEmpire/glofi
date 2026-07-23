const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ProxyGovernanceModule", (m) => {
    const deployer = m.getAccount(0);
    const GLOFI_TOKEN = "0x5B9dEE5d96BdF3F7E3aa4e4FD8A0ad29b4082a2C";

    const proxyGovernance = m.contract("ProxyGovernance", [
        deployer,
        GLOFI_TOKEN,
    ]);

    return { proxyGovernance };
});