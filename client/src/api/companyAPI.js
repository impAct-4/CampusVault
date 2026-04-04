const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function parseResponse(response, fallbackMessage) {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body?.error || fallbackMessage);
  }

  return body;
}

export async function fetchCompanyDetails(companyId) {
  const response = await fetch(`${API_BASE}/companies/${companyId}`);
  const body = await parseResponse(response, 'Failed to fetch company details');
  return body?.data;
}

export async function fetchEligibleCompanies(authToken) {
  const response = await fetch(`${API_BASE}/companies/eligible`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  const body = await parseResponse(response, 'Failed to fetch eligible companies');
  return body?.data || [];
}

export async function fetchAllCompanies(filters = {}) {
  const params = new URLSearchParams();

  if (filters.industry) params.set('industry', filters.industry);
  if (filters.location) params.set('location', filters.location);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);

  const suffix = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE}/companies${suffix}`);
  const body = await parseResponse(response, 'Failed to fetch companies');
  return body?.data || [];
}

export default {
  fetchCompanyDetails,
  fetchEligibleCompanies,
  fetchAllCompanies,
};
