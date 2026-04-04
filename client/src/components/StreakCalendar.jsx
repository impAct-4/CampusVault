import './StreakCalendar.css';

const WEEKS = 52;
const DAYS  = 7;

function getDateGrid() {
    const grid = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from 52 weeks ago, adjusted to Sunday
    const start = new Date(today);
    start.setDate(start.getDate() - (WEEKS * 7) + 1);

    for (let w = 0; w < WEEKS; w++) {
        const week = [];
        for (let d = 0; d < DAYS; d++) {
            const date = new Date(start);
            date.setDate(start.getDate() + w * 7 + d);
            week.push(date);
        }
        grid.push(week);
    }
    return grid;
}

function intensity(count) {
    if (!count || count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function StreakCalendar({ activities = [], currentStreak = 0, totalActiveDays = 0 }) {
    const grid = getDateGrid();

    // Build a lookup: dateString → count
    const lookup = {};
    activities.forEach(({ date, count }) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        lookup[d.toDateString()] = count;
    });

    // Build month labels
    const monthLabels = [];
    let lastMonth = -1;
    grid.forEach((week, wi) => {
        const firstDay = week[0];
        if (firstDay.getMonth() !== lastMonth) {
            monthLabels.push({ wi, label: MONTHS[firstDay.getMonth()] });
            lastMonth = firstDay.getMonth();
        }
    });

    return (
        <div className="streak-calendar">
            <div className="streak-stats">
                <div className="streak-stat">
                    <span className="streak-number">{currentStreak}</span>
                    <span className="streak-label">day streak 🔥</span>
                </div>
                <div className="streak-stat">
                    <span className="streak-number">{totalActiveDays}</span>
                    <span className="streak-label">active days</span>
                </div>
            </div>

            <div className="calendar-wrapper">
                {/* Month labels */}
                <div className="month-labels">
                    {monthLabels.map(({ wi, label }) => (
                        <span
                            key={wi}
                            className="month-label"
                            style={{ gridColumn: wi + 1 }}
                        >
                            {label}
                        </span>
                    ))}
                </div>

                {/* Day grid */}
                <div className="day-grid">
                    {grid.map((week, wi) => (
                        <div key={wi} className="week-col">
                            {week.map((date, di) => {
                                const count = lookup[date.toDateString()] || 0;
                                const level = intensity(count);
                                const isToday = date.toDateString() === new Date().toDateString();
                                return (
                                    <div
                                        key={di}
                                        className={`day-cell level-${level} ${isToday ? 'today' : ''}`}
                                        title={`${date.toDateString()} — ${count} activities`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="cal-legend">
                    <span className="legend-label">Less</span>
                    {[0, 1, 2, 3, 4].map(l => (
                        <div key={l} className={`legend-cell level-${l}`} />
                    ))}
                    <span className="legend-label">More</span>
                </div>
            </div>
        </div>
    );
}
