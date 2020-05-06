pragma solidity ^0.5.0;

contract Battleship {

    uint constant n_shipsquares = 17;
    uint constant INVALID_SHOT = 999;

    uint n_games = 0;
    uint n_activegames = 0;
    
    struct Game {
        address p1;
        address p2;
        uint64 board1;
        uint64 board2;
        uint[100] revealed1; // 0=unrevealed; 1=miss; 2=hit
        uint[100] revealed2;
        uint candidateShot; // INVALID_SHOT when no candidate, [0, 99] for shot
        uint turn; // 1 for p1, 2 for p2
        bool active;
        bool exists; // bool defaults to false
    }

    // return values not allowed within functions that modify state
    // so we need to use events to notify game creator of the game id
    event GameIDs(address indexed from, uint gameID);

    mapping(uint => Game) private games;

    function declare() external returns(uint){
        // Create new game for a user and give them gameID 
        // TODO: randomize gameID as 5 digit number or something
        Game memory newgame;
        newgame.p1 = msg.sender;
        newgame.board1 = 0;
        for(uint i = 0; i < 100; i++) {
            newgame.revealed1[i] = 0;
        }
        newgame.turn = 1;
        newgame.active = false;
        newgame.exists = true;
        newgame.candidateShot = INVALID_SHOT;

        // TODO: gameID randomize
        uint gameID = 123456;
        games[gameID] = newgame;
        emit GameIDs(msg.sender, gameID);

        n_games++;
        return gameID;
    }

    function join(uint gameID) external {
        // Allow player to join valid game if they present gameID and noone else is playing
        Game memory game = games[gameID];
        require(game.exists == true && game.active == false);

        game.p2 = msg.sender;
        game.board2 = 0;
        for(uint i = 0; i < 100; i++) {
            game.revealed2[i] = 0;
        }
        game.active = true;
        games[gameID] = game;

        n_activegames++;
    } 

    function place(uint gameID, uint64 board) external {
        Game memory game = games[gameID];
        // check that game has 2 people, and that the sender is a player w/empty board
        require(game.active == true);
        require((game.p1 == msg.sender && game.board1 == 0) || (game.p2 == msg.sender && game.board2 == 0));


        // player 1 attempting to set on empty board
        if (game.p1 == msg.sender) {
            game.board1 = board;
            games[gameID] = game;
        }
        // player 2 attempting to set on empty board
        else if (game.p2 == msg.sender) {
            game.board2 = board;
            games[gameID] = game;
        }
    }

    function fire(uint gameID, uint square) external {
        Game memory game = games[gameID];
        // check ships placed, it's sender's turn, and the coordinate is valid
        require(game.active == true && game.board1 != 0 && game.board2 != 0);
        require((game.p1 == msg.sender && game.turn == 1) || (game.p2 == msg.sender && game.turn == 2));
        require(square >= 0 && square < 100);

        game.candidateShot = square;
        games[gameID] = game;
    }

    // TODO: implement zksnark verification
    function verify(uint64 proof, uint result) internal view returns(bool) {
        return true;
    }
    // verify proof and end current turn
    function shotresult(uint gameID, uint64 proof, uint result) external returns(bool) {
        Game memory game = games[gameID];
        // check ships placed, it's opponent's turn, opponent already shot, result is valid
        require(game.active == true && game.board1 != 0 && game.board2 != 0);
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
            games[gameID] = game;
        }
        // returns true if successfully verifies proof and update was made
        return verified;
    }

    //TODO: check game end condition based on # of hits
    //TODO: end game and reset states if finished

    // NOTE: we don't need getter functions because private variables only prevent 
    // other contracts from accessing info, not the whole world
}