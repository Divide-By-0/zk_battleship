const HelloWorld = artifacts.require("./HelloWorld.sol");

contract("HelloWorld", accounts => {
	it("should display Hello", async () => {
		const helloworld = await HelloWorld.deployed();
		await helloworld.set("Hello", {from: accounts[0]});
		const stringval = await helloworld.myString.call();
		assert.equal(stringval, "Hello");
	});
});