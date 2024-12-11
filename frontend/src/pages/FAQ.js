import React, { useState } from 'react';
import { commonStyles, animations } from '../styles/commonStyles';

const FAQ = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredId, setHoveredId] = useState(null);

    const faqList = [
        {
            id: 1,
            question: "How do I check my account balance?",
            answer: "You can check your balance by clicking on 'Balance Check' in the navigation menu after logging in."
        },
        {
            id: 2,
            question: "How do I apply for a loan?",
            answer: "To apply for a loan, navigate to 'Apply for Loan' in the menu. Fill out the required information and submit your application."
        },
        {
            id: 3,
            question: "What should I do if I have a dispute?",
            answer: "If you have a dispute, go to the 'Disputes' section and create a new dispute ticket. Describe your issue in detail."
        },
        {
            id: 4,
            question: "How do I request account closure?",
            answer: "To close your account, go to Account Overview and select 'Request Closure'. Provide a reason for closure and submit your request."
        },
        {
            id: 5,
            question: "How secure is my account?",
            answer: "We use industry-standard security measures including encryption and secure authentication to protect your account."
        }
    ];

    const filteredFAQs = faqList.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={commonStyles.pageContainer}>
            <div style={commonStyles.contentWrapper}>
                <div style={{
                    ...commonStyles.section,
                    textAlign: 'center',
                    marginBottom: '2rem',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <h1 style={commonStyles.title}>Frequently Asked Questions</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem',
                        opacity: 0.9
                    }}>
                        Find answers to common questions about our banking services
                    </p>
                </div>

                <div style={{
                    ...commonStyles.section,
                    animation: 'slideIn 0.5s ease-out'
                }}>
                    <div style={{
                        marginBottom: '2rem',
                        position: 'sticky',
                        top: '1rem',
                        zIndex: 1
                    }}>
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                ...commonStyles.input,
                                fontSize: '1.1rem',
                                padding: '1rem 1.5rem'
                            }}
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {filteredFAQs.map((faq, index) => (
                            <div
                                key={faq.id}
                                style={{
                                    ...commonStyles.card,
                                    cursor: 'default',
                                    animation: `slideIn 0.5s ease-out ${index * 0.1}s`,
                                    transform: hoveredId === faq.id ? 'translateY(-5px)' : 'none',
                                    backgroundColor: hoveredId === faq.id ? '#2d2d2d' : '#1e1e1e'
                                }}
                                onMouseEnter={() => setHoveredId(faq.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <h3 style={{
                                    ...commonStyles.subtitle,
                                    color: '#d4af37',
                                    marginBottom: '1rem',
                                    fontSize: '1.2rem'
                                }}>
                                    {faq.question}
                                </h3>
                                <p style={{
                                    ...commonStyles.text,
                                    lineHeight: '1.6'
                                }}>
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                        {filteredFAQs.length === 0 && (
                            <div style={{
                                ...commonStyles.flexCenter,
                                padding: '3rem'
                            }}>
                                <p style={{
                                    ...commonStyles.text,
                                    opacity: 0.7
                                }}>
                                    No matching FAQs found.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>
                {animations}
            </style>
        </div>
    );
};

export default FAQ;