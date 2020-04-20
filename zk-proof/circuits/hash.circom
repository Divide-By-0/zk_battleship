include "../node_modules/circomlib/circuits/pedersen.circom"
include "../node_modules/circomlib/circuits/bitify.circom";

template point2num() {
    signal input x;
    signal input y;
    signal output out;

    var n = 256;

    component xBits = Num2Bits(n);
    xBits.in <-- x;

    component yBits = Num2Bits(n);
    yBits.in <-- y;

    component resultNum = Bits2Num(n);
    for (var i=0; i<256-8; i++) {
        resultNum.in[i] <-- yBits.out[i];
    }

    for (var j=256-8; j<n; j++) {
        resultNum.in[j] <-- xBits.out[j];
    }

    out <-- resultNum.out;
}


template pHash() {
	signal input in;
	signal output hashed;

	var n = 256;

	component n2b = Num2Bits(n);
	n2b.in <== in;

	component pedersen = Pedersen(n);
	for(var i=0; i<n; i++) {
		pedersen.in[i] <-- n2b.out[i]
	}

	component p2n = point2num();
	p2n.x <== pedersen.out[0];
	p2n.y <== pedersen.out[1];

	hashed <== p2n.out;
}