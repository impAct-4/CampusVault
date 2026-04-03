import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEligibleCompanies } from '../api/companyAPI';

export const CompanyMatcher = ({ authToken }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEligibleCompanies = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchEligibleCompanies(authToken);
                setCompanies(data);
            } catch (err) {
                setError(err?.message || 'Failed to load companies');
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
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
                <h2 className="text-2xl font-semibold text-white">Company Matcher</h2>
                <div className="mt-4 rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-slate-200">Loading eligible companies...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
                <h2 className="text-2xl font-semibold text-white">Company Matcher</h2>
                <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-rose-200">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <div className="mb-5">
                <h2 className="text-2xl font-semibold text-white">Company Matcher</h2>
                <p className="mt-1 text-sm text-slate-300">Showing {companies.length} eligible companies for you</p>
            </div>

            {companies.length === 0 ? (
                <div className="rounded-xl border border-white/15 bg-black/20 p-6 text-center text-slate-300">
                    <p>No eligible companies found. Keep improving your GPA!</p>
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {companies.map((company) => (
                        <Link key={company.id} to={`/company/${company.id}`} className="group block">
                            <div className="h-full rounded-2xl border border-white/20 bg-black/20 p-5 transition group-hover:-translate-y-1 group-hover:border-cyan-300/60 group-hover:bg-black/30">
                                {company.logo && <img src={company.logo} alt={company.name} className="mb-4 h-12 w-12 rounded-md object-contain" />}

                                <div>
                                    <h3 className="text-xl font-semibold text-white">{company.name}</h3>

                                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                        <span className="rounded-full border border-cyan-300/40 bg-cyan-400/15 px-3 py-1 text-cyan-100">{company.industry}</span>
                                        <span className="rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1 text-emerald-100">{company.location}</span>
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm text-slate-200">
                                        <div className="flex items-center justify-between">
                                            <strong>Min GPA Required:</strong>
                                            <span>{company.minGpa}</span>
                                        </div>

                                        {company.visitingDate && (
                                            <div className="flex items-center justify-between">
                                                <strong>Visiting Date:</strong>
                                                <span>{new Date(company.visitingDate).toLocaleDateString()}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <strong>Open Positions:</strong>
                                            <span>{company.placements?.length || 0}</span>
                                        </div>

                                        {company.requiredSkills && company.requiredSkills.length > 0 && (
                                            <div className="pt-1">
                                                <strong>Required Skills:</strong>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {company.requiredSkills.map((skill) => (
                                                        <span key={skill} className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs text-slate-100">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {company.placements && company.placements.length > 0 && (
                                        <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-400/10 p-3 text-sm">
                                            <strong>Top Salary Offered:</strong>
                                            <span className="ml-2 font-semibold text-amber-100">₹{Math.max(...company.placements.map((placement) => placement.salary || 0)).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5">
                                    <button className="w-full rounded-xl bg-cyan-400/90 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-cyan-300">View Details</button>
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
