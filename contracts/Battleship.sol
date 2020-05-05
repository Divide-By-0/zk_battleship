pragma solidity ^0.5.0;

contract Battleship {
    
    struct Game {
        address p1;
        address p2;
        uint64 board1;
        uint64 board2;
        bool revealed1[100];
        bool revealed2[100];
        bool turn; // false for p1, true for p2
        bool active;
    }

    mapping(uint64 => Game) private games;

    function declare(address opponent) external {
        // add game to active games
    }

    function place(uint64 gameId, uint64 board) external returns(bool) {
        Game storage game = games[gameId];
        require(game.active == true && (game.p1 == msg.sender || game.p2 == msg.sender));

        // player 1 attempting to set on empty board
        if (game.p1 == msg.sender && game.board1 == 0) {
            game.board1 = board;
            return true;
        }
        // player 2 attempting to set on empty board
        else if (game.p2 == msg.sender && game.board2 == 0) {
            game.board2 = board;
            return true;
        }
        return false;
    }

    function fire(uint64 gameId, uint64 square) external returns(bool) {
        Game storage game = games[gameId];
        require(game.active == true && (game.p1 == msg.sender || game.p2 == msg.sender));
        require(game.board1 != 0 && game.board2 != 0 && (game.p1 == msg.sender ^ game.turn));
        require(square < 100);

        return false;
        // returns true if hit, false if miss
        // updates corrects revealed
    }

    // I think we need a viewGame function for players to see the game state?
}