const DAY = 86400000;

// Deadlines are stored as midnight UTC, so compare against
// today's date expressed the same way.
const todayUTC = () => {
    const n = new Date();
    return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
};

export function getDeadlineInfo(deadline, status) {
    if (!deadline) return null;

    const date = new Date(deadline);
    const formatted = date.toLocaleDateString(undefined, { timeZone: 'UTC' });

    // Once it's decided, the deadline no longer matters
    if (status === 'offer' || status === 'rejected') {
        return { level: '', label: `Due ${formatted}` };
    }

    const days = Math.round((date.getTime() - todayUTC()) / DAY);

    if (days < 0) {
        return { level: 'overdue', label: `Overdue by ${-days} day${days === -1 ? '' : 's'}` };
    }
    if (days === 0) return { level: 'soon', label: 'Due today' };
    if (days <= 3) return { level: 'soon', label: `Due in ${days} day${days === 1 ? '' : 's'}` };
    return { level: '', label: `Due ${formatted}` };
}