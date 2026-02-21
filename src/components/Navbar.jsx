import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notifications as initialNotifications } from '../data/mockData';
import './Navbar.css';

// SVG icons inline to avoid external deps
const BellIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MoonIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SunIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const notifIcons = {
    comment: '💬',
    join: '🤝',
    rating: '⭐',
    project: '📁',
    mention: '📣',
};

const navLinks = [
    { path: '/', label: 'Feed', icon: '🏠' },
    { path: '/kanban', label: 'Kanban', icon: '📋' },
    { path: '/events', label: 'Events', icon: '📅' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/messages', label: 'Messages', icon: '💬' },
    { path: '/activity', label: 'Activity', icon: '📡' },
];

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handle = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        if (showNotifications) document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [showNotifications]);

    if (!currentUser) return null;

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-icon">🎓</div>
                    <div className="navbar-logo-text">
                        Uni<span>Connect</span>
                    </div>
                </Link>

                <div className="navbar-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            <span className="nav-link-icon">{link.icon}</span>
                            <span className="nav-link-text">{link.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="navbar-right">
                {/* Theme Toggle */}
                <button
                    className="notification-btn"
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                    title="Toggle Dark Mode"
                >
                    {darkMode ? <SunIcon /> : <MoonIcon />}
                </button>

                {/* Notification Bell */}
                <div className="notification-wrapper" ref={dropdownRef}>
                    <button
                        className="notification-btn"
                        onClick={() => setShowNotifications((v) => !v)}
                        aria-label="Notifications"
                    >
                        <BellIcon />
                        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">
                            <div className="notification-dropdown-header">
                                <h3>Notifications</h3>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead}>Mark all read</button>
                                )}
                            </div>
                            <div className="notification-list">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`notification-item ${notif.read ? '' : 'unread'}`}
                                    >
                                        <div className={`notification-icon ${notif.type}`}>
                                            {notifIcons[notif.type]}
                                        </div>
                                        <div className="notification-text">
                                            <p>{notif.text}</p>
                                            <span className="notification-time">{notif.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile avatar */}
                <Link to={`/profile/${currentUser.id}`} className="avatar" title="My Profile">
                    {currentUser.initials}
                </Link>
            </div>
        </nav>
    );
}

