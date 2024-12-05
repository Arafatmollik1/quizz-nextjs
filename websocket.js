const { Server } = require("socket.io");
const sqlite3 = require('sqlite3').verbose();

const io = new Server(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const db = new sqlite3.Database('quiz.db');

/*function broadcastQuestions() {
    db.all("SELECT * FROM questions where active=1", [], (err, rows) => {
        if (!err) {
            socket.broadcast.emit("dataUpdate", rows);
        }
    });
}*/

io.on("connection", (socket) => {
    db.all("SELECT * FROM questions where active=1", [], (err, rows) => {
        if (!err) {
            socket.broadcast.emit("dataUpdate", rows);
        }
    });

    // Add listener for questionActivated event
    socket.on('questionActivated', (questionId) => {
        db.all("SELECT * FROM questions where active=1", [], (err, rows) => {
            if (!err) {
                socket.broadcast.emit("dataUpdate", rows);
            }
        });
    });

    console.log("Client connected");
    // Clean up interval when client disconnects
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});