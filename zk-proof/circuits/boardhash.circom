include "../node_modules/circomlib/circuits/pedersen.circom";
include "../node_modules/circomlib/circuits/bitify.circom"
include "./hash.circom"

template BoardHash() {
    signal input shipXs[17];
    signal input shipYs[17];

    var n = 136;
    signal output hashed;
    component hash = Pedersen(n)
    
    var index = 0;
    for (var i = 0; i < 17; i++) {            
        for (var j=0; j < 4; j++) {
            hash.in[index+j] <-- (shipXs[i] >> j) & 1;
        }
        index = index+4;        
        for (var j=0; j < 4; j++) {
            hash.in[index+j] <-- (shipYs[i] >> j) & 1;
        }
        index = index+4;
    }
    component p2n = point2num();
	p2n.x <== hash.out[0];
	p2n.y <== hash.out[1];
    
	hashed <== p2n.out;
}