const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function parseResponse(response, fallbackMessage) {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body?.error || fallbackMessage);
  }

  return body;
}

export async function fetchQuestions(filters = {}) {
  const params = new URLSearchParams();

  if (filters.company) params.set('company', filters.company);
  if (typeof filters.isPaid === 'boolean') params.set('isPaid', String(filters.isPaid));

  const suffix = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE}/questions${suffix}`);
  const body = await parseResponse(response, 'Failed to fetch questions');
  return body?.data || [];
}

export async function fetchQuestion(questionId) {
  const response = await fetch(`${API_BASE}/questions/${questionId}`);
  const body = await parseResponse(response, 'Failed to fetch question');
  return body?.data;
}

export async function postQuestion(payload, authToken) {
  const response = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  const body = await parseResponse(response, 'Failed to post question');
  return body?.data;
}

export default {
  fetchQuestions,
  fetchQuestion,
  postQuestion,
};
