import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('quiz.db');

export async function GET(req) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM questions', [], (err, rows) => {
            if (err) {
                resolve(new Response(JSON.stringify({ error: 'Failed to fetch questions' }), { status: 500 }));
            } else {
                resolve(new Response(JSON.stringify(rows), { status: 200 }));
            }
        });
    });
}
