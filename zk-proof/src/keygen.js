//const snarkjs = require('snarkjs');
//const fs = require('fs');
//const compile = require('circom');
//const bigInt = require("big-integer");

//import * as snarkjs from 'snarkjs';
//import * as fs from 'fs';

import snarkjs from 'snarkjs';
import fs from 'fs';

const keygen = (proofKeyOutput, verifyKeyOutput, circuitFile) => {
	const circuitDef = JSON.parse(fs.readFileSync(circuitFile, "utf8"));
	const circuit = new snarkjs.Circuit(circuitDef);
	const setup = snarkjs.groth.setup(circuit);	

	/*console.log( setup.vk_proof);
	for (var key in setup.vk_proof) {
		let x = setup.vk_proof[key];
		if (typeof x != 'bigint') {
			console.log(x);
		}
	}*/
	fs.writeFileSync(proofKeyOutput, 
		JSON.stringify(setup.vk_proof, (key, value) => 
			typeof value === 'bigint'
			? value.toString() + 'n'
			: value
		)
	, "utf8");
	fs.writeFileSync(verifyKeyOutput, 
		JSON.stringify(setup.vk_verifier, (key, value) => 
			typeof value === 'bigint'
			? value.toString() + 'n'
			: value
		)
	, "utf8");
}

const circuitFile = "circuits/circuit.json";
const proofKeyOutput = "setup/pk.json";
const verifyKeyOutput = "setup/vk.json";
/*const circuitFile = "circuits/basic.json";
const proofKeyOutput = "setup/pk-basic.json";
const verifyKeyOutput = "setup/vk-basic.json";*/
keygen(proofKeyOutput, verifyKeyOutput, circuitFile);
