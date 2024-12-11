import React from 'react';
import { Link } from 'react-router-dom';
import { commonStyles, animations } from '../styles/commonStyles';

const Transaction = () => {
    const transactionServices = [
        {
            path: "/transactions/bills",
            title: "Bill Payment",
            description: "Pay your bills securely"
        },
        {
            path: "/transactions/transfer",
            title: "Transfer Money",
            description: "Transfer funds between accounts"
        },
        {
            path: "/transactions/scheduled-transfer",
            title: "Scheduled Transfers",
            description: "Set up recurring transfers"
        },
        {
            path: "/atm-locator",
            title: "ATM Locator",
            description: "Find ATMs near you"
        },
        {
            path: "/transactions/messages",
            title: "Messages",
            description: "View your transaction messages"
        }
    ];

    return (
        <div style={commonStyles.pageContainer}>
            <div style={commonStyles.contentWrapper}>
                <div style={{
                    ...commonStyles.section,
                    textAlign: 'center',
                    marginBottom: '3rem',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <h1 style={commonStyles.title}>Transaction Services</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem',
                        opacity: 0.9
                    }}>
                        Choose a transaction service below
                    </p>
                </div>

                <div style={{
                    ...commonStyles.grid,
                    animation: 'slideIn 0.5s ease-out'
                }}>
                    {transactionServices.map((service, index) => (
                        <Link 
                            key={index}
                            to={service.path} 
                            style={{
                                ...commonStyles.card,
                                animation: `floatAnimation 3s ease-in-out infinite`,
                                animationDelay: `${index * 0.2}s`,
                                textDecoration: 'none'
                            }}
                            className="floating-card"
                        >
                            <h2 style={{
                                ...commonStyles.subtitle,
                                color: '#d4af37',
                                marginBottom: '1rem',
                                fontSize: '1.5rem'
                            }}>
                                {service.title}
                            </h2>
                            <p style={commonStyles.text}>
                                {service.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
            <style>
                {animations}
                {`
                    .floating-card:hover {
                        animation-play-state: paused;
                        transform: translateY(-10px);
                    }
                `}
            </style>
        </div>
    );
};

export default Transaction; 