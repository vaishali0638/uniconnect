import { useState } from 'react';
import { Link } from 'react-router-dom';
import { activityFeed, users, projects } from '../data/mockData';
import './ActivityFeed.css';

const typeIcons = {
    project_created: '🚀',
    comment: '💬',
    join_request: '🤝',
    join_accept: '✅',
    review: '📝',
    milestone: '🏁',
    rating: '⭐',
    resource: '📎',
};

const typeColors = {
    project_created: 'primary',
    comment: 'info',
    join_request: 'warning',
    join_accept: 'success',
    review: 'primary',
    milestone: 'success',
    rating: 'warning',
    resource: 'info',
};

export default function ActivityFeed() {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all'
        ? activityFeed
        : activityFeed.filter((a) => a.type === filter);

    return (
        <div className="activity-page">
            <div className="activity-header">
                <h2>📡 Activity Feed</h2>
                <p>Stay up to date with everything happening across campus</p>
            </div>

            <div className="activity-filters">
                {[
                    ['all', 'All'],
                    ['project_created', '🚀 Projects'],
                    ['comment', '💬 Comments'],
                    ['join_request', '🤝 Joins'],
                    ['review', '📝 Reviews'],
                    ['milestone', '🏁 Milestones'],
                ].map(([val, label]) => (
                    <button
                        key={val}
                        className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFilter(val)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="activity-timeline">
                {filtered.map((item) => {
                    const user = users.find((u) => u.id === item.userId);
                    const project = projects.find((p) => p.id === item.projectId);

                    return (
                        <div key={item.id} className="activity-item animate-fade-in-up">
                            <div className={`activity-icon ${typeColors[item.type]}`}>
                                {typeIcons[item.type]}
                            </div>
                            <div className="activity-content">
                                <p>
                                    <Link to={`/profile/${user?.id}`} className="activity-user">{user?.name}</Link>
                                    {' '}{item.text}{' '}
                                    <Link to={`/project/${project?.id}`} className="activity-project">"{project?.title}"</Link>
                                </p>
                                <span className="activity-time">{item.timestamp}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
