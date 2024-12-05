const { Server } = require("socket.io");
const sqlite3 = require('sqlite3').verbose();

const io = new Server(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const db = new sqlite3.Database('quiz.db');

function broadcastQuestions() {
    db.all("SELECT * FROM questions where active=1", [], (err, rows) => {
        if (!err) {
            io.emit("dataUpdate", rows);
        }
    });
}

io.on("connection", (socket) => {
    // Initial data send
    broadcastQuestions();

    console.log("Client connected");
    // Clean up interval when client disconnects
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});