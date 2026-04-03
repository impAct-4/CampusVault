// No external imports needed for this component

export const QuestionCard = ({ question, currentUserId, hasPurchased = false, onPurchase, isLoadingPurchase = false }) => {
    const isAuthor = currentUserId === question.author.id;
    const isBlurred = !hasPurchased && question.isPaid;

    const handleUnlock = async () => {
        if (onPurchase) {
            try {
                await onPurchase(question.id);
            } catch (error) {
                console.error('Failed to unlock:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="rounded-2xl border border-white/20 bg-black/20 p-5 backdrop-blur-lg">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-white">{question.title}</h3>
                <span className="rounded-full border border-cyan-300/40 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">{question.company}</span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span>By {question.author.firstName} {question.author.lastName}</span>
                <span>{formatDate(question.createdAt)}</span>
                {question.isPaid && <span className="rounded-full border border-amber-300/40 bg-amber-500/10 px-2 py-1 text-amber-100">{question.cost} Credits</span>}
            </div>

            <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <p>{question.text}</p>
                </div>

                {question.answer && (
                    <div className={`relative rounded-xl border border-white/20 bg-slate-900/55 p-4 ${isBlurred ? 'overflow-hidden' : ''}`}>
                        <h4 className="mb-2 font-semibold text-cyan-100">Answer:</h4>
                        <p>{question.answer}</p>

                        {isBlurred && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
                                <div className="rounded-xl border border-white/20 bg-white/10 p-4 text-center">
                                    <p>Answer is locked</p>
                                    <button
                                        onClick={handleUnlock}
                                        disabled={isLoadingPurchase || isAuthor}
                                        className="mt-2 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-500"
                                        title={isAuthor ? 'You cannot purchase your own question' : 'Click to unlock'}
                                    >
                                        {isLoadingPurchase ? 'Unlocking...' : `Unlock for ${question.cost} Credits`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span>{question.purchases.length} person{question.purchases.length !== 1 ? 's' : ''} purchased</span>
                {isAuthor && <span className="rounded-full border border-emerald-300/40 bg-emerald-500/10 px-2 py-1 text-emerald-100">You are the author</span>}
            </div>
        </div>
    );
};

export default QuestionCard;
