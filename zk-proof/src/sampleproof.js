import snarkjs from 'snarkjs';
import fs from 'fs';
import {pedersenHash} from './pedersenHash.js';

const generateProof = (input, pkFile, circuitFile) => {
	const proofKey = JSON.parse(fs.readFileSync(pkFile, "utf8"), 
		(key, value) =>
			typeof value === 'string' && /^\d+n$/.test(value)
			? BigInt(value.slice(0, -1))
			: value
	);
	//console.log(proofKey);

	const circuitDef = JSON.parse(fs.readFileSync(circuitFile, "utf8"));
	const circuit = new snarkjs.Circuit(circuitDef);

	const witness = circuit.calculateWitness(input);
	const {proof, publicSignals} = snarkjs.groth.genProof(proofKey, witness);
	return {proof, publicSignals};
}

const sol = BigInt(10);
const hashSol = pedersenHash(sol);

const input = {
	sol: sol,
	hashSol: sol,
};

//const pkFile = "setup/pk.json";
//const circuitFile = "circuits/main.json";
const pkFile = "setup/pk-basic.json";
const circuitFile = "circuits/basic.json";

let {proof, publicSignals} = generateProof(input, pkFile, circuitFile);

//const vkFile = "setup/vk.json";
const vkFile = "setup/vk-basic.json"
const verifyKey = JSON.parse(fs.readFileSync(vkFile, "utf8"), 
	(key, value) =>
		typeof value === 'string' && /^\d+n$/.test(value)
		? BigInt(value.slice(0, -1))
		: value
);
if (snarkjs.groth.isValid(verifyKey, proof, publicSignals)) {
	console.log("Valid proof");
} else {
	console.log("Invalid proof");
}