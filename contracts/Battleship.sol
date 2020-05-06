pragma solidity ^0.5.0;

contract Battleship {

    uint64 constant n_shipsquares = 17;
    uint64 constant INVALID_SHOT = 999;

    uint n_games = 0;
    uint n_activegames = 0;
    
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
    }

    // return values not allowed within functions that modify state
    // so we need to use events to notify game creator of the game id
    event GameIDs(address indexed from, uint gameID);

    mapping(uint => Game) private games;

    function declare() external returns(uint) {
        // Create new game for a user and give them gameID 
        // TODO: randomize gameID as 5 digit number or something

        // TODO: gameID randomize
        uint gameID = 123456;
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

        emit GameIDs(msg.sender, gameID);

        n_games++;
        return gameID;
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
    // verify proof and end current turn
    function resolveShot(uint gameID, uint64 proof, uint64 result) external returns(bool) {
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
        // returns true if successfully verifies proof and update was made
        return verified;
    }

    //TODO: check game end condition based on # of hits
    //TODO: end game and reset states if finished

    // NOTE: we don't need getter functions because private variables only prevent 
    // other contracts from accessing info, not the whole world
}