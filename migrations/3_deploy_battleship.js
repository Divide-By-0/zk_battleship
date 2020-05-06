const battleship = artifacts.require("Battleship");

module.exports = function(deployer) {
  deployer.deploy(battleship);
};