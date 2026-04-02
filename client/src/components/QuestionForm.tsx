import React, { useState } from 'react';
import './QuestionForum.css';

interface QuestionFormProps {
  onSubmit: (data: {
    title: string;
    company: string;
    text: string;
    isPaid: boolean;
    cost?: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    text: '',
    isPaid: false,
    cost: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.company || !formData.text) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.isPaid && (!formData.cost || parseInt(formData.cost) <= 0)) {
      setError('Please enter a valid cost for paid questions');
      return;
    }

    try {
      await onSubmit({
        title: formData.title,
        company: formData.company,
        text: formData.text,
        isPaid: formData.isPaid,
        cost: formData.isPaid ? parseInt(formData.cost) : undefined,
      });

      setFormData({
        title: '',
        company: '',
        text: '',
        isPaid: false,
        cost: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to post question');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <h2>Post a Question</h2>

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What's your question?"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="company">Company *</label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="e.g., Google, Microsoft, Amazon"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="text">Question Details *</label>
        <textarea
          id="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          placeholder="Provide details about your question..."
          rows={6}
          required
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="isPaid"
            checked={formData.isPaid}
            onChange={handleChange}
          />
          <span>This is a paid question</span>
        </label>
      </div>

      {formData.isPaid && (
        <div className="form-group">
          <label htmlFor="cost">Cost (Credits) *</label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="e.g., 50"
            min="1"
            required
          />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className="submit-button"
      >
        {isLoading ? 'Posting...' : 'Post Question'}
      </button>
    </form>
  );
};

export default QuestionForm;