import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import QuestionCard from './QuestionCard';
import './QuestionForum.css';

interface Question {
  id: string;
  title: string;
  company: string;
  text: string;
  answer?: string;
  isPaid: boolean;
  cost?: number;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
  purchases: Array<{ buyerId: string }>;
  createdAt: string;
}

interface QuestionForumProps {
  authToken?: string;
  currentUserId?: string;
}

export const QuestionForum: React.FC<QuestionForumProps> = ({
  authToken,
  currentUserId,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterPaidOnly, setFilterPaidOnly] = useState(false);
  const [purchasedQuestions, setPurchasedQuestions] = useState<Set<string>>(new Set());
  const [isPosting, setIsPosting] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/questions`;
      const params = new URLSearchParams();

      if (filterCompany) params.append('company', filterCompany);
      if (filterPaidOnly) params.append('isPaid', 'true');

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch questions');

      const data = await response.json();
      setQuestions(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  // Check purchase status for each question
  const checkPurchaseStatus = async () => {
    if (!authToken || !currentUserId) return;

    try {
      const purchased = new Set<string>();

      for (const question of questions) {
        try {
          const response = await fetch(
            `${API_BASE}/questions/${question.id}/has-purchased`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

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
  };

  // Initial fetch
  useEffect(() => {
    fetchQuestions();
  }, [filterCompany, filterPaidOnly]);

  // Check purchase status when questions or auth changes
  useEffect(() => {
    if (questions.length > 0) {
      checkPurchaseStatus();
    }
  }, [questions, authToken, currentUserId]);

  // Handle question submission
  const handlePostQuestion = async (formData: any) => {
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

      // Refresh questions
      await fetchQuestions();
    } catch (err: any) {
      setError(err.message || 'Failed to post question');
    } finally {
      setIsPosting(false);
    }
  };

  // Handle purchase
  const handlePurchase = async (questionId: string) => {
    if (!authToken) {
      setError('You must be logged in to purchase');
      return;
    }

    try {
      setIsPurchasing(questionId);
      setError('');

      const response = await fetch(
        `${API_BASE}/questions/${questionId}/purchase`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to purchase answer');
      }

      const data = await response.json();
      setSuccessMessage(`Answer unlocked! You now have ${data.data.buyerCredits} credits.`);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Update purchased questions
      setPurchasedQuestions(prev => new Set([...prev, questionId]));

      // Refresh to show answer
      await fetchQuestions();
    } catch (err: any) {
      setError(err.message || 'Failed to purchase answer');
    } finally {
      setIsPurchasing(null);
    }
  };

  return (
    <div className="question-forum">
      <div className="forum-container">
        <header className="forum-header">
          <h1>Q&A Forum</h1>
          <p>Ask questions and unlock expert answers</p>
        </header>

        {/* Messages */}
        {error && <div className="message error-banner">{error}</div>}
        {successMessage && <div className="message success-banner">{successMessage}</div>}

        {/* Question Form */}
        {authToken && (
          <div className="form-section">
            <QuestionForm onSubmit={handlePostQuestion} isLoading={isPosting} />
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Filter by company..."
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={filterPaidOnly}
                onChange={(e) => setFilterPaidOnly(e.target.checked)}
              />
              <span>Paid Questions Only</span>
            </label>
          </div>
        </div>

        {/* Questions List */}
        <div className="questions-section">
          {loading && <div className="loading">Loading questions...</div>}

          {!loading && questions.length === 0 && (
            <div className="no-questions">
              <p>No questions found. Be the first to post one!</p>
            </div>
          )}

          {!loading && questions.length > 0 && (
            <div className="questions-list">
              <h2>Recent Questions ({questions.length})</h2>
              {questions.map(question => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionForum;