import React from 'react';
import './App.css';
import { Board } from "./Board/Board.js"
import EnemyBoard from './Board/Enemy';
import { TakeTurn } from './Comm.js';

const Constants = require("./Consts.js");

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      // Game status refers to 0: ongoing, 1: win, 2: loss
      status: 0,
      // Phase is the phase of the game, 0: Placing, 1: Shooting, 2: End
      phase: 0,
      // Whether it is your turn or not
      myTurn: 0
    }  
    this.setStatus = this.setStatus.bind(this)
    this.advancePhase = this.advancePhase.bind(this)
  }

  setStatus(status) {
    // Use this function to receive a command of victory or defeat from the server
    this.setState({status: status})    
  }

  advancePhase() {
    console.log("advancing phase of game") 
    this.setState({
      phase: this.state.phase + 1
    })
    TakeTurn((val) => {this.setState({myTurn: val})})
  }

  generateShipInfo() {
    return Constants.SHIPS.map((ship, i) => {
      return (
        <div className="ShipInfo" key={i}>
          <h3>{ship.NAME}</h3>
          <div style={{
            backgroundColor: ship.COLOR,
            height: Constants.CELL_SZ,
            width: Constants.CELL_SZ
          }}/>
        </div>
      )
    })    
  }

  render() {
    let statusMsg = this.state.status===0 ? null : (this.state.status===1 ? <h1>You win!</h1> : <h2>You Lose!</h2>)    
    let turnMsg = this.state.myTurn === 1 ? <h1>Your turn to shoot!</h1> : <h1>Waiting on opponent</h1>
    return (
      <div className="App">
        <h1>Battleship</h1>
        {statusMsg}   
        {this.state.phase >= 1 && turnMsg}     
        {this.state.status===0 && <div className="Game">
          <div className="myBoard GameBoard">
            <h2>Your Placements</h2>
            <Board markFinished={this.advancePhase}
            turn={this.state.myTurn}
            phase={this.state.phase}
            />          
          </div>
          {this.state.phase===1 && <div className="guessBoard GameBoard">
            <h2>Your Shots on Enemy</h2>
            <EnemyBoard turn={this.state.myTurn}              
            />
          </div> }
        </div>}
        <h3>Ship Reference</h3>       
        <div className="Reference">             
          {this.generateShipInfo()}
        </div>
      </div>
    )
  } 
}

export default App;
