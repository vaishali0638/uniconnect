import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProjectCard.css';

const CommentIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function StarRating({ rating, onRate }) {
    const [hovered, setHovered] = useState(0);

    const renderStar = (index) => {
        const display = hovered || rating;
        let cls = 'star empty';
        if (index <= Math.floor(display)) cls = 'star filled';
        else if (index === Math.ceil(display) && display % 1 !== 0) cls = 'star half';

        return (
            <span
                key={index}
                className={cls}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => onRate(index)}
            >
                ★
            </span>
        );
    };

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(renderStar)}
            <span className="star-value">{rating.toFixed(1)}</span>
        </div>
    );
}

// Dept‐to‐color mapping
const deptColors = {
    'Computer Science': 'blue',
    'Environmental Studies': 'green',
    Biotechnology: 'green',
    Physics: 'orange',
    'Management Studies': 'blue',
    'English & Literature': 'orange',
};

export default function ProjectCard({ project, index = 0 }) {
    const [rating, setRating] = useState(project.rating);
    const [joined, setJoined] = useState(false);

    const colorClass = deptColors[project.department] || 'blue';

    return (
        <div className={`project-card stagger-${(index % 8) + 1}`} style={{ animationDelay: `${index * 0.06}s` }}>
            <div className="project-card-header">
                <h3 className="project-card-title">{project.title}</h3>
            </div>

            <div className="project-card-meta">
                <span className={`tag tag-${colorClass} project-card-dept`}>{project.department}</span>
                {project.isFacultyRecognized && (
                    <span className="faculty-recognized-badge" style={{ marginLeft: '4px' }}>🎓 Faculty Recognized</span>
                )}
                <span className="project-card-time">{project.timestamp}</span>
            </div>

            <p className="project-card-desc">{project.description}</p>

            <div className="project-card-tags">
                {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>

            <div className="project-card-footer">
                <div className="project-card-stats">
                    <Link to={`/project/${project.id}`} className="project-card-stat stat-comments">
                        <CommentIcon />
                        {project.commentCount} Comments
                    </Link>
                    <div className="project-card-stat">
                        <StarRating rating={rating} onRate={setRating} />
                    </div>
                </div>
                <div className="project-card-actions">
                    <button
                        className={`btn btn-sm ${joined ? 'btn-ghost' : 'btn-secondary'}`}
                        onClick={() => setJoined((v) => !v)}
                    >
                        {joined ? '✓ Joined' : 'Join Project'}
                    </button>
                    <Link to={`/project/${project.id}`} className="btn btn-sm btn-primary">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
