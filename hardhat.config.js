require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    sepolia: {
      url:"QUICKNODE_HTTP_URL",
      accounts:["PRIVATE_KEY"],
  }
}
};
