include "./hash.circom"

template Main() {
	signal private input sol;
	signal output hashSol;

	component pedersen = pHash();
	pedersen.in <== sol;
	hashSol <== pedersen.hashed;
}

component main = Main();