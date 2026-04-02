// API utility functions for company operations

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  industry: string;
  location: string;
  minGpa: number;
  requiredSkills: string[];
  visitingDate?: string;
  placements: Array<{
    id: string;
    position: string;
    salary: number;
    ctc?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyDetails extends Company {
  placements: Array<{
    id: string;
    position: string;
    salary: number;
    salaryType: string;
    salaryMin?: number;
    salaryMax?: number;
    ctc?: number;
    benefits: string[];
    location: string;
    deadline?: string;
    description?: string;
  }>;
  marketData: Array<{
    id: string;
    averageSalary: number;
    packageRange: string;
    placements: number;
    year: number;
    branch: string;
  }>;
  companyPrepResources: Array<{
    id: string;
    title: string;
    resourceType: string;
    fileUrl?: string;
  }>;
}

// Fetch eligible companies for the authenticated user
export const fetchEligibleCompanies = async (authToken: string): Promise<Company[]> => {
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
export const fetchCompanyDetails = async (companyId: string): Promise<CompanyDetails> => {
  const response = await fetch(`${API_BASE}/companies/${companyId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch company details');
  }

  const result = await response.json();
  return result.data;
};

// Fetch all companies with optional filters
export const fetchAllCompanies = async (filters?: {
  industry?: string;
  location?: string;
  sortBy?: string;
}): Promise<Company[]> => {
  let url = `${API_BASE}/companies`;
  const params = new URLSearchParams();

  if (filters?.industry) params.append('industry', filters.industry);
  if (filters?.location) params.append('location', filters.location);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);

  if (params.toString()) url += `?${params.toString()}`;

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