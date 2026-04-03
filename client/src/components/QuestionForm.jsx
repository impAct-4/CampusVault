import { useState } from 'react';

export const QuestionForm = ({ onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        text: '',
        isPaid: false,
        cost: '',
    });

    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value, type } = event.target;

        if (type === 'checkbox') {
            const checkbox = event.target;
            setFormData((prev) => ({
                ...prev,
                [name]: checkbox.checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
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
        } catch (err) {
            setError(err.message || 'Failed to post question');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Post a Question</h2>

            <div className="space-y-1">
                <label htmlFor="title" className="text-sm text-slate-200">Title *</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="What's your question?"
                    className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-cyan-300/70 focus:outline-none"
                    required
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="company" className="text-sm text-slate-200">Company *</label>
                <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Google, Microsoft, Amazon"
                    className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-cyan-300/70 focus:outline-none"
                    required
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="text" className="text-sm text-slate-200">Question Details *</label>
                <textarea
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    placeholder="Provide details about your question..."
                    rows={6}
                    className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-cyan-300/70 focus:outline-none"
                    required
                />
            </div>

            <div className="rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-sm text-slate-100">
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} className="h-4 w-4 accent-cyan-400" />
                    <span>This is a paid question</span>
                </label>
            </div>

            {formData.isPaid && (
                <div className="space-y-1">
                    <label htmlFor="cost" className="text-sm text-slate-200">Cost (Credits) *</label>
                    <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        placeholder="e.g., 50"
                        min="1"
                        className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-cyan-300/70 focus:outline-none"
                        required
                    />
                </div>
            )}

            {error && <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

            <button type="submit" disabled={isLoading} className="rounded-xl bg-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-500">
                {isLoading ? 'Posting...' : 'Post Question'}
            </button>
        </form>
    );
};

export default QuestionForm;
