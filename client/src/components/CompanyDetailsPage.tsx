import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyDetails, fetchCompanyDetails } from '../api/companyAPI';
import { fetchQuestions, Question } from '../api/questionAPI';
import './CompanyDetailsPage.css';

interface QuestionWithFilters extends Question {
  isPaid: boolean;
  cost?: number;
}

export const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [questions, setQuestions] = useState<QuestionWithFilters[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'placements' | 'discussions'>('overview');

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError('Company ID not found');
          return;
        }

        // Fetch company details
        const companyData = await fetchCompanyDetails(id);
        setCompany(companyData);

        // Fetch questions for this company
        const allQuestions = await fetchQuestions({ company: companyData.name });
        setQuestions(allQuestions as QuestionWithFilters[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load company details');
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [id]);

  if (loading) {
    return (
      <div className="company-details-page">
        <div className="loading">Loading company details...</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="company-details-page">
        <div className="error">
          <h2>Error</h2>
          <p>{error || 'Company not found'}</p>
          <button onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-details-page">
      {/* Header Section */}
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        
        <div className="header-content">
          {company.logo && (
            <img src={company.logo} alt={company.name} className="company-logo-large" />
          )}
          
          <div className="header-info">
            <h1>{company.name}</h1>
            
            <div className="header-meta">
              <span className="badge industry-badge-lg">{company.industry}</span>
              <span className="badge location-badge-lg">📍 {company.location}</span>
              {company.visitingDate && (
                <span className="badge date-badge">
                  📅 {new Date(company.visitingDate).toLocaleDateString()}
                </span>
              )}
            </div>

            {company.description && (
              <p className="company-description">{company.description}</p>
            )}

            <div className="header-stats">
              <div className="stat">
                <span className="stat-label">Min GPA Required</span>
                <span className="stat-value">{company.minGpa}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Open Positions</span>
                <span className="stat-value">{company.placements?.length || 0}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Discussions</span>
                <span className="stat-value">{questions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-navigation">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </button>
        <button 
          className={`tab ${activeTab === 'placements' ? 'active' : ''}`}
          onClick={() => setActiveTab('placements')}
        >
          💼 Placements ({company.placements?.length || 0})
        </button>
        <button 
          className={`tab ${activeTab === 'discussions' ? 'active' : ''}`}
          onClick={() => setActiveTab('discussions')}
        >
          💬 Discussions ({questions.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tabs-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-panel">
            <div className="overview-grid">
              {/* Required Skills */}
              {company.requiredSkills && company.requiredSkills.length > 0 && (
                <div className="overview-card">
                  <h3>🎯 Required Skills</h3>
                  <div className="skills-grid">
                    {company.requiredSkills.map((skill, idx) => (
                      <div key={idx} className="skill-item">
                        ✓ {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Market Data */}
              {company.marketData && company.marketData.length > 0 && (
                <div className="overview-card">
                  <h3>📊 Market Data</h3>
                  <div className="market-data">
                    {company.marketData.map((data, idx) => (
                      <div key={idx} className="market-item">
                        <div className="market-header">
                          <strong>{data.branch} - {data.year}</strong>
                        </div>
                        <div className="market-details">
                          <p>Average Salary: ₹{data.averageSalary.toLocaleString()}</p>
                          <p>Package Range: {data.packageRange}</p>
                          <p>Placements: {data.placements}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prep Resources */}
              {company.companyPrepResources && company.companyPrepResources.length > 0 && (
                <div className="overview-card">
                  <h3>📚 Preparation Resources</h3>
                  <div className="resources-list">
                    {company.companyPrepResources.map((resource) => (
                      <div key={resource.id} className="resource-item">
                        <div className="resource-type">{resource.resourceType}</div>
                        <div className="resource-title">{resource.title}</div>
                        {resource.fileUrl && (
                          <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="resource-link">
                            Download →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Placements Tab */}
        {activeTab === 'placements' && (
          <div className="tab-panel">
            {company.placements && company.placements.length > 0 ? (
              <div className="placements-list">
                {company.placements.map((placement) => (
                  <div key={placement.id} className="placement-card">
                    <div className="placement-header">
                      <h3>{placement.position}</h3>
                      <div className="placement-salary">
                        {placement.ctc ? (
                          <>
                            <span className="salary-label">CTC: </span>
                            <span className="salary-value">₹{placement.ctc.toLocaleString()} LPA</span>
                          </>
                        ) : (
                          <>
                            <span className="salary-label">Salary: </span>
                            <span className="salary-value">₹{placement.salary.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="placement-details">
                      <div className="detail">
                        <strong>Salary Type:</strong>
                        <span>{placement.salaryType}</span>
                      </div>
                      
                      {placement.salaryMin && placement.salaryMax && (
                        <div className="detail">
                          <strong>Range:</strong>
                          <span>₹{placement.salaryMin.toLocaleString()} - ₹{placement.salaryMax.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="detail">
                        <strong>Location:</strong>
                        <span>{placement.location}</span>
                      </div>

                      {placement.deadline && (
                        <div className="detail">
                          <strong>Application Deadline:</strong>
                          <span>{new Date(placement.deadline).toLocaleDateString()}</span>
                        </div>
                      )}

                      {placement.benefits && placement.benefits.length > 0 && (
                        <div className="detail full-width">
                          <strong>Benefits:</strong>
                          <div className="benefits-tags">
                            {placement.benefits.map((benefit, idx) => (
                              <span key={idx} className="benefit-tag">{benefit}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {placement.description && (
                      <div className="placement-description">
                        <strong>Description:</strong>
                        <p>{placement.description}</p>
                      </div>
                    )}

                    <button className="apply-btn">Apply Now</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No placements available at the moment.</div>
            )}
          </div>
        )}

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="tab-panel">
            {questions.length > 0 ? (
              <div className="questions-list">
                {questions.map((question) => (
                  <div key={question.id} className="question-item">
                    <div className="question-header">
                      <h4>{question.title}</h4>
                      {question.isPaid && (
                        <span className="paid-badge">💰 Paid</span>
                      )}
                    </div>
                    <p className="question-text">{question.text}</p>
                    <div className="question-meta">
                      <span>By: {question.author.firstName} {question.author.lastName}</span>
                      <span>📅 {new Date(question.createdAt).toLocaleDateString()}</span>
                      {question.answer && (
                        <span className="answered-badge">✓ Answered</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>No discussions yet. Be the first to ask a question!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailsPage;