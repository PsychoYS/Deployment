export const commonStyles = {
    pageContainer: {
        minWidth: '100vw',
        minHeight: '100vh',
        padding: '1rem',
        backgroundColor: '#121212',
        overflowX: 'hidden',
        overflowY: 'auto',
        boxSizing: 'border-box',
        margin: 0,
        display: 'flex',
        flexDirection: 'column'
    },
    contentWrapper: {
        width: '100%',
        maxWidth: '1920px',
        margin: '0 auto',
        padding: '1rem',
        flex: 1,
        boxSizing: 'border-box',
        '@media (max-width: 768px)': {
            padding: '0.5rem'
        }
    },
    section: {
        backgroundColor: '#1e1e1e',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        width: '100%',
        boxSizing: 'border-box',
        '@media (max-width: 768px)': {
            padding: '1rem'
        }
    },
    title: {
        color: '#d4af37',
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        marginBottom: '1.5rem',
        textAlign: 'center',
        wordWrap: 'break-word'
    },
    subtitle: {
        color: '#fff',
        fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
        marginBottom: '1rem',
        wordWrap: 'break-word'
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        lineHeight: '1.6',
        wordWrap: 'break-word'
    },
    card: {
        backgroundColor: '#1e1e1e',
        padding: '1.5rem',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
            borderColor: '#d4af37',
            backgroundColor: '#2d2d2d',
        },
        '@media (max-width: 768px)': {
            padding: '1rem'
        }
    },
    button: {
        backgroundColor: '#d4af37',
        color: '#121212',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        border: 'none',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: 'auto',
        minWidth: '120px',
        '&:hover': {
            backgroundColor: '#e5c158',
            transform: 'translateY(-2px)',
        },
        '@media (max-width: 768px)': {
            padding: '0.5rem 1rem'
        }
    },
    input: {
        backgroundColor: '#2d2d2d',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        color: '#fff',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        '&:focus': {
            borderColor: '#d4af37',
            outline: 'none',
            boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.2)',
        },
        '@media (max-width: 768px)': {
            padding: '0.5rem 0.75rem'
        }
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: 'clamp(1rem, 2vw, 1.5rem)',
        width: '100%',
        boxSizing: 'border-box',
        padding: '1rem',
        '@media (max-width: 768px)': {
            padding: '0.5rem',
            gap: '1rem'
        }
    },
    flexCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        gap: '1rem',
        flexWrap: 'wrap'
    },
    flexBetween: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: '1rem',
        flexWrap: 'wrap'
    },
    link: {
        color: '#d4af37',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        '&:hover': {
            color: '#e5c158',
            textDecoration: 'underline',
        }
    }
};

// Add a global style to ensure proper box-sizing
const globalStyle = `
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
    }
`;

export const animations = `
    ${globalStyle}
    
    @keyframes floatAnimation {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`; 