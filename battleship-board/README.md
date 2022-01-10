## Setup
Should just be able to run ```npm i``` to install the necessary packages. I built it with the latest versions of node and npm etc.

Would highly recommend https://github.com/coreybutler/nvm-windows to easily manage versions of node.

## Running
```npm run start``` to start the development version of the board. Should open at http://localhost:3000. I've tested it on windows and linux, on firefox and chrome so it *should* work.

## Playing
Currently this is just a front end, so its pretty much useless. That being said, the game is divided into two phases: placement and shooting. In src/Consts.js I've defined a DEBUG constant. Setting this to true will allow you to bypass some rules for easier testing.
### Placement
During placement, click one of the buttons to select a ship to place. Then, click a square on the board to place the ship there. Once you've selected a square, you can press the R key on your keyboard to rotate the ship's orientation. Once you're satisfied, hit enter to lock the ship in place. You can then proceed. You shouldn't be able to lock in invalid positions.

### Shooting
Once all your ships are placed, press the "lock positions" button to move into the shooting phase. At this point, a second board will appear that represents the opponents. You can shoot by pressing the button and then clicking the board. I've written a dummy function that randomly decides if you hit or not, and randomly selects a ship you hit, in the actual game I imagine our backend will take care of this.