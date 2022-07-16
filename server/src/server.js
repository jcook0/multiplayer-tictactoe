const express = require('express'); // using express
const app = express();
const http = require('http')
const { Server } = require("socket.io")

const PORT = process.env.PORT || 3001 // setting the port

let server = http.createServer(app)
let io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})

function randomRoomCode() {
    return Math.floor(10000 + Math.random() * 999999)
}

io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
        socket.emit("room", data, 1)
        io.to(data).emit("start")
    });

    socket.on("new_room", () => {
        let roomCode = randomRoomCode().toString();
        socket.join(roomCode)
        socket.emit("room", roomCode, 0)
    });
    
    socket.on("send_move", (data) => {
        io.to(data.room).emit("receive_move", data.num, data.symbol);
    });
    
    socket.on("disconnect", (data) => {
        console.log("User Disconnected", socket.id);
    });

});
 
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});

