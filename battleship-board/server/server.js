const io = require('socket.io')();

var players = []
let _turn = 0
let turn_num = 0
let started = false
turn_started = false

function start_game() {
    players[0].emit('go', 1)
    started = true
}

function next_turn() {    
    turn_num++
    _turn = turn_num % players.length
    console.log("Advancing turn to", _turn)
    for (let i=0; i < players.length; i++) {
        if (i==_turn) {
            players[i].emit('go', 1)
        } else {
            players[i].emit('go', 0)
        }
    }
    turn_started = false  
}

function respond_shot(resp) {    
    players[_turn].emit("result", resp)
}

function take_shot(loc) {
    turn_started = true
    let target = (_turn + 1) % players.length
    players[target].emit('shot_at', loc)    
}

io.on('connection', (client) => {
    players.push(client)
    console.log("Player registered!")
    if (players.length == 2) {
        console.log("Starting game")
        start_game()
    }
    client.on('take_shot', (loc) => {
        console.log("Shot event", client.id, players[_turn].id)
        if (started && !turn_started && players[_turn].id === client.id) {
            console.log("Client shot at", loc)
            take_shot(loc)
        }
    })

    client.on('shot_response', (resp) => {
        if (started && players[_turn].id != client.id) {
            respond_shot(resp)
            next_turn()
        }
    })

    client.on('disconnect', function() {
        console.log('Client disconnected')
        players.splice(players.indexOf(client), 1)
        _turn--
    })
})

const port = 8000;
io.listen(port)
console.log("listening on port ", port)