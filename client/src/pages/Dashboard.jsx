import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Board from '../components/Board';
import ApplicationForm from '../components/ApplicationForm';
import { COLUMNS } from '../constants';

const groupByStatus = (apps) => {
    const grouped = Object.fromEntries(COLUMNS.map((c) => [c.id, []]));
    apps.forEach((a) => grouped[a.status]?.push(a));
    Object.values(grouped).forEach((list) =>
        list.sort((a, b) => a.position - b.position)
    );
    return grouped;
};

export default function Dashboard() {
    const [columns, setColumns] = useState(() => groupByStatus([]));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // null = modal closed, {} = adding new, application object = editing
    const [editing, setEditing] = useState(null);

    const load = useCallback(async () => {
        try {
            const { data } = await api.get('/applications');
            setColumns(groupByStatus(data.applications));
            setError('');
        } catch {
            setError('Could not load applications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    // Throws on failure so the form can show the server's message
    const handleSave = async (data) => {
        if (editing?._id) {
            await api.patch(`/applications/${editing._id}`, data);
        } else {
            await api.post('/applications', data);
        }
        setEditing(null);
        await load();
    };

    const handleDelete = async (app) => {
        if (!window.confirm(`Delete ${app.company} - ${app.role}?`)) return;
        try {
            await api.delete(`/applications/${app._id}`);
            await load();
        } catch {
            setError('Could not delete application');
        }
    };

    // Called after every drag: send the full layout to the server
    const handleCommit = async (next) => {
        const items = COLUMNS.flatMap((c) =>
            next[c.id].map((a, index) => ({ id: a._id, status: c.id, position: index }))
        );
        try {
            await api.patch('/applications/reorder', { items });
        } catch {
            setError('Could not save the new order');
            load(); // snap back to what the server has
        }
    };

    return (
        <>
            <Navbar />
            <main className="container wide">
                <div className="toolbar">
                    <h2>Your applications</h2>
                    <button onClick={() => setEditing({})}>+ Add application</button>
                </div>

                {error && <p className="error">{error}</p>}

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Board
                        columns={columns}
                        setColumns={setColumns}
                        onCommit={handleCommit}
                        onEdit={setEditing}
                        onDelete={handleDelete}
                    />
                )}
            </main>

            {editing && (
                <ApplicationForm
                    application={editing._id ? editing : null}
                    onSave={handleSave}
                    onClose={() => setEditing(null)}
                />
            )}
        </>
    );
}