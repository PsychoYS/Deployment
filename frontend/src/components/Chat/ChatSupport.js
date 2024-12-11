import React, { useState, useRef, useEffect } from 'react';

const ChatSupport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = { text: inputMessage, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // First try the backend
            try {
                const response = await fetch('http://localhost:5002/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: inputMessage }),
                });

                const data = await response.json();
                if (data.messages && data.messages.length > 0) {
                    const botMessage = {
                        text: data.messages[0].content,
                        sender: 'bot'
                    };
                    setMessages(prev => [...prev, botMessage]);
                    setIsLoading(false);
                    setInputMessage('');
                    return;
                }
            } catch (backendError) {
                console.log('Backend not available, using local responses');
            }

            // Fallback to local responses if backend fails
            const lowerMsg = inputMessage.toLowerCase();
            let response = '';

            if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
                response = "Hello! How can I help you with your banking needs today?";
            }
            else if (lowerMsg.includes('account')) {
                response = "I can help you with account services. What would you like to know about:\n- Account balance\n- Account closure\n- Account settings";
            }
            else if (lowerMsg.includes('transfer')) {
                response = "To make a transfer:\n1. Go to the Transfer section\n2. Select recipient\n3. Enter amount\n4. Confirm transfer\n\nWould you like me to guide you through the process?";
            }
            else if (lowerMsg.includes('loan')) {
                response = "We offer several types of loans:\n- Personal loans\n- Home loans\n- Business loans\n- Education loans\n\nWhich type interests you?";
            }
            else {
                response = "I understand you're asking about " + inputMessage + ". How can I assist you with that?";
            }

            setTimeout(() => {
                const botMessage = {
                    text: response,
                    sender: 'bot'
                };
                setMessages(prev => [...prev, botMessage]);
                setIsLoading(false);
            }, 1000);

        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
        }

        setInputMessage('');
    };

    const styles = {
        container: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
        },
        chatButton: {
            backgroundColor: '#d4af37',
            color: '#000',
            border: 'none',
            padding: '15px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        chatWindow: {
            width: '380px',
            height: '500px',
            backgroundColor: '#1a1a1a',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        header: {
            backgroundColor: '#2d2d2d',
            padding: '15px',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        headerTitle: {
            margin: 0,
            color: '#d4af37',
            fontSize: '16px',
        },
        closeButton: {
            backgroundColor: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0 5px',
        },
        messageContainer: {
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        },
        message: {
            padding: '10px 15px',
            borderRadius: '10px',
            maxWidth: '80%',
            wordBreak: 'break-word',
        },
        userMessage: {
            backgroundColor: '#d4af37',
            color: '#000',
            alignSelf: 'flex-end',
        },
        botMessage: {
            backgroundColor: '#2d2d2d',
            color: '#fff',
            alignSelf: 'flex-start',
        },
        form: {
            padding: '15px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: '10px',
        },
        input: {
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: '#2d2d2d',
            color: '#fff',
            fontSize: '14px',
        },
        sendButton: {
            backgroundColor: '#d4af37',
            color: '#000',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease',
        }
    };

    return (
        <div style={styles.container}>
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    style={styles.chatButton}
                >
                    💬
                </button>
            ) : (
                <div style={styles.chatWindow}>
                    <div style={styles.header}>
                        <h3 style={styles.headerTitle}>Chat Support</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={styles.closeButton}
                        >
                            ×
                        </button>
                    </div>

                    <div style={styles.messageContainer}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.message,
                                    ...(message.sender === 'user' ? styles.userMessage : styles.botMessage)
                                }}
                            >
                                {message.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ ...styles.message, ...styles.botMessage }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d4af37', animation: 'bounce 0.8s infinite' }}></div>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d4af37', animation: 'bounce 0.8s infinite 0.2s' }}></div>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d4af37', animation: 'bounce 0.8s infinite 0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            style={styles.input}
                        />
                        <button type="submit" style={styles.sendButton}>
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatSupport;