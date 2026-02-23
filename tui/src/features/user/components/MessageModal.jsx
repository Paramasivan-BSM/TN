import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation, sendMessage, appendMessage } from "../services/messageSlice";
import "./MessageModal.css";

const MessageModal = ({ worker, onClose }) => {
    const dispatch = useDispatch();
    const { messages, loading, sending } = useSelector(s => s.messages);
    const { email: myEmail } = useSelector(s => s.auth);
    const [text, setText] = useState("");
    const bottomRef = useRef();

    const workerEmail = worker?.email || worker?.workerEmail;

    useEffect(() => {
        if (workerEmail) dispatch(fetchConversation(workerEmail));
    }, [dispatch, workerEmail]);

    // Auto-scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!text.trim() || !workerEmail) return;
        const content = text.trim();
        setText("");

        // Optimistic append
        dispatch(appendMessage({
            id: Date.now().toString(),
            senderId: myEmail,
            receiverId: workerEmail,
            content,
            createdAt: new Date().toISOString(),
        }));

        await dispatch(sendMessage({ receiverId: workerEmail, content }));
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const formatTime = (iso) => {
        try { return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); }
        catch { return ""; }
    };

    return (
        <div className="mm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="mm-panel">
                {/* Header */}
                <div className="mm-header">
                    <div className="mm-header-avatar">{worker?.name?.charAt(0).toUpperCase()}</div>
                    <div>
                        <div className="mm-header-name">{worker?.name}</div>
                        <div className="mm-header-sub">{worker?.skill}</div>
                    </div>
                    <button className="mm-close" onClick={onClose}>✕</button>
                </div>

                {/* Messages */}
                <div className="mm-body">
                    {loading && <div className="mm-loading"><div className="mm-spinner" /></div>}
                    {!loading && messages.length === 0 && (
                        <div className="mm-empty">No messages yet. Say hello 👋</div>
                    )}
                    {messages.map(msg => {
                        const isMine = msg.senderId === myEmail;
                        return (
                            <div key={msg.id} className={`mm-bubble-row ${isMine ? "mine" : "theirs"}`}>
                                <div className={`mm-bubble ${isMine ? "mm-bubble-mine" : "mm-bubble-theirs"}`}>
                                    <p>{msg.content}</p>
                                    <span className="mm-time">{formatTime(msg.createdAt)}</span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="mm-footer">
                    <textarea
                        className="mm-input"
                        placeholder="Type a message… (Enter to send)"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={handleKey}
                        rows={1}
                    />
                    <button className="mm-send-btn" onClick={handleSend} disabled={sending || !text.trim()}>
                        {sending ? "…" : "➤"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
