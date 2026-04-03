import { useEffect, useState, useCallback } from 'react';
import QuestionForm from './QuestionForm';
import QuestionCard from './QuestionCard';

export const QuestionForum = ({ authToken, currentUserId }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [filterCompany, setFilterCompany] = useState('');
    const [filterPaidOnly, setFilterPaidOnly] = useState(false);
    const [purchasedQuestions, setPurchasedQuestions] = useState(new Set());
    const [isPosting, setIsPosting] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(null);
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            let url = `${API_BASE}/questions`;
            const params = new URLSearchParams();
            if (filterCompany) {
                params.append('company', filterCompany);
            }
            if (filterPaidOnly) {
                params.append('isPaid', 'true');
            }
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }

            const data = await response.json();
            setQuestions(data.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    }, [filterCompany, filterPaidOnly, API_BASE]);

    const checkPurchaseStatus = useCallback(async () => {
        if (!authToken || !currentUserId) {
            return;
        }

        try {
            const purchased = new Set();

            for (const question of questions) {
                try {
                    const response = await fetch(`${API_BASE}/questions/${question.id}/has-purchased`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.hasPurchased) {
                            purchased.add(question.id);
                        }
                    }
                } catch (err) {
                    console.error(`Failed to check purchase status for question ${question.id}:`, err);
                }
            }

            setPurchasedQuestions(purchased);
        } catch (err) {
            console.error('Failed to check purchase status:', err);
        }
    }, [authToken, currentUserId, questions, API_BASE]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    useEffect(() => {
        if (questions.length > 0) {
            checkPurchaseStatus();
        }
    }, [checkPurchaseStatus, questions]);

    const handlePostQuestion = async (formData) => {
        if (!authToken) {
            setError('You must be logged in to post a question');
            return;
        }

        try {
            setIsPosting(true);
            setError('');
            const response = await fetch(`${API_BASE}/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to post question');
            }

            setSuccessMessage('Question posted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            await fetchQuestions();
        } catch (err) {
            setError(err.message || 'Failed to post question');
        } finally {
            setIsPosting(false);
        }
    };

    const handlePurchase = async (questionId) => {
        if (!authToken) {
            setError('You must be logged in to purchase');
            return;
        }

        try {
            setIsPurchasing(questionId);
            setError('');
            const response = await fetch(`${API_BASE}/questions/${questionId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to purchase answer');
            }

            const data = await response.json();
            setSuccessMessage(`Answer unlocked! You now have ${data.data.buyerCredits} credits.`);
            setTimeout(() => setSuccessMessage(''), 3000);
            setPurchasedQuestions((prev) => new Set([...prev, questionId]));
            await fetchQuestions();
        } catch (err) {
            setError(err.message || 'Failed to purchase answer');
        } finally {
            setIsPurchasing(null);
        }
    };

    return (
        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <div>
                <header className="mb-6">
                    <h1 className="text-3xl font-semibold text-white">Q&amp;A Forum</h1>
                    <p className="mt-1 text-slate-300">Ask questions and unlock expert answers</p>
                </header>

                {error && <div className="mb-4 rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-rose-200">{error}</div>}
                {successMessage && <div className="mb-4 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-emerald-200">{successMessage}</div>}

                {authToken && (
                    <div className="mb-6 rounded-2xl border border-white/15 bg-black/20 p-4">
                        <QuestionForm onSubmit={handlePostQuestion} isLoading={isPosting} />
                    </div>
                )}

                <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
                    <div>
                        <input
                            type="text"
                            placeholder="Filter by company..."
                            value={filterCompany}
                            onChange={(event) => setFilterCompany(event.target.value)}
                            className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-cyan-300/70 focus:outline-none"
                        />
                    </div>

                    <div className="rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-sm text-slate-100">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={filterPaidOnly}
                                onChange={(event) => setFilterPaidOnly(event.target.checked)}
                                className="h-4 w-4 accent-cyan-400"
                            />
                            <span>Paid Questions Only</span>
                        </label>
                    </div>
                </div>

                <div>
                    {loading && <div className="rounded-xl border border-white/15 bg-black/20 px-4 py-5 text-slate-200">Loading questions...</div>}

                    {!loading && questions.length === 0 && (
                        <div className="rounded-xl border border-white/15 bg-black/20 p-6 text-center text-slate-300">
                            <p>No questions found. Be the first to post one!</p>
                        </div>
                    )}

                    {!loading && questions.length > 0 && (
                        <div>
                            <h2 className="mb-4 text-xl font-semibold text-white">Recent Questions ({questions.length})</h2>
                            <div className="space-y-4">
                            {questions.map((question) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    currentUserId={currentUserId}
                                    hasPurchased={purchasedQuestions.has(question.id)}
                                    onPurchase={handlePurchase}
                                    isLoadingPurchase={isPurchasing === question.id}
                                />
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionForum;
