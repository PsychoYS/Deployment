import React from 'react';
import { commonStyles, animations } from '../styles/commonStyles';
import FeedbackComponent from '../components/Feedback';

const FeedbackPage = () => {
    return (
        <div style={commonStyles.pageContainer}>
            <div style={commonStyles.contentWrapper}>
                <div style={{
                    ...commonStyles.section,
                    textAlign: 'center',
                    marginBottom: '2rem',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <h1 style={commonStyles.title}>Your Feedback</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem',
                        opacity: 0.9
                    }}>
                        Help us improve by sharing your experience
                    </p>
                </div>

                <div style={{
                    ...commonStyles.section,
                    animation: 'slideIn 0.5s ease-out',
                    padding: 0,
                    overflow: 'hidden'
                }}>
                    <FeedbackComponent />
                </div>
            </div>
            <style>
                {animations}
            </style>
        </div>
    );
};

export default FeedbackPage; 