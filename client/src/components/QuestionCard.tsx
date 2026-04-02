import React, { useState, useEffect } from 'react';
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

interface QuestionCardProps {
  question: Question;
  currentUserId?: string;
  hasPurchased?: boolean;
  onPurchase?: (questionId: string) => Promise<void>;
  isLoadingPurchase?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentUserId,
  hasPurchased = false,
  onPurchase,
  isLoadingPurchase = false,
}) => {
  const [isBlurred, setIsBlurred] = useState(!hasPurchased && question.isPaid);
  const isAuthor = currentUserId === question.author.id;
  const canViewAnswer = isAuthor || hasPurchased || !question.isPaid;

  useEffect(() => {
    setIsBlurred(!hasPurchased && question.isPaid);
  }, [hasPurchased, question.isPaid]);

  const handleUnlock = async () => {
    if (onPurchase) {
      try {
        await onPurchase(question.id);
        setIsBlurred(false);
      } catch (error) {
        console.error('Failed to unlock:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <h3 className="question-title">{question.title}</h3>
        <span className="question-company">{question.company}</span>
      </div>

      <div className="question-meta">
        <span className="author-info">
          By {question.author.firstName} {question.author.lastName}
        </span>
        <span className="date-info">{formatDate(question.createdAt)}</span>
        {question.isPaid && (
          <span className="paid-badge">
            💰 {question.cost} Credits
          </span>
        )}
      </div>

      <div className="question-content">
        <div className="question-text">
          <p>{question.text}</p>
        </div>

        {question.answer && (
          <div className={`answer-section ${isBlurred ? 'blurred' : ''}`}>
            <h4>Answer:</h4>
            <p>{question.answer}</p>

            {isBlurred && (
              <div className="blur-overlay">
                <div className="unlock-prompt">
                  <p>Answer is locked</p>
                  <button
                    onClick={handleUnlock}
                    disabled={isLoadingPurchase || isAuthor}
                    className="unlock-button"
                    title={isAuthor ? 'You cannot purchase your own question' : 'Click to unlock'}
                  >
                    {isLoadingPurchase ? 'Unlocking...' : `Unlock for ${question.cost} Credits`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="question-footer">
        <span className="purchase-count">
          {question.purchases.length} person{question.purchases.length !== 1 ? 's' : ''} purchased
        </span>
        {isAuthor && (
          <span className="author-badge">You are the author</span>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;