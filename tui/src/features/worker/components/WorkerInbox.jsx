import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInbox, fetchConversation, sendMessage, appendMessage, clearMessages } from '../../user/services/messageSlice';
import './WorkerInbox.css';

const WorkerInbox = () => {
    const dispatch = useDispatch();
    const { inbox, inboxLoading, messages, loading, sending } = useSelector(s => s.messages);
    const { email: myEmail } = useSelector(s => s.auth);

    const [selectedConv, setSelectedConv] = useState(null); // other party's email
    const [text, setText] = useState('');
    const bottomRef = useRef();

    // Load inbox on mount
    useEffect(() => {
        dispatch(fetchInbox());
    }, [dispatch]);

    // Load conversation when selectedConv changes
    useEffect(() => {
        if (selectedConv) {
            dispatch(clearMessages());
            dispatch(fetchConversation(selectedConv));
        }
    }, [selectedConv, dispatch]);

    // Auto-scroll to latest
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!text.trim() || !selectedConv) return;
        const content = text.trim();
        setText('');
        dispatch(appendMessage({
            id: Date.now().toString(),
            senderId: myEmail,
            receiverId: selectedConv,
            content,
            createdAt: new Date().toISOString(),
        }));
        await dispatch(sendMessage({ receiverId: selectedConv, content }));
        dispatch(fetchInbox()); // refresh preview
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const formatTime = (iso) => {
        try { return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
        catch { return ''; }
    };

    const formatDate = (iso) => {
        try {
            const d = new Date(iso);
            const today = new Date();
            if (d.toDateString() === today.toDateString()) return formatTime(iso);
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        } catch { return ''; }
    };

    // Determine the other party's email from a message
    const otherEmail = (msg) =>
        msg.senderId === myEmail ? msg.receiverId : msg.senderId;

    return (
        <div className="wi-page">
            {/* ── Sidebar ── */}
            <aside className="wi-sidebar">
                <div className="wi-sidebar-header">
                    <h2 className="wi-sidebar-title">💬 Messages</h2>
                </div>

                {inboxLoading && (
                    <div className="wi-center"><div className="wi-spinner" /></div>
                )}

                {!inboxLoading && inbox.length === 0 && (
                    <div className="wi-empty-inbox">
                        <span>📭</span>
                        <p>No messages yet</p>
                        <small>Users will appear here when they message you</small>
                    </div>
                )}

                <div className="wi-conv-list">
                    {inbox.map((msg) => {
                        const other = otherEmail(msg);
                        const isSelected = selectedConv === other;
                        const initial = other.charAt(0).toUpperCase();
                        return (
                            <div
                                key={msg.conversationId}
                                className={`wi-conv-item ${isSelected ? 'wi-conv-active' : ''}`}
                                onClick={() => setSelectedConv(other)}
                            >
                                <div className="wi-conv-avatar">{initial}</div>
                                <div className="wi-conv-info">
                                    <div className="wi-conv-name">{other}</div>
                                    <div className="wi-conv-preview">
                                        {msg.senderId === myEmail ? 'You: ' : ''}{msg.content}
                                    </div>
                                </div>
                                <div className="wi-conv-time">{formatDate(msg.createdAt)}</div>
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* ── Chat Panel ── */}
            <main className="wi-chat">
                {!selectedConv ? (
                    <div className="wi-no-chat">
                        <span className="wi-no-chat-icon">💬</span>
                        <p>Select a conversation to reply</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="wi-chat-header">
                            <div className="wi-chat-avatar">{selectedConv.charAt(0).toUpperCase()}</div>
                            <div>
                                <div className="wi-chat-name">{selectedConv}</div>
                                <div className="wi-chat-sub">User</div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="wi-chat-body">
                            {loading && <div className="wi-center"><div className="wi-spinner" /></div>}
                            {!loading && messages.length === 0 && (
                                <div className="wi-center wi-muted">No messages yet</div>
                            )}
                            {messages.map((msg) => {
                                const isMine = msg.senderId === myEmail;
                                return (
                                    <div key={msg.id} className={`wi-bubble-row ${isMine ? 'mine' : 'theirs'}`}>
                                        <div className={`wi-bubble ${isMine ? 'wi-bubble-mine' : 'wi-bubble-theirs'}`}>
                                            <p>{msg.content}</p>
                                            <span className="wi-time">{formatTime(msg.createdAt)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="wi-chat-footer">
                            <textarea
                                className="wi-input"
                                placeholder="Type a reply… (Enter to send)"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                onKeyDown={handleKey}
                                rows={1}
                            />
                            <button
                                className="wi-send-btn"
                                onClick={handleSend}
                                disabled={sending || !text.trim()}
                            >
                                {sending ? '…' : '➤'}
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default WorkerInbox;
