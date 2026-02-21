import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { users } from '../data/mockData';
import './AuthPage.css';

export default function AuthPage() {
    const [role, setRole] = useState('student');
    const [mode, setMode] = useState('login'); // login | signup
    const { login } = useAuth();
    const navigate = useNavigate();

    const filteredUsers = users.filter((u) => u.role === role);

    const handleDemoLogin = (userId) => {
        login(userId);
        navigate('/');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // For the MVP, just log in as the first user of chosen role
        const user = filteredUsers[0];
        if (user) {
            login(user.id);
            navigate('/');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Branding */}
                <div className="auth-brand">
                    <div className="auth-brand-icon">🎓</div>
                    <h1>
                        Uni<span>Connect</span>
                    </h1>
                    <p>Pondicherry University · Campus Hub</p>
                </div>

                {/* Auth card */}
                <div className="auth-card">
                    {/* Role toggle */}
                    <div className="auth-role-toggle">
                        <button
                            className={`auth-role-btn ${role === 'student' ? 'active' : ''}`}
                            onClick={() => setRole('student')}
                        >
                            🎒 Student
                        </button>
                        <button
                            className={`auth-role-btn ${role === 'faculty' ? 'active' : ''}`}
                            onClick={() => setRole('faculty')}
                        >
                            👨‍🏫 Faculty
                        </button>
                    </div>

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleFormSubmit}>
                        {mode === 'signup' && (
                            <div className="auth-field">
                                <label>Full Name</label>
                                <input type="text" placeholder="Enter your full name" />
                            </div>
                        )}
                        <div className="auth-field">
                            <label>University Email</label>
                            <input type="email" placeholder="yourname@pu.edu" />
                        </div>
                        <div className="auth-field">
                            <label>Password</label>
                            <input type="password" placeholder="••••••••" />
                        </div>
                        {mode === 'signup' && (
                            <div className="auth-field">
                                <label>Department</label>
                                <select defaultValue="">
                                    <option value="" disabled>
                                        Select your department
                                    </option>
                                    <option>Computer Science</option>
                                    <option>Environmental Studies</option>
                                    <option>Biotechnology</option>
                                    <option>Physics</option>
                                    <option>Management Studies</option>
                                    <option>English & Literature</option>
                                </select>
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary auth-submit">
                            {mode === 'login' ? 'Log In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-toggle">
                        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                        <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                            {mode === 'login' ? 'Sign Up' : 'Log In'}
                        </button>
                    </div>

                    {/* Quick demo login */}
                    <div className="auth-demo-selector">
                        <p>Quick Demo Login</p>
                        <div className="demo-users">
                            {filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    className="demo-user-btn"
                                    onClick={() => handleDemoLogin(user.id)}
                                >
                                    <div className="demo-user-avatar">{user.initials}</div>
                                    <div className="demo-user-info">
                                        <strong>{user.name}</strong>
                                        <span>{user.department}</span>
                                    </div>
                                    <span className={`demo-user-role ${user.role}`}>{user.role}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
