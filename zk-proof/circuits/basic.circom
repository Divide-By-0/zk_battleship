template Main() {
	signal private input sol;
	signal output hashSol;
	hashSol <== sol + 0;
}

component main = Main();