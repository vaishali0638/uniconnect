import { useMemo } from 'react';
import { projects, users, departments, comments } from '../data/mockData';
import './Analytics.css';

function StatCard({ icon, label, value, color }) {
    return (
        <div className={`analytics-stat ${color}`}>
            <div className="analytics-stat-icon">{icon}</div>
            <div className="analytics-stat-info">
                <span className="analytics-stat-value">{value}</span>
                <span className="analytics-stat-label">{label}</span>
            </div>
        </div>
    );
}

function BarHorizontal({ label, value, max, color }) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="bar-row">
            <span className="bar-label">{label}</span>
            <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%`, background: color || 'var(--primary)' }} />
            </div>
            <span className="bar-value">{value}</span>
        </div>
    );
}

export default function Analytics() {
    const stats = useMemo(() => {
        const totalProjects = projects.length;
        const totalUsers = users.length;
        const totalComments = comments.length;
        const avgRating = projects.reduce((s, p) => s + p.rating, 0) / totalProjects;

        const byDept = departments.map((d) => ({
            name: d.name,
            count: projects.filter((p) => p.department === d.name).length,
        })).sort((a, b) => b.count - a.count);

        const byStatus = [
            { name: 'In Progress', count: projects.filter((p) => p.status === 'in-progress').length, color: 'var(--primary)' },
            { name: 'Idea Stage', count: projects.filter((p) => p.status === 'idea').length, color: 'var(--warning)' },
            { name: 'Completed', count: projects.filter((p) => p.status === 'completed').length, color: 'var(--success)' },
        ];

        const topProjects = [...projects].sort((a, b) => b.rating - a.rating).slice(0, 5);

        const topContributors = users.map((u) => ({
            ...u,
            projectCount: projects.filter((p) => p.members.includes(u.id)).length,
        })).sort((a, b) => b.projectCount - a.projectCount);

        return { totalProjects, totalUsers, totalComments, avgRating, byDept, byStatus, topProjects, topContributors };
    }, []);

    const maxDept = Math.max(...stats.byDept.map((d) => d.count));
    const maxStatus = Math.max(...stats.byStatus.map((s) => s.count));

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <h2>📊 Department Analytics</h2>
                <p>Overview of project activity across Pondicherry University</p>
            </div>

            {/* Stat cards */}
            <div className="analytics-cards">
                <StatCard icon="📂" label="Total Projects" value={stats.totalProjects} color="primary" />
                <StatCard icon="👥" label="Active Users" value={stats.totalUsers} color="info" />
                <StatCard icon="💬" label="Comments" value={stats.totalComments} color="success" />
                <StatCard icon="⭐" label="Avg Rating" value={stats.avgRating.toFixed(1)} color="warning" />
            </div>

            <div className="analytics-grid">
                {/* Projects by Department */}
                <div className="analytics-section">
                    <h3>Projects by Department</h3>
                    <div className="bar-chart">
                        {stats.byDept.map((d) => (
                            <BarHorizontal key={d.name} label={d.name} value={d.count} max={maxDept} />
                        ))}
                    </div>
                </div>

                {/* Projects by Status */}
                <div className="analytics-section">
                    <h3>Projects by Status</h3>
                    <div className="bar-chart">
                        {stats.byStatus.map((s) => (
                            <BarHorizontal key={s.name} label={s.name} value={s.count} max={maxStatus} color={s.color} />
                        ))}
                    </div>
                </div>

                {/* Top-Rated Projects */}
                <div className="analytics-section">
                    <h3>🏆 Top Rated Projects</h3>
                    <div className="top-list">
                        {stats.topProjects.map((p, i) => (
                            <div key={p.id} className="top-item">
                                <span className="top-rank">#{i + 1}</span>
                                <div className="top-info">
                                    <strong>{p.title}</strong>
                                    <span>{p.department}</span>
                                </div>
                                <span className="top-rating">⭐ {p.rating}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Contributors */}
                <div className="analytics-section">
                    <h3>🌟 Top Contributors</h3>
                    <div className="top-list">
                        {stats.topContributors.map((u, i) => (
                            <div key={u.id} className="top-item">
                                <span className="top-rank">#{i + 1}</span>
                                <div className="top-info">
                                    <strong>{u.name}</strong>
                                    <span>{u.department} · {u.role}</span>
                                </div>
                                <span className="top-rating">{u.projectCount} projects</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
