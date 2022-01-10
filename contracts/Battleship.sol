pragma solidity ^0.5.0;

contract Battleship {

    uint64 constant n_shipsquares = 17;
    uint64 constant INVALID_SHOT = 999;
    uint64 constant g = 69;
    uint64 constant p = 999983;

    uint64 n_games = 0;
    uint64 n_activegames = 0;
    uint64 last_id = 1;
    
    struct Game {
        address p1;
        address p2;
        uint64 board1;
        uint64 board2;
        uint64[100] revealed1; // 0=unrevealed; 1=miss; 2=hit
        uint64[100] revealed2;
        uint64 candidateShot; // INVALID_SHOT when no candidate, [0, 99] for shot
        uint64 turn; // 1 for p1, 2 for p2
        bool active;
        bool exists; // bool defaults to false
        uint64 winner; // 0 for noone, 1 for p1 wins, 2 for p2 wins
    }

    // TODO: write function that kills inactive/finished games after a time limit

    // return values not allowed within functions that modify state
    // so we need to use events to notify game creator of the game id
    event GameIDs(address indexed from, uint gameID);

    mapping(uint => Game) games;

    function declare() external {
        // Create new game for a user and give them gameID 

        // pseudorandom gameID
        uint64 gameID = (last_id * g) % p;
        while (games[gameID].exists) {
            gameID = (gameID + 1) % p;
        }
        last_id = gameID;

        Game storage game = games[gameID];

        game.p1 = msg.sender;
        game.board1 = 0;
        for (uint64 i = 0; i < 100; i++) {
            game.revealed1[i] = 0;
        }
        game.turn = 1;
        game.active = false;
        game.exists = true;
        game.candidateShot = INVALID_SHOT;

        n_games++;

        emit GameIDs(msg.sender, gameID);
    }

    function join(uint gameID) external {
        // Allow player to join valid game if they present gameID and noone else is playing
        Game storage game = games[gameID];
        require(game.exists && !game.active);

        game.p2 = msg.sender;
        game.board2 = 0;
        for (uint64 i = 0; i < 100; i++) {
            game.revealed2[i] = 0;
        }
        game.active = true;

        n_activegames++;
    } 

    function place(uint gameID, uint64 board) external {
        Game storage game = games[gameID];
        // check that game has 2 people, and that the sender is a player w/empty board
        require(game.active);
        require((game.p1 == msg.sender && game.board1 == 0) || (game.p2 == msg.sender && game.board2 == 0));


        // player 1 attempting to set on empty board
        if (game.p1 == msg.sender) {
            game.board1 = board;
        }
        // player 2 attempting to set on empty board
        else if (game.p2 == msg.sender) {
            game.board2 = board;
        }
    }

    function fire(uint gameID, uint64 square) external {
        Game storage game = games[gameID];
        // check ships placed, it's sender's turn, and the coordinate is valid
        require(game.active && game.board1 != 0 && game.board2 != 0);
        require((game.p1 == msg.sender && game.turn == 1) || (game.p2 == msg.sender && game.turn == 2));
        require(game.candidateShot == INVALID_SHOT && square < 100);

        game.candidateShot = square;
    }

    // TODO: implement zksnark verification
    function verify(uint64 proof, uint result) internal pure returns(bool) {
        return true;
    }
    // verify proof and end current turn. potentially end game
    function resolveShot(uint gameID, uint64 proof, uint64 result) external {
        Game storage game = games[gameID];
        // check ships placed, it's opponent's turn, opponent already shot, result is valid
        require(game.active && game.board1 != 0 && game.board2 != 0);
        require((game.p1 == msg.sender && game.turn == 2) || (game.p2 == msg.sender && game.turn == 1));
        require(game.candidateShot != INVALID_SHOT);
        require(result == 0 || result == 1);
        bool verified = verify(proof, result);
        if (verified) {
            // process shot result
            if (game.turn == 1) {
                game.revealed1[game.candidateShot] = result + 1;
            } else if (game.turn == 2) {
                game.revealed2[game.candidateShot] = result + 1;
            }
            // end current turn
            game.turn = 3 - game.turn;
            game.candidateShot = INVALID_SHOT;
        }
        checkGameEnd(gameID);
    }

    // check game end condition based on # of hits
    // end the game if the game has finished
    function checkGameEnd(uint gameID) internal returns(uint64){
        Game storage game = games[gameID];
        uint64 p1_hits = 0;
        uint64 p2_hits = 0;
        for (uint64 i = 0; i < 100; i++) {
            if (game.revealed1[i] == 2) {
                p1_hits++;
            }
            if (game.revealed2[i] == 2) {
                p2_hits++;
            }
        }
        if (p1_hits == n_shipsquares) {
            game.winner = 1;
        }
        if (p2_hits == n_shipsquares) {
            game.winner = 2;
        }
    }

    function killGame(uint gameID) external {
        Game memory game = games[gameID];
        require(msg.sender == game.p1 || msg.sender == game.p2);
        delete games[gameID];
    }

    // On second thought it might be easier to implement a getter function
    // for convenience even though the game state is public
    // (we can return just one game not everything)
}