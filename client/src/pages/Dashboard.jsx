import { useEffect, useState } from 'react';
import api from '../api/client';
import Navbar from '../components/Navbar';

export default function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        api
            .get('/applications')
            .then((res) => setApplications(res.data.applications))
            .catch(() => setError('Could not load applications'));
    }, []);

    return (
        <>
            <Navbar />
            <main className="container">
                <h2>Your applications</h2>
                {error && <p className="error">{error}</p>}
                <p>{applications.length} applications loaded from the API.</p>
                <ul>
                    {applications.map((a) => (
                        <li key={a._id}>
                            {a.company} - {a.role} ({a.status})
                        </li>
                    ))}
                </ul>
            </main>
        </>
    );
}