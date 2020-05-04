# battleship
Zero Knowledge Battleship

## Todo:
- incorporate battleship logic into zk circuit: given opponent's selected target choice, prove your response is valid. 
  - Isn't there a thing in battleship where you have to notify the opponent when your ship is sunk? That might be a pain fuk
- solidity contract that matchmakes each candidate player with another random candidate player, and stores all of the hashed static boards w/piece placements (or just 1 game total? idk, but mining latency scales linearly with # of games). 
  - it additionally maintains a public(?) state of each game board tracking the hits & misses at each location (also whether something is sunk i guess)
  - within each game, it inputs a players proof, verifies it, and updates the hits/misses of each game board
  - declares victory when all pieces have been hit
- frontend that tracks a player and opponent's game board's hits/misses (stored in the contract) and updates states accordingly
  - displays message after hit/miss and also after victory
