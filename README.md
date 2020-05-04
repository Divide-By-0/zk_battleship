# battleship
Zero Knowledge Battleship

## Todo:
- incorporate battleship logic into circuit: given opponent's selected target choice, prove your response is valid
- solidity contract that matchmakes each candidate player with another random candidate player, and stores all of the games (or just 1 game total? idk, but mining latency scales linearly with # of games). Within each game, it inputs a players proof, veriies it, and updates the state of that player's game board
- frontend that tracks a player and opponent's game board and updates states accordingly. displays message after every hit or miss
