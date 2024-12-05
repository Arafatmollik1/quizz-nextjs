"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Page() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const socket = io("http://localhost:3001");

        // Listen for data updates
        socket.on("dataUpdate", (data) => {
            setQuestions(data);
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Quiz Questions</h1>

                {/* Questions List */}
                <div className="space-y-4">
                    {questions.map((q) => (
                        <div
                            key={q.id}
                            className={`p-4 border rounded-lg ${
                                q.active === 1
                                    ? "bg-green-100 border-green-300"
                                    : "bg-gray-50 border-gray-200"
                            }`}
                        >
                            <p className="text-gray-700 font-medium">{q.question}</p>
                            <small
                                className={`block mt-2 text-sm font-semibold ${
                                    q.active === 1
                                        ? "text-green-700"
                                        : "text-gray-500"
                                }`}
                            >
                                {q.active === 1 ? "Active" : "Inactive"}
                            </small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
