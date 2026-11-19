import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="navbar">
            <h1>Job Tracker</h1>
            <div>
                <span>{user?.name}</span>
                <button onClick={logout}>Log out</button>
            </div>
        </header>
    );
}