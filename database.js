// database.js
const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database
const db = new sqlite3.Database('./quiz.db');

// Create questions table
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      active INTEGER DEFAULT 0
    )
  `);
});

// Function to fetch the active question
const getActiveQuestion = (callback) => {
    db.get(`SELECT * FROM questions WHERE active = 1`, (err, row) => {
        if (err) throw err;
        callback(row);
    });
};

// Export database and helper functions
module.exports = { db, getActiveQuestion };
