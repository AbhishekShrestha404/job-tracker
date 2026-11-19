import { useEffect, useState } from 'react';
import { COLUMNS } from '../constants';

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

export default function ApplicationForm({ application, onSave, onClose }) {
    const [form, setForm] = useState({
        company: application?.company || '',
        role: application?.role || '',
        jobUrl: application?.jobUrl || '',
        status: application?.status || 'wishlist',
        deadline: toDateInput(application?.deadline),
        salaryRange: application?.salaryRange || '',
        location: application?.location || '',
        notes: application?.notes || '',
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await onSave({ ...form, deadline: form.deadline || null });
        } catch (err) {
            setError(err.response?.data?.message || 'Could not save');
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
                <h2>{application ? 'Edit application' : 'Add application'}</h2>
                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input name="company" placeholder="Company *" value={form.company}
                        onChange={handleChange} required maxLength={100} />
                    <input name="role" placeholder="Role *" value={form.role}
                        onChange={handleChange} required maxLength={100} />
                    <input name="jobUrl" placeholder="Job posting URL" value={form.jobUrl}
                        onChange={handleChange} />

                    <div className="row">
                        <label>
                            Status
                            <select name="status" value={form.status} onChange={handleChange}>
                                {COLUMNS.map((c) => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Deadline
                            <input type="date" name="deadline" value={form.deadline}
                                onChange={handleChange} />
                        </label>
                    </div>

                    <input name="salaryRange" placeholder="Salary range" value={form.salaryRange}
                        onChange={handleChange} />
                    <input name="location" placeholder="Location" value={form.location}
                        onChange={handleChange} />
                    <textarea name="notes" placeholder="Notes" rows={4} maxLength={2000}
                        value={form.notes} onChange={handleChange} />

                    <div className="modal-actions">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}