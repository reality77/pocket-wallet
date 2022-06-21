var PocketWalletFactory = artifacts.require('PocketWalletFactory');

module.exports = function (deployer) {
  deployer.deploy(PocketWalletFactory);
};
