const ApartmentContract = artifacts.require("ApartmentContract");

module.exports = function (deployer) {
  deployer.deploy(ApartmentContract);
};

