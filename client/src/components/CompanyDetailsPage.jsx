import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCompanyDetails } from '../api/companyAPI';
import { fetchQuestions } from '../api/questionAPI';

export default function CompanyDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const loadCompanyData = async () => {
            try {
                setLoading(true);
                setError('');

                if (!id) {
                    setError('Company ID not found');
                    return;
                }

                const companyData = await fetchCompanyDetails(id);
                setCompany(companyData);

                const forumQuestions = await fetchQuestions({ company: companyData.name });
                setQuestions(forumQuestions);
            } catch (err) {
                setError(err?.message || 'Failed to load company details');
            } finally {
                setLoading(false);
            }
        };

        loadCompanyData();
    }, [id]);

    if (loading) {
        return (
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-slate-200 backdrop-blur-xl">
                <div className="rounded-xl border border-white/20 bg-black/20 px-4 py-3">Loading company details...</div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-slate-200 backdrop-blur-xl">
                <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-5">
                    <h2 className="text-xl font-semibold text-white">Error</h2>
                    <p className="mt-2">{error || 'Company not found'}</p>
                    <button className="mt-4 rounded-lg border border-white/30 bg-white/10 px-4 py-2 hover:bg-white/20" onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-slate-100 backdrop-blur-xl">
            <div className="rounded-2xl border border-white/15 bg-black/20 p-5">
                <button className="mb-4 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm hover:bg-white/20" onClick={() => navigate(-1)}>Back</button>

                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    {company.logo && <img src={company.logo} alt={company.name} className="h-16 w-16 rounded-lg object-contain" />}

                    <div className="min-w-0 flex-1">
                        <h1 className="text-3xl font-semibold text-white">{company.name}</h1>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full border border-cyan-300/40 bg-cyan-500/10 px-3 py-1 text-cyan-100">{company.industry}</span>
                            <span className="rounded-full border border-emerald-300/40 bg-emerald-500/10 px-3 py-1 text-emerald-100">{company.location}</span>
                        </div>

                        {company.description && <p className="mt-4 text-slate-300">{company.description}</p>}

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-white/20 bg-white/5 p-3">
                                <span className="block text-xs text-slate-400">Min GPA Required</span>
                                <span className="mt-1 block text-lg font-semibold">{company.minGpa}</span>
                            </div>
                            <div className="rounded-xl border border-white/20 bg-white/5 p-3">
                                <span className="block text-xs text-slate-400">Open Positions</span>
                                <span className="mt-1 block text-lg font-semibold">{company.placements?.length || 0}</span>
                            </div>
                            <div className="rounded-xl border border-white/20 bg-white/5 p-3">
                                <span className="block text-xs text-slate-400">Discussions</span>
                                <span className="mt-1 block text-lg font-semibold">{questions.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                <button className={`rounded-xl px-4 py-2 text-sm transition ${activeTab === 'overview' ? 'bg-cyan-400 text-slate-950' : 'border border-white/30 bg-white/10 hover:bg-white/20'}`} onClick={() => setActiveTab('overview')}>Overview</button>
                <button className={`rounded-xl px-4 py-2 text-sm transition ${activeTab === 'placements' ? 'bg-cyan-400 text-slate-950' : 'border border-white/30 bg-white/10 hover:bg-white/20'}`} onClick={() => setActiveTab('placements')}>Placements ({company.placements?.length || 0})</button>
                <button className={`rounded-xl px-4 py-2 text-sm transition ${activeTab === 'discussions' ? 'bg-cyan-400 text-slate-950' : 'border border-white/30 bg-white/10 hover:bg-white/20'}`} onClick={() => setActiveTab('discussions')}>Discussions ({questions.length})</button>
            </div>

            <div className="mt-5">
                {activeTab === 'overview' && (
                    <div>
                        <div className="grid gap-4 lg:grid-cols-2">
                            {company.requiredSkills && company.requiredSkills.length > 0 && (
                                <div className="rounded-2xl border border-white/20 bg-black/20 p-5">
                                    <h3 className="text-lg font-semibold text-white">Required Skills</h3>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {company.requiredSkills.map((skill) => (
                                            <div key={skill} className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm">{skill}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {company.companyPrepResources && company.companyPrepResources.length > 0 && (
                                <div className="rounded-2xl border border-white/20 bg-black/20 p-5">
                                    <h3 className="text-lg font-semibold text-white">Preparation Resources</h3>
                                    <div className="mt-3 space-y-2">
                                        {company.companyPrepResources.map((resource) => (
                                            <div key={resource.id} className="rounded-lg border border-white/20 bg-white/5 p-3">
                                                <div className="text-xs uppercase tracking-wide text-cyan-200">{resource.resourceType}</div>
                                                <div className="font-medium text-white">{resource.title}</div>
                                                {resource.fileUrl && (
                                                    <a
                                                        href={resource.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 inline-block text-sm text-cyan-300 hover:text-cyan-200"
                                                    >
                                                        Download
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

                {activeTab === 'placements' && (
                    <div>
                        {company.placements && company.placements.length > 0 ? (
                            <div className="space-y-3">
                                {company.placements.map((placement) => (
                                    <div key={placement.id} className="rounded-2xl border border-white/20 bg-black/20 p-5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="text-lg font-semibold text-white">{placement.position}</h3>
                                            <div className="rounded-full border border-amber-300/40 bg-amber-500/10 px-3 py-1 text-sm text-amber-100">
                                                ₹{(placement.ctc || placement.salary || 0).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="mt-3 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
                                            <div className="rounded-lg border border-white/20 bg-white/5 px-3 py-2">
                                                <strong>Salary Type:</strong>
                                                <span className="ml-2">{placement.salaryType}</span>
                                            </div>
                                            <div className="rounded-lg border border-white/20 bg-white/5 px-3 py-2">
                                                <strong>Location:</strong>
                                                <span className="ml-2">{placement.location}</span>
                                            </div>
                                        </div>

                                        {placement.description && (
                                            <div className="mt-3 rounded-lg border border-white/20 bg-white/5 p-3">
                                                <strong>Description:</strong>
                                                <p className="mt-1 text-sm text-slate-300">{placement.description}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-white/20 bg-black/20 p-6 text-center text-slate-300">No placements available at the moment.</div>
                        )}
                    </div>
                )}

                {activeTab === 'discussions' && (
                    <div>
                        {questions.length > 0 ? (
                            <div className="space-y-3">
                                {questions.map((question) => (
                                    <div key={question.id} className="rounded-2xl border border-white/20 bg-black/20 p-5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h4 className="text-lg font-semibold text-white">{question.title}</h4>
                                            {question.isPaid && <span className="rounded-full border border-amber-300/40 bg-amber-500/10 px-2 py-1 text-xs text-amber-100">Paid</span>}
                                        </div>
                                        <p className="mt-2 text-slate-300">{question.text}</p>
                                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                            <span>By: {question.author.firstName} {question.author.lastName}</span>
                                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                                            {question.answer && <span className="rounded-full border border-emerald-300/40 bg-emerald-500/10 px-2 py-1 text-emerald-100">Answered</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-white/20 bg-black/20 p-6 text-center text-slate-300">
                                <p>No discussions yet. Be the first to ask a question!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
