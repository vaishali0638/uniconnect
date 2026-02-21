import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { conversations as initialConvos, users } from '../data/mockData';
import './Messages.css';

export default function Messages() {
    const { currentUser } = useAuth();
    const [conversations, setConversations] = useState(initialConvos);
    const [activeConvo, setActiveConvo] = useState(null);
    const [newMsg, setNewMsg] = useState('');

    const myConvos = conversations.filter((c) => c.participants.includes(currentUser?.id));

    const getOtherUser = (convo) => {
        const otherId = convo.participants.find((id) => id !== currentUser?.id);
        return users.find((u) => u.id === otherId);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMsg.trim() || !activeConvo) return;

        const msg = {
            id: Date.now(),
            senderId: currentUser.id,
            text: newMsg.trim(),
            timestamp: 'Just now',
        };

        setConversations((prev) =>
            prev.map((c) =>
                c.id === activeConvo.id ? { ...c, messages: [...c.messages, msg] } : c
            )
        );
        setActiveConvo((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
        setNewMsg('');
    };

    const active = activeConvo
        ? conversations.find((c) => c.id === activeConvo.id)
        : null;

    return (
        <div className="messages-page">
            {/* Sidebar */}
            <div className={`messages-sidebar ${activeConvo ? 'hide-mobile' : ''}`}>
                <div className="messages-sidebar-header">
                    <h2>💬 Messages</h2>
                </div>
                <div className="convo-list">
                    {myConvos.map((convo) => {
                        const other = getOtherUser(convo);
                        const lastMsg = convo.messages[convo.messages.length - 1];
                        return (
                            <button
                                key={convo.id}
                                className={`convo-item ${activeConvo?.id === convo.id ? 'active' : ''}`}
                                onClick={() => setActiveConvo(convo)}
                            >
                                <div className="convo-avatar">{other?.initials}</div>
                                <div className="convo-info">
                                    <strong>{other?.name}</strong>
                                    <p>{lastMsg?.text?.substring(0, 45)}{lastMsg?.text?.length > 45 ? '...' : ''}</p>
                                </div>
                                <span className="convo-time">{lastMsg?.timestamp}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat area */}
            <div className={`messages-chat ${!activeConvo ? 'hide-mobile' : ''}`}>
                {active ? (
                    <>
                        <div className="chat-header">
                            <button className="btn btn-ghost btn-sm mobile-back" onClick={() => setActiveConvo(null)}>← Back</button>
                            <div className="chat-header-user">
                                <div className="convo-avatar sm">{getOtherUser(active)?.initials}</div>
                                <div>
                                    <strong>{getOtherUser(active)?.name}</strong>
                                    <span>{getOtherUser(active)?.department}</span>
                                </div>
                            </div>
                        </div>
                        <div className="chat-messages">
                            {active.messages.map((msg) => {
                                const isMine = msg.senderId === currentUser.id;
                                return (
                                    <div key={msg.id} className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                                        <p>{msg.text}</p>
                                        <span className="chat-time">{msg.timestamp}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <form className="chat-input" onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMsg}
                                onChange={(e) => setNewMsg(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary btn-sm" disabled={!newMsg.trim()}>Send</button>
                        </form>
                    </>
                ) : (
                    <div className="chat-empty">
                        <div className="chat-empty-icon">💬</div>
                        <h3>Select a conversation</h3>
                        <p>Choose a conversation from the sidebar to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
