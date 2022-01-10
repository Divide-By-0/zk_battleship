# battleship
Zero Knowledge Battleship

## Battleship.sol Contract
Some progress made on the contract. More TODOs in the comments. See battleshiptest.js for which parts I've tested. 

## Details

built using truffle. and drizzle in theory. I say in theory because npm is being stupid as fuck on my laptop and it's not letting me install the drizzle package. send help.

anyways there's a helloworld contract that's deployable (onto ganache) and testable. it's compiled into battleship/src/contracts. the idea behind drizzle is that you can listen to the state of a smart contract using drizzlestore and then just propagate that state through your react components. there's some extra framework code that you need to add to be able to do this, so i've edited battleship/src/app.js and battleship/src/index.js. 

https://www.trufflesuite.com/tutorials/getting-started-with-drizzle-and-react
=======

## Todo:
- incorporate battleship logic into zk circuit: given opponent's selected target choice, prove your response is valid. 
  - Isn't there a thing in battleship where you have to notify the opponent when your ship is sunk? That might be a pain fuk
- solidity contract that matchmakes each candidate player with another random candidate player, and stores all of the hashed static boards w/piece placements (or just 1 game total? idk, but mining latency scales linearly with # of games). 
  - it additionally maintains a public(?) state of each game board tracking the hits & misses at each location (also whether something is sunk i guess)
  - within each game, it inputs a players proof, verifies it, and updates the hits/misses of each game board
  - declares victory when all pieces have been hit
- frontend that tracks a player and opponent's game board's hits/misses (stored in the contract) and updates states accordingly
  - displays message after hit/miss and also after victory
