## Build
The zk-proof folder is built with yarn using ```yarn install```. It requires both the package.json and yarn.lock files - note that the versions of ```snarkjs``` and ```circom``` may be different from the latest versions.

## Flow
### 1. Creating & compiling the circuit. 
The circuit code lies in ```zk-proof/circuits/main.circom``` and is compiled using ```zk-proof/circuits/compile.js``` into a json file ```zk-proof/circuits/compile.js```

### 2. Trusted Setup.
The file ```zk-proof/src/keygen.js``` generates a proving key and verifying key in the ```zk-proof/setup``` folder. This is the public information required to create & verify the proof - think of it like the parameters of the proof. It's "trusted" because the generator has to be trusted not to store the toxic waste. 

In our system, I think we would only need to keygen once and use the same proof keys and verification keys from then on. The smart contract only needs ```vk.json``` to verify and it just needs to know to give out ```pk.json``` to each new user. In practice, I'm not sure how we would "convince" public users that the toxic waste was truly deleted. 

Note: after the users have locked their pieces but before the interactive portion starts, clients would also have to send a hashed version of their game state to the server/smart contract to store for future proof verification.

### 3. Proof Generation.
A sample proof is generated in ```zk-proof/src/sampleproof.js``` for the compiled circuit ```zk-proof/circuits/compile.js```. Currently, all this circuit does is prove that a user knows the input to a hashed output. Specifically, it's the pedersen hash. It hashes a number (BigInt) to a point on an elliptic curve, so some post-processing has to be done to convert it to a BigInt. 

We still have to implement a large portion of the circuit. The input to the hash would represent an encoded version of our game state. The circuit would have to take the query (target location for Battleship) and the query response (hit or no hit for Battleship) as public inputs. Then, it would decode/unserialize the game state and ensure that the response matches up with the input. Because our game parameters aren't exactly decided yet, I've saved this for later. 

For our purposes, the function ```generateProof()``` is the javascript function that our client backend would use to generate the proof, before serializing and sending it off to the server/smart contract. 

### 4. Proof Verification
A sample verification step is also done in ```zk-proof/src/sampleproof.js```, basically showing that the proof is valid. In practice, if we want to write a smart contract, the contract would be doing the verifying. I think ```snarkjs``` provides a method that exports a verification program to solidiy (the language that smart contracts use), but I haven't looked into this yet. The server/smart contract would also have to verify that that the hash of the proof matches up with its previously stored hash.
