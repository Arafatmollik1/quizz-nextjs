"use client"
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Connect to the WebSocket server

export default function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const fetchQuestions = async () => {
        try {
            const res = await fetch('/api/questions');
            const data = await res.json();
            setQuestions(data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    useEffect(() => {
        // Fetch initial questions
        fetchQuestions();

        // Listen for real-time updates from the server
        socket.on('dataUpdate', (updatedQuestions) => {
            setQuestions(updatedQuestions);
        });

        return () => {
            socket.off('dataUpdate');
        };
    }, []);

    const activateQuestion = async (questionId) => {
        try {
            const response = await fetch('/api/setActiveQuestion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId }),
            });

            if (response.ok) {
                await fetchQuestions();
                socket.emit('questionActivated', questionId);
                setConfirmationMessage('Question activated successfully!');
                setTimeout(() => setConfirmationMessage(''), 3000);
            } else {
                console.error('Failed to activate question');
            }
        } catch (error) {
            console.error('Error activating question:', error);
        }
    };

    const deactivateAllQuestions = async () => {
        try {
            const response = await fetch('/api/setActiveQuestion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deactivateAll: true }),
            });

            if (response.ok) {
                await fetchQuestions();
                setConfirmationMessage('All questions deactivated successfully!');
                setTimeout(() => setConfirmationMessage(''), 3000);
            } else {
                console.error('Failed to deactivate all questions');
            }
        } catch (error) {
            console.error('Error deactivating all questions:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Quiz Questions</h1>

                {/* Confirmation Banner */}
                {confirmationMessage && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded">
                        {confirmationMessage}
                    </div>
                )}

                {/* Deactivate All Button */}
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={deactivateAllQuestions}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
                    >
                        Deactivate All Questions
                    </button>
                </div>

                {/* Question List */}
                <ul className="space-y-4">
                    {questions.map((question) => (
                        <li
                            key={question.id}
                            className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center"
                        >
                            <p className="text-gray-700 font-medium">{question.question}</p>
                            <button
                                onClick={() => activateQuestion(question.id)}
                                disabled={question.active === 1}
                                className={`px-4 py-2 text-sm font-semibold rounded ${
                                    question.active === 1
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                {question.active === 1 ? 'Activated' : 'Activate'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

