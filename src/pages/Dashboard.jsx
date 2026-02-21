import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { projects as initialProjects, departments } from '../data/mockData';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import './Dashboard.css';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [projects, setProjects] = useState(initialProjects);
    const [selectedDept, setSelectedDept] = useState('All Departments');
    const [keyword, setKeyword] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const filteredProjects = useMemo(() => {
        return projects.filter((p) => {
            const matchesDept =
                selectedDept === 'All Departments' || p.department === selectedDept;
            const kw = keyword.toLowerCase();
            const matchesKeyword =
                !kw ||
                p.title.toLowerCase().includes(kw) ||
                p.description.toLowerCase().includes(kw) ||
                p.tags.some((t) => t.toLowerCase().includes(kw));
            return matchesDept && matchesKeyword;
        });
    }, [projects, selectedDept, keyword]);

    const handleCreateProject = (newProject) => {
        const projectWithAuthor = {
            ...newProject,
            authorId: currentUser.id,
            members: [currentUser.id],
        };
        setProjects((prev) => [projectWithAuthor, ...prev]);
    };

    return (
        <div className="dashboard">
            {/* Hero search */}
            <div className="dashboard-hero">
                <div className="dashboard-hero-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2>Discover & Collaborate</h2>
                            <p>Explore research projects from across Pondicherry University</p>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            + Post Project
                        </button>
                    </div>
                    <div className="dashboard-search" style={{ marginTop: '24px' }}>
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option>All Departments</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.name}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Search projects by keyword, tag, or title..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Project feed */}
            <div className="dashboard-feed">
                <div className="feed-header">
                    <h3>
                        {selectedDept === 'All Departments'
                            ? 'All Projects'
                            : selectedDept}
                    </h3>
                    <span className="feed-count">
                        {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {filteredProjects.length > 0 ? (
                    <div className="feed-list">
                        {filteredProjects.map((project, i) => (
                            <ProjectCard key={project.id} project={project} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="feed-empty">
                        <div className="feed-empty-icon">🔍</div>
                        <h3>No projects found</h3>
                        <p>Try adjusting your filters or search keywords</p>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateProjectModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateProject}
                />
            )}
        </div>
    );
}

