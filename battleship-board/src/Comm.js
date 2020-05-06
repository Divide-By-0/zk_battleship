import openSocket from 'socket.io-client';

var socket = null

function RegisterClient(cb) {
    socket = openSocket('http://localhost:8000')
    cb()
}

function TakeTurn(cb) {
    socket.on('go', (val) => cb(val))
}

function TakeShot(loc) {
    console.log("Emitting shot")
    socket.emit('take_shot', loc)
}

function ReceiveShot(cb) {    
    socket.on('shot_at', (loc) => cb(loc))
}

function RespondShot(resp) {
    socket.emit('shot_response', resp)
}

function ReceiveResult(cb) {
    socket.on('result', resp => cb(resp))
}


export { TakeTurn, RegisterClient, TakeShot, ReceiveShot, ReceiveResult, RespondShot }