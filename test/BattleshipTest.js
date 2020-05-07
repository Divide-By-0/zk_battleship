const Battleship = artifacts.require("./Battleship.sol");

contract("Battleship", accounts => {
	it("Joined multiple valid games", async () => {
		const battleship = await Battleship.deployed();
		for(i = 0; i < 3; i++) {
			let result = await battleship.declare({from: accounts[0]}); 
			let gameID = result.logs[0].args["gameID"].toNumber(); 
			await battleship.join(gameID, {from: accounts[1]}); 
		}
	});
	it("Placing ships", async () => {
		const battleship = await Battleship.deployed();
		let result = await battleship.declare({from: accounts[0]}); 
		let gameID = result.logs[0].args["gameID"].toNumber(); 
		await battleship.join(gameID, {from: accounts[1]}); 
		await battleship.place(gameID, 1, {from: accounts[0]});
		await battleship.place(gameID, 2, {from: accounts[1]});
	});
});