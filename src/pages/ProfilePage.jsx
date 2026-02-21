import { useParams, Link } from 'react-router-dom';
import { users, projects } from '../data/mockData';
import './ProfilePage.css';

const ArrowLeft = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function ProfilePage() {
    const { id } = useParams();
    const user = users.find((u) => u.id === Number(id));

    if (!user) {
        return (
            <div className="profile-page">
                <Link to="/" className="back-link"><ArrowLeft /> Back to Dashboard</Link>
                <h2>User not found</h2>
            </div>
        );
    }

    const userProjects = projects.filter((p) => p.members.includes(user.id));

    const collabLabel =
        user.collaborationStatus === 'looking'
            ? '🔍 Looking for Collaborators'
            : '🤝 Offering Skills & Mentorship';

    return (
        <div className="profile-page">
            <Link to="/" className="back-link">
                <ArrowLeft /> Back to Dashboard
            </Link>

            {/* Profile header */}
            <div className="profile-header">
                <div className="profile-banner" />
                <div className="profile-info">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">{user.initials}</div>
                    </div>
                    <div className="profile-name-row">
                        <h1 className="profile-name">{user.name}</h1>
                        <span className={`profile-role-badge ${user.role}`}>{user.role}</span>
                    </div>
                    <p className="profile-dept">🏛️ {user.department}</p>
                    <p className="profile-bio">{user.bio}</p>
                </div>
            </div>

            {/* Skills */}
            <div className="profile-section">
                <h3 className="profile-section-title">🛠️ Skills & Expertise</h3>
                <div className="skills-list">
                    {user.skills.map((skill) => (
                        <span key={skill} className="skill-chip">{skill}</span>
                    ))}
                </div>
            </div>

            {/* Collaboration Corner */}
            <div className="profile-section collab-corner">
                <h3 className="profile-section-title">🤝 Collaboration Corner</h3>
                <div className="collab-status">
                    <span className={`collab-indicator ${user.collaborationStatus}`} />
                    <span className="collab-status-text">{collabLabel}</span>
                </div>
                <div className="collab-note">{user.collaborationNote}</div>
            </div>

            {/* Projects */}
            <div className="profile-section">
                <h3 className="profile-section-title">📂 Projects ({userProjects.length})</h3>
                <div className="profile-projects">
                    {userProjects.map((p) => (
                        <Link key={p.id} to={`/project/${p.id}`} className="profile-project-item">
                            <div className="profile-project-info">
                                <h4>{p.title}</h4>
                                <p>
                                    <span className={`tag tag-${p.department === 'Computer Science' ? 'blue' : p.department === 'Physics' ? 'orange' : 'green'}`} style={{ fontSize: '0.65rem' }}>
                                        {p.department}
                                    </span>
                                    {p.timestamp}
                                    <span>⭐ {p.rating}</span>
                                </p>
                            </div>
                            <span className="profile-project-arrow">→</span>
                        </Link>
                    ))}
                    {userProjects.length === 0 && (
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>No projects yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
