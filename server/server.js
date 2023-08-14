const express = require('express'); // using express
const app = express();
const Game = require('./Game');
//const Player = require('./Player');
const http = require('http')
const { Server } = require("socket.io")

const PORT = process.env.PORT || 3001 // setting the port

let server = http.createServer(app)
let io = new Server(server, {
    cors: {
        origin: "*",
    }
})

let games = new Map(); // Map that stores the current games

function doesRoomExist(roomCode) {
    return io.of("/").adapter.rooms.get(roomCode) != null;
}

function endGame(room, gameMessage) {
    io.in(room).emit("game-end", gameMessage);
    games.delete(room);
    console.log(`Game in room ${room} ended`)
}

function randomRoomCode() {
    let roomCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (!doesRoomExist(roomCode)) {
        return roomCode;
    } else {
        return randomRoomCode();
    }
}

io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.on("join-room", (data) => {
        let room = data.room
        let numClients = io.of("/").adapter.rooms.get(room).size;

        if (numClients == 1) { // can't exceed 2 clients per room
            socket.join(room);
            console.log(`User with ID: ${socket.id} joined room: ${room}`);
            socket.emit("joined-room", room, 'O')

            let newGame = new Game();
            games.set(room, newGame)

            io.in(room).emit("game-start", newGame.turn)
        }
    });

    socket.on("new-room", () => {
        // remove socket from all rooms
        for (let roomName of socket.rooms) {
            // The socket considers its own ID as a room, so skip that
            if (roomName !== socket.id) {
                socket.leave(roomName);
            }
        }

        let roomCode = randomRoomCode();
        socket.join(roomCode);
        socket.emit("joined-room", roomCode, 'X');
    });

    socket.on("leave-room", (data) => {
        socket.leave(data.room);

        if (games.get(data.room)) {
            endGame(data.room, "Game ended. Opponent left the game.");
        }
    });

    socket.on("move", (data) => {
        let room = data.room
        let game = games.get(room)

        if (game) {
            let moveMade = game.move(data.index, data.symbol);

            if (moveMade) {
                game.switchPlayerTurn();
                io.in(room).emit("update", game.board, game.turn);

                let gameMessage = game.checkBoard(data.symbol);

                if (gameMessage != null) {
                    endGame(room, gameMessage);
                }
            }
        }
    });

    socket.on("disconnecting", () => {
        console.log("User Disconnecting", socket.id);

        for (const roomName of socket.rooms) {
            if (games.get(roomName)) {
                endGame(roomName, "Game ended. Opponent disconnected.");
                break;
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

