import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('quiz.db');

export async function POST(req) {
    const { questionId, deactivateAll } = await req.json();

    return new Promise((resolve, reject) => {
        if (deactivateAll) {
            db.run('UPDATE questions SET active = 0', [], function (err) {
                if (err) {
                    reject(new Response(JSON.stringify({ error: "Failed to update questions" }), { status: 500 }));
                } else {
                    resolve(new Response(JSON.stringify({ message: 'All questions deactivated successfully' }), { status: 200 }));
                }
            });
        } else if (questionId) {
            db.run(`UPDATE questions SET active = 0`, (err) => {
            if (err) {
                reject(new Response(JSON.stringify({ error: "Failed to update questions" }), { status: 500 }));
                return;
            }

            db.run(
                'UPDATE questions SET active = 1 WHERE id = ?',
                [questionId],
                function (err) {
                    if (err) {
                        resolve(new Response(JSON.stringify({ error: 'Failed to update question' }), { status: 500 }));
                    } else {
                        resolve(new Response(JSON.stringify({ message: 'Question activated successfully' }), { status: 200 }));
                    }
                }
            );
        });
        }
    });
}
