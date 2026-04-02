import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Company, fetchEligibleCompanies } from '../api/companyAPI';
import './CompanyMatcher.css';

interface CompanyMatcherProps {
  authToken: string;
}

export const CompanyMatcher: React.FC<CompanyMatcherProps> = ({ authToken }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEligibleCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEligibleCompanies(authToken);
        setCompanies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      loadEligibleCompanies();
    }
  }, [authToken]);

  if (loading) {
    return (
      <div className="company-matcher-container">
        <h2>Company Matcher</h2>
        <div className="loading">Loading eligible companies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-matcher-container">
        <h2>Company Matcher</h2>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="company-matcher-container">
      <div className="company-matcher-header">
        <h2>🎯 Company Matcher</h2>
        <p>Showing {companies.length} eligible companies for you</p>
      </div>

      {companies.length === 0 ? (
        <div className="no-companies">
          <p>No eligible companies found. Keep improving your GPA!</p>
        </div>
      ) : (
        <div className="company-matcher-grid">
          {companies.map((company) => (
            <Link to={`/company/${company.id}`} key={company.id} className="company-card-link">
              <div className="company-card">
                {company.logo && (
                  <img src={company.logo} alt={company.name} className="company-logo" />
                )}
                <div className="company-card-content">
                  <h3>{company.name}</h3>
                  <div className="company-meta">
                    <span className="industry-badge">{company.industry}</span>
                    <span className="location-badge">📍 {company.location}</span>
                  </div>
                  
                  <div className="company-details">
                    <div className="detail-item">
                      <strong>Min GPA Required:</strong>
                      <span>{company.minGpa}</span>
                    </div>
                    
                    {company.visitingDate && (
                      <div className="detail-item">
                        <strong>Visiting Date:</strong>
                        <span>{new Date(company.visitingDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    <div className="detail-item">
                      <strong>Open Positions:</strong>
                      <span>{company.placements?.length || 0}</span>
                    </div>

                    {company.requiredSkills && company.requiredSkills.length > 0 && (
                      <div className="skills-section">
                        <strong>Required Skills:</strong>
                        <div className="skills-list">
                          {company.requiredSkills.map((skill, idx) => (
                            <span key={idx} className="skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {company.placements && company.placements.length > 0 && (
                    <div className="placements-preview">
                      <strong>Top Salary Offered:</strong>
                      <span className="salary">
                        ₹{Math.max(...company.placements.map(p => p.salary || 0)).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button className="view-details-btn">View Details →</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyMatcher;