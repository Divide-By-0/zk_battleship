include "./boardhash.circom"
include "./hash.circom"

template BattleshipShot() {
    signal input guessX;
    signal input guessY;
    signal input pubSolnHash;
    signal input hitPub;
    signal input missPub;
    signal private input shipXCoords[17];
    signal private input shipYCoords[17];
    
    signal output solnHashOut;

    var isHit = 0;
    var isMiss = 1;
    for (var i=0; i < 17; i++) {
        if (shipXCoords[i] == guessX) {
            if (shipYCoords[i] == guessY) {
                isHit = 1;
                isMiss = 0;
            }
        }
    }
    
    isHit === hitPub;
    isMiss === missPub;

    component boardhash = BoardHash();
    for (var i = 0; i < 17; i++) {
        boardhash.shipXs[i] <-- shipXCoords[i]
        boardhash.shipYs[i] <-- shipYCoords[i]
    }
    
    solnHashOut <== boardhash.hashed;
    pubSolnHash === boardhash.hashed;
}

component main = BattleshipShot();