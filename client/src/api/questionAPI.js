// API utility functions for forum operations
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// Post a new question
export const postQuestion = async (data, authToken) => {
    const response = await fetch(`${API_BASE}/questions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to post question');
    }
    const result = await response.json();
    return result.data;
};
// Fetch all questions with optional filters
export const fetchQuestions = async (filters) => {
    let url = `${API_BASE}/questions`;
    const params = new URLSearchParams();
    if (filters?.company)
        params.append('company', filters.company);
    if (filters?.isPaid !== undefined)
        params.append('isPaid', String(filters.isPaid));
    if (params.toString())
        url += `?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch questions');
    }
    const result = await response.json();
    return result.data || [];
};
// Fetch a single question by ID
export const fetchQuestion = async (id) => {
    const response = await fetch(`${API_BASE}/questions/${id}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch question');
    }
    const result = await response.json();
    return result.data;
};
// Purchase an answer
export const purchaseAnswer = async (questionId, authToken) => {
    const response = await fetch(`${API_BASE}/questions/${questionId}/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to purchase answer');
    }
    const result = await response.json();
    return result.data;
};
// Check if user has purchased a question
export const checkPurchaseStatus = async (questionId, authToken) => {
    const response = await fetch(`${API_BASE}/questions/${questionId}/has-purchased`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to check purchase status');
    }
    const result = await response.json();
    return result.hasPurchased || false;
};
// Add an answer to a question (author only)
export const addAnswer = async (questionId, answer, authToken) => {
    const response = await fetch(`${API_BASE}/questions/${questionId}/answer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ answer }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add answer');
    }
    const result = await response.json();
    return result.data;
};
export default {
    postQuestion,
    fetchQuestions,
    fetchQuestion,
    purchaseAnswer,
    checkPurchaseStatus,
    addAnswer,
};
