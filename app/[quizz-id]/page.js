"use client"

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Page() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const socket = io("http://localhost:3001");

        socket.on("dataUpdate", (data) => {
            setQuestions(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Quiz Questions</h1>
            {questions.map((q) => (
                <div key={q.id}>
                    <p>{q.question}</p>
                    <small>Active: {q.active}</small>
                </div>
            ))}
        </div>
    );
}