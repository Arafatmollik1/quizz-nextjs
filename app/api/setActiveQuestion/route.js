import sqlite3 from "sqlite3";

const db = new sqlite3.Database('quiz.db');

export async function POST(req) {
    const { id } = await req.json();

    return new Promise((resolve, reject) => {
        // Reset all questions to inactive
        db.run(`UPDATE questions SET active = 0`, (err) => {
            if (err) {
                reject(new Response(JSON.stringify({ error: "Failed to update questions" }), { status: 500 }));
                return;
            }

            // Set the selected question as active
            db.run(`UPDATE questions SET active = 1 WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(new Response(JSON.stringify({ error: "Failed to activate question" }), { status: 500 }));
                    return;
                }

                resolve(new Response(JSON.stringify({ message: "Question activated" }), { status: 200 }));
            });
        });
    });
}
