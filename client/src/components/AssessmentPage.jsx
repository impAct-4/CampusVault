import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const assessmentQuestions = [
    {
        id: 1,
        question: 'What is a variable in programming?',
        options: ['A storage location', 'A function', 'A loop', 'A module'],
        correctAnswer: 0,
    },
    {
        id: 2,
        question: 'Which data structure uses LIFO?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1,
    },
    {
        id: 3,
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
        correctAnswer: 2,
    },
    {
        id: 4,
        question: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query List', 'Structured Question List', 'Simple Query Language'],
        correctAnswer: 0,
    },
    {
        id: 5,
        question: 'Which sorting algorithm has the best average-case complexity?',
        options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
        correctAnswer: 1,
    },
];

export default function AssessmentPage() {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [skillCategory, setSkillCategory] = useState('');
    const [authToken, setAuthToken] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) navigate('/login');
            else setAuthToken(await user.getIdToken());
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleAnswer = (index) => {
        setAnswers({ ...answers, [currentQuestion]: index });
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < assessmentQuestions.length) {
            alert('Please answer all questions');
            return;
        }

        try {
            const answerData = assessmentQuestions.map((q, idx) => ({
                questionId: q.id,
                selectedOptionIndex: answers[idx],
            }));

            const response = await fetch(`${API_BASE}/assessment/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ answers: answerData }),
            });

            if (response.ok) {
                const data = await response.json();
                setScore(data.score);
                setSkillCategory(data.skillCategory);
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Error submitting assessment:', error);
            alert('Failed to submit assessment');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <div className="nx-shell">
            <div className="nx-frame min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2.5rem)]">
            {/* Header */}
            <nav className="nx-topbar sticky top-3 z-50 md:top-5">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-black font-medium">
                    <ArrowLeft size={20} />
                    Back
                </button>
                <h1 className="text-2xl font-bold text-black">Skill Assessment</h1>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-700 font-medium">
                    <LogOut size={20} />
                    Logout
                </button>
            </nav>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-5 py-12 md:px-8">
                {!submitted ? (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-8">
                        {/* Progress */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-bold text-black">Question {currentQuestion + 1}/{assessmentQuestions.length}</h2>
                                <span className="text-sm text-gray-600">{Math.round(((currentQuestion + 1) / assessmentQuestions.length) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-2">
                                <div
                                    className="bg-black h-2 rounded-full transition-all"
                                    style={{ width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-black mb-6">
                                {assessmentQuestions[currentQuestion].question}
                            </h3>

                            {/* Options */}
                            <div className="space-y-3">
                                {assessmentQuestions[currentQuestion].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className={`w-full p-4 rounded-lg border-2 transition text-left ${
                                            answers[currentQuestion] === idx
                                                ? 'border-black bg-gray-200 text-black font-medium'
                                                : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                                        }`}
                                    >
                                        <span className="font-semibold">{String.fromCharCode(65 + idx)}.</span> {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between gap-4">
                            <button
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                                className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                Previous
                            </button>

                            {currentQuestion === assessmentQuestions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
                                >
                                    Submit Assessment
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    // Results
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-12 text-center">
                        <h2 className="text-3xl font-bold text-black mb-2">Assessment Complete! 🎉</h2>
                        <p className="text-gray-600 mb-8">Here's your performance summary</p>

                        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-8">
                            <div className="text-5xl font-bold text-black mb-2">{score}%</div>
                            <p className="text-gray-700 mb-4">Your Score</p>
                            <div className="w-full bg-gray-300 rounded-full h-3 mb-6">
                                <div className="bg-black h-3 rounded-full" style={{ width: `${score}%` }} />
                            </div>

                            <div className="text-2xl font-bold text-black mb-2">{skillCategory}</div>
                            <p className="text-gray-600 mb-6">Your Skill Level</p>

                            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-sm text-gray-700">
                                {score >= 80
                                    ? 'Excellent! You are ready for advanced interviews.'
                                    : score >= 60
                                    ? 'Good! You are interview-ready. Keep practicing!'
                                    : 'Keep practicing! Review the basics and retake the assessment.'}
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
}
