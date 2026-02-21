import { useState } from 'react';
import { departments } from '../data/mockData';

export default function CreateProjectModal({ onClose, onCreate }) {
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [description, setDescription] = useState('');
    const [tagsInput, setTagsInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !department || !description.trim()) return;

        const newProject = {
            id: Date.now(),
            title: title.trim(),
            department,
            description: description.trim(),
            tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
            timestamp: 'Just now',
            authorId: null, // will be set by parent
            members: [],
            rating: 0,
            ratingCount: 0,
            commentCount: 0,
            status: 'idea',
            resources: [],
            milestones: [],
            joinRequests: [],
        };

        onCreate(newProject);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🚀 Create New Project</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Project Title</label>
                            <input
                                type="text"
                                placeholder="Enter project title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
                                <option value="">Select department</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.name}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                placeholder="Describe your project goals, methodology, and expected outcomes..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tags (comma-separated)</label>
                            <input
                                type="text"
                                placeholder="e.g. AI, React, Sustainability"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
