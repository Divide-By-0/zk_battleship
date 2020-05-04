# battleship
Zero Knowledge Battleship

## Details

built using truffle. and drizzle in theory. I say in theory because npm is being stupid as fuck on my laptop and it's not letting me install the drizzle package. send help.

anyways there's a helloworld contract that's deployable (onto ganache) and testable. it's compiled into battleship/src/contracts. the idea behind drizzle is that you can listen to the state of a smart contract using drizzlestore and then just propagate that state through your react components. there's some extra framework code that you need to add to be able to do this, so i've edited battleship/src/app.js and battleship/src/index.js. 

https://www.trufflesuite.com/tutorials/getting-started-with-drizzle-and-react