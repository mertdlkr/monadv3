require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.24",
    networks: {
        monadTestnet: {
            url: "https://testnet-rpc.monad.xyz",
            chainId: 10143,
            accounts: process.env.PRIVATE_KEY !== "senin_cüzdan_private_keyin" ? [process.env.PRIVATE_KEY] : [],
        },
    },
};
