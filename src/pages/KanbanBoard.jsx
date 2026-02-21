import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects as initialProjects } from '../data/mockData';
import './KanbanBoard.css';

const columns = [
    { key: 'idea', label: '💡 Idea', color: 'var(--warning)' },
    { key: 'in-progress', label: '🔄 In Progress', color: 'var(--primary)' },
    { key: 'completed', label: '✅ Completed', color: 'var(--success)' },
];

export default function KanbanBoard() {
    const [projects, setProjects] = useState(initialProjects);
    const [dragging, setDragging] = useState(null);

    const handleDragStart = (projectId) => setDragging(projectId);
    const handleDragEnd = () => setDragging(null);

    const handleDrop = (status) => {
        if (!dragging) return;
        setProjects((prev) =>
            prev.map((p) => (p.id === dragging ? { ...p, status } : p))
        );
        setDragging(null);
    };

    return (
        <div className="kanban-page">
            <div className="kanban-header">
                <h2>📋 Project Kanban Board</h2>
                <p>Drag and drop projects to track their progress</p>
            </div>

            <div className="kanban-board">
                {columns.map((col) => {
                    const colProjects = projects.filter((p) => p.status === col.key);

                    return (
                        <div
                            key={col.key}
                            className={`kanban-column ${dragging ? 'drop-target' : ''}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(col.key)}
                        >
                            <div className="kanban-column-header">
                                <h3>{col.label}</h3>
                                <span className="kanban-count">{colProjects.length}</span>
                            </div>
                            <div className="kanban-cards">
                                {colProjects.map((p) => (
                                    <div
                                        key={p.id}
                                        className={`kanban-card ${dragging === p.id ? 'dragging' : ''}`}
                                        draggable
                                        onDragStart={() => handleDragStart(p.id)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="kanban-card-dept">
                                            <span className="tag tag-blue" style={{ fontSize: '0.65rem' }}>{p.department}</span>
                                        </div>
                                        <h4>{p.title}</h4>
                                        <p>{p.description.substring(0, 80)}...</p>
                                        <div className="kanban-card-footer">
                                            <span>⭐ {p.rating}</span>
                                            <span>💬 {p.commentCount}</span>
                                            <Link to={`/project/${p.id}`} className="kanban-view">View →</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
