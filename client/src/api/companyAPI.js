// API utility functions for company operations
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// Fetch eligible companies for the authenticated user
export const fetchEligibleCompanies = async (authToken) => {
    const response = await fetch(`${API_BASE}/companies/eligible`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch eligible companies');
    }
    const result = await response.json();
    return result.data || [];
};
// Fetch company details by ID
export const fetchCompanyDetails = async (companyId) => {
    const response = await fetch(`${API_BASE}/companies/${companyId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch company details');
    }
    const result = await response.json();
    return result.data;
};
// Fetch all companies with optional filters
export const fetchAllCompanies = async (filters) => {
    let url = `${API_BASE}/companies`;
    const params = new URLSearchParams();
    if (filters?.industry)
        params.append('industry', filters.industry);
    if (filters?.location)
        params.append('location', filters.location);
    if (filters?.sortBy)
        params.append('sortBy', filters.sortBy);
    if (params.toString())
        url += `?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch companies');
    }
    const result = await response.json();
    return result.data || [];
};
export default {
    fetchEligibleCompanies,
    fetchCompanyDetails,
    fetchAllCompanies,
};
