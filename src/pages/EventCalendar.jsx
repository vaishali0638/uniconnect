import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { events as initialEvents } from '../data/mockData';
import './EventCalendar.css';

const typeColors = {
    symposium: 'primary',
    workshop: 'info',
    hackathon: 'success',
    seminar: 'warning',
    competition: 'orange',
    'study-group': 'primary',
};

const typeIcons = {
    symposium: '🎤',
    workshop: '🛠️',
    hackathon: '💡',
    seminar: '📚',
    competition: '🏆',
    'study-group': '📖',
};

export default function EventCalendar() {
    const { currentUser } = useAuth();
    const [events, setEvents] = useState(initialEvents);
    const [view, setView] = useState('list');

    const today = new Date();
    const upcoming = [...events]
        .filter((e) => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    const past = [...events]
        .filter((e) => new Date(e.date) < today)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const toggleAttend = (eventId) => {
        setEvents((prev) =>
            prev.map((e) => {
                if (e.id !== eventId) return e;
                const isAttending = e.attendees.includes(currentUser.id);
                return {
                    ...e,
                    attendees: isAttending
                        ? e.attendees.filter((id) => id !== currentUser.id)
                        : [...e.attendees, currentUser.id],
                };
            })
        );
    };

    const renderEvent = (event) => {
        const isAttending = event.attendees.includes(currentUser.id);
        const eventDate = new Date(event.date);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

        return (
            <div key={event.id} className="event-card animate-fade-in-up">
                <div className="event-date-badge">
                    <span className="event-day">{day}</span>
                    <span className="event-month">{month}</span>
                </div>
                <div className="event-body">
                    <div className="event-top">
                        <span className={`tag tag-${typeColors[event.type] || 'blue'}`}>
                            {typeIcons[event.type]} {event.type.replace('-', ' ')}
                        </span>
                        <span className="event-time-badge">{event.time}</span>
                    </div>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-desc">{event.description}</p>
                    <div className="event-meta">
                        <span>📍 {event.location}</span>
                        <span>🎯 {event.organizer}</span>
                        <span>👥 {event.attendees.length} attending</span>
                    </div>
                    <div className="event-tags">
                        {event.tags.map((t) => (
                            <span key={t} className="tag" style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{t}</span>
                        ))}
                    </div>
                    <button
                        className={`btn btn-sm ${isAttending ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => toggleAttend(event.id)}
                    >
                        {isAttending ? '✓ Attending' : 'RSVP'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="events-page">
            <div className="events-header">
                <div>
                    <h2>📅 Events & Workshops</h2>
                    <p>Campus events, workshops, seminars, and hackathons</p>
                </div>
            </div>

            {upcoming.length > 0 && (
                <>
                    <h3 className="events-section-title">Upcoming Events</h3>
                    <div className="events-list">
                        {upcoming.map(renderEvent)}
                    </div>
                </>
            )}

            {past.length > 0 && (
                <>
                    <h3 className="events-section-title" style={{ marginTop: 32 }}>Past Events</h3>
                    <div className="events-list past">
                        {past.map(renderEvent)}
                    </div>
                </>
            )}
        </div>
    );
}
