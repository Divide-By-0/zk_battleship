import React from 'react';
import "./Board.css";
import Square from "./Square.js"
import { RegisterClient, ReceiveShot, RespondShot } from '../Comm.js';

const Constants = require("../Consts.js");


class Board extends React.Component {
    constructor(props) {
        super(props);
        let shipPlacements = {};
        Constants.SHIPS.forEach(ship => {
            shipPlacements[ship.NAME] = null
        })        
        this.state = {
            grid: Array(Constants.GRID_SZ).fill().map(_ => Array(Constants.GRID_SZ).fill('-')),      
            placements: shipPlacements,      
            placing: null,
            locked: false,
            invalid: false
        }
        this.rotation = 0
        this.rotations = [[1, 0], [0, 1], [-1, 0], [0, -1]]
        this.handleClick = this.handleClick.bind(this)
        this.generateBoard = this.generateBoard.bind(this)
        this.calculateOccupied = this.calculateOccupied.bind(this)
        this.placeShip = this.placeShip.bind(this)
        this.lockPositions = this.lockPositions.bind(this)
        this.handleKey = this.handleKey.bind(this)
        this.finalizeShip = this.finalizeShip.bind(this)
        this.markSquare = this.markSquare.bind(this)
        this.receiveShot = this.receiveShot.bind(this)
        this.registerSocketEvents = this.registerSocketEvents.bind(this)
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKey, false)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKey, false);
    }

    handleKey(event) {
        if (event.keyCode === 82 && this.state.placing !== null) {
            this.rotation = (this.rotation + 1) % 4     
            this.calculateOccupied()       
        }
        if (event.keyCode === 13 && this.state.placing !== null && !this.state.invalid) {
            this.finalizeShip()
        }
    }

    handleClick(x, y) {
        console.log("Square at (" + x + "," + y + ") was clicked")
        if (this.state.placing !== null) {
            this.placeAt = [x, y]            
            this.calculateOccupied()
        }
    }

    finalizeShip() {
        let coords = []
        let places = this.state.placements
        let rfactor = this.rotations[this.rotation]  
        for (let i = 0; i < this.state.placing.size; i++) {                
            let x = this.placeAt[0] + rfactor[0] * i
            let y = this.placeAt[1] + rfactor[1] * i
            coords.push([x, y])
        }            
        places[this.state.placing.name] = coords
        let grid = this.state.grid
        coords.forEach((coord) => {
            grid[coord[0]][coord[1]] = this.state.placing.color
        })
        this.setState({
            grid: grid,
            placements: places,
            placing: null
        })        
    }

    placeShip(size, color, name) {                                
        let places = this.state.placements    
        let grid = this.state.grid
        if (places[name] !== null) {
            places[name].forEach(coord => {
                grid[coord[0]][coord[1]] = '-'
            })
            places[name] = null    
        }                
        this.setState({
            grid: grid,
            placements: places,
            placing: {name: name, size: size, color: color}
        })
    }

    async calculateOccupied() {
        let grid = this.state.grid                
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                if (grid[i][j]===Constants.PLACEHOLDER) {
                    grid[i][j] = '-';
                }
            }
        }
        let location = this.placeAt        
        let rfactor = this.rotations[this.rotation]  
        this.setState({invalid: false})      
        for (let i = 0; i < this.state.placing.size; i++) {
            let x = location[0] + rfactor[0] * i
            let y = location[1] + rfactor[1] * i
            if (x > 9 || x < 0 || y > 9 || y < 0) {
                this.setState({invalid: true})
            } else if (grid[x][y] !== "-") {
                this.setState({invalid: true})
            } else {
                grid[x][y] = Constants.PLACEHOLDER
            }
        }
        this.setState({grid: grid})
    }

    registerSocketEvents() {
        ReceiveShot(this.receiveShot)
        this.props.markFinished()
    }

    lockPositions() {     
        let canLock = true
        for (let ship of Constants.SHIPS) {            
            let name = ship.NAME
            if (this.state.placements[name] === null && !Constants.DEBUG) {
                alert("You haven't placed your " + name)
                canLock = false
                break
            }            
        }
        if (canLock || Constants.DEBUG) {            
            this.setState({locked: true})            
            // Fill in this function to serialize and send the positions to a server
            RegisterClient(this.registerSocketEvents)
        }
    }

    generateShipButtons() {
        return Constants.SHIPS.map((ship, i) => {            
            return (<button style={{backgroundColor: ship.COLOR, height: Constants.CELL_SZ, width: "18%", fontSize: "1.5em"}}
                    onClick={() => this.placeShip(ship.SIZE, ship.COLOR, ship.NAME)} 
                    key={i}>{ship.NAME}</button>)
        })
    }
        
    generateBoard() {
        let board = this.state.grid.map((row, i) => {return (
            <tr key={`row_${i}`}>
                {row.map((_, j) => {
                    let color = this.state.grid[i][j] === '-' ? "white" : this.state.grid[i][j]                    
                    return (
                        <Square clicked={()=>this.handleClick(i, j)} color={color} size={Constants.CELL_SZ} key={i+","+j}/>
                    )                    
                })}
            </tr>
        )})
        return board
    }    

    receiveShot(loc) {
        console.log("Taking a shot at", loc)
        if (this.state.grid[loc.x][loc.y] !== '-') {
            RespondShot({hit: true, x:loc.x, y:loc.y})
            this.markSquare(loc.x, loc.y, Constants.HIT)
        } else {
            RespondShot({hit: false, x:loc.x, y:loc.y})
            this.markSquare(loc.x, loc.y, Constants.MISS)
        }
    }

    markSquare(x, y, color) {
        // Use this function as the receptor of a command from the server that a ship got hit
        // I imagine that the server will control winning and losing
        let grid = this.state.grid
        grid[x][y] = color
        this.setState({grid: grid})
    }
    
    render() {        
        this.generateShipButtons()
        let board = this.generateBoard()
        let placementText = this.state.placing!==null ? "Placing: " + this.state.placing.name  : "Click one of the buttons to place a ship"
        
        
        return (
            <div className="boardContainer">                
                {!this.state.locked && <div className="shipButtons">
                    {this.generateShipButtons()}
                    <h3>{placementText}</h3>
                </div>}                
                {this.state.invalid && <h3 className="warning">WARNING: Placement is invalid</h3>}
                <table cellSpacing="0" className="boardTable">
                    <tbody>
                        {board}
                    </tbody>                    
                </table>
                {!this.state.locked && <button onClick={this.lockPositions}>Lock in Positions</button>}
            </div>
        )
    }
}

export { Board };