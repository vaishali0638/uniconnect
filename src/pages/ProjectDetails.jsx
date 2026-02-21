import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projects, users, comments as initialComments } from '../data/mockData';
import './ProjectDetails.css';

const ArrowLeft = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function ProjectDetails() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const project = projects.find((p) => p.id === Number(id));

    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [upvotedIds, setUpvotedIds] = useState(new Set());
    const [userRating, setUserRating] = useState(0);

    const projectComments = useMemo(
        () => comments.filter((c) => c.projectId === Number(id)),
        [comments, id]
    );

    const topLevel = useMemo(() => {
        const rootComments = projectComments.filter((c) => !c.parentId);
        return rootComments.sort((a, b) => {
            const authorA = users.find((u) => u.id === a.authorId);
            const authorB = users.find((u) => u.id === b.authorId);
            const isFacA = authorA?.role === 'faculty';
            const isFacB = authorB?.role === 'faculty';

            if (isFacA && !isFacB) return -1;
            if (!isFacA && isFacB) return 1;
            return b.upvotes - a.upvotes;
        });
    }, [projectComments]);
    const getReplies = (parentId) => projectComments.filter((c) => c.parentId === parentId);

    if (!project) {
        return (
            <div className="project-details">
                <Link to="/" className="back-link"><ArrowLeft /> Back to Dashboard</Link>
                <h2>Project not found</h2>
            </div>
        );
    }

    const author = users.find((u) => u.id === project.authorId);
    const members = project.members.map((mid) => users.find((u) => u.id === mid)).filter(Boolean);

    const handlePostComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        const comment = {
            id: Date.now(),
            projectId: project.id,
            authorId: currentUser.id,
            text: newComment.trim(),
            timestamp: 'Just now',
            parentId: null,
            upvotes: 0,
        };
        setComments((prev) => [comment, ...prev]);
        setNewComment('');
    };

    const handleReply = (parentId) => {
        if (!replyText.trim()) return;
        const reply = {
            id: Date.now(),
            projectId: project.id,
            authorId: currentUser.id,
            text: replyText.trim(),
            timestamp: 'Just now',
            parentId,
            upvotes: 0,
        };
        setComments((prev) => [...prev, reply]);
        setReplyText('');
        setReplyingTo(null);
    };

    const toggleUpvote = (commentId) => {
        setUpvotedIds((prev) => {
            const next = new Set(prev);
            if (next.has(commentId)) next.delete(commentId);
            else next.add(commentId);
            return next;
        });
        setComments((prev) =>
            prev.map((c) =>
                c.id === commentId
                    ? { ...c, upvotes: c.upvotes + (upvotedIds.has(commentId) ? -1 : 1) }
                    : c
            )
        );
    };

    const deptColors = {
        'Computer Science': 'blue',
        'Environmental Studies': 'green',
        Biotechnology: 'green',
        Physics: 'orange',
        'Management Studies': 'blue',
        'English & Literature': 'orange',
    };

    const renderComment = (comment) => {
        const cAuthor = users.find((u) => u.id === comment.authorId);
        const replies = getReplies(comment.id);

        return (
            <div key={comment.id}>
                <div className="comment">
                    <div className="comment-avatar">{cAuthor?.initials || '??'}</div>
                    <div className="comment-body">
                        <div className="comment-header">
                            <span className="comment-author">{cAuthor?.name || 'Unknown'}</span>
                            {cAuthor && (
                                <>
                                    <span className={`comment-role ${cAuthor.role}`}>{cAuthor.role}</span>
                                    {cAuthor.role === 'faculty' && (
                                        <span className="faculty-recognized-badge">🎓 Faculty Recognized</span>
                                    )}
                                </>
                            )}
                            <span className="comment-time">{comment.timestamp}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                        <div className="comment-actions">
                            <button
                                className={`comment-action-btn ${upvotedIds.has(comment.id) ? 'upvoted' : ''}`}
                                onClick={() => toggleUpvote(comment.id)}
                            >
                                ▲ {comment.upvotes}
                            </button>
                            <button
                                className="comment-action-btn"
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                </div>

                {/* Inline reply form */}
                {replyingTo === comment.id && (
                    <div className="reply-form">
                        <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleReply(comment.id)}
                            autoFocus
                        />
                        <button className="btn btn-sm btn-primary" onClick={() => handleReply(comment.id)}>
                            Reply
                        </button>
                        <button className="btn btn-sm btn-ghost" onClick={() => setReplyingTo(null)}>
                            Cancel
                        </button>
                    </div>
                )}

                {/* Nested replies */}
                {replies.length > 0 && (
                    <div className="comment-replies">
                        {replies.map(renderComment)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="project-details">
            <Link to="/" className="back-link">
                <ArrowLeft /> Back to Dashboard
            </Link>

            {/* Header */}
            <div className="pd-header">
                <h1 className="pd-title">{project.title}</h1>
                <div className="pd-meta">
                    <div className="pd-author">
                        <div className="pd-author-avatar">{author?.initials}</div>
                        <span className="pd-author-name">{author?.name}</span>
                    </div>
                    <span className="pd-time">{project.timestamp}</span>
                </div>
                <div className="pd-tags">
                    <span className={`tag tag-${deptColors[project.department] || 'blue'}`}>
                        {project.department}
                    </span>
                    {project.tags.map((tag) => (
                        <span key={tag} className="tag tag-blue" style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div className="pd-description">{project.description}</div>

            {/* Stats */}
            <div className="pd-stats">
                <div className="pd-stat">
                    <div className="pd-stat-icon members">👥</div>
                    <div className="pd-stat-info">
                        <span className="pd-stat-value">{members.length}</span>
                        <span className="pd-stat-label">Members</span>
                    </div>
                </div>
                <div className="pd-stat">
                    <div className="pd-stat-icon rating">⭐</div>
                    <div className="pd-stat-info">
                        <span className="pd-stat-value">{project.rating}</span>
                        <span className="pd-stat-label">Rating</span>
                    </div>
                </div>
                <div className="pd-stat">
                    <div className="pd-stat-icon comments">💬</div>
                    <div className="pd-stat-info">
                        <span className="pd-stat-value">{projectComments.length}</span>
                        <span className="pd-stat-label">Comments</span>
                    </div>
                </div>
            </div>

            {/* Members */}
            <div className="pd-members">
                <h3>Team Members</h3>
                <div className="pd-members-list">
                    {members.map((m) => (
                        <Link key={m.id} to={`/profile/${m.id}`} className="pd-member-chip">
                            <span className="mini-avatar">{m.initials}</span>
                            {m.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Comments */}
            <div className="pd-comments">
                <h3 className="pd-comments-header">
                    Discussion ({projectComments.length})
                </h3>

                {/* Post form */}
                <form className="comment-form" onSubmit={handlePostComment}>
                    <div className="comment-form-avatar">{currentUser?.initials}</div>
                    <div className="comment-form-body">
                        <textarea
                            placeholder="Share your feedback or ask a question..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className="comment-form-actions">
                            <button type="submit" className="btn btn-primary btn-sm" disabled={!newComment.trim()}>
                                Post Comment
                            </button>
                        </div>
                    </div>
                </form>

                {/* Rating Option */}
                <div className="pd-rating-section">
                    <h4>Rate this project:</h4>
                    <div className="star-rating-interactive">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`star-btn ${userRating >= star ? 'active' : ''}`}
                                onClick={() => setUserRating(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                {/* Thread */}
                <div className="comment-thread">
                    {topLevel.map(renderComment)}
                </div>
            </div>
        </div>
    );
}
