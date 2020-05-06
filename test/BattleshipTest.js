const Battleship = artifacts.require("./Battleship.sol");

contract("Battleship", accounts => {
	it("Joined valid game", async () => {
		const battleship = await Battleship.deployed();
		let result = await battleship.declare({from: accounts[0]}); // user 0 creates game
		let gameID = result.logs[0].args["gameID"].toNumber(); // get gameID from event log
		await battleship.join(gameID, {from: accounts[1]}); // user 1 joins game
	});
});