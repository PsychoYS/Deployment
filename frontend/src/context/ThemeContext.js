import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const theme = {
        dark: {
            body: '#1a1a1a',
            text: '#ffffff',
            primary: '#2c3e50',
            secondary: '#34495e',
            accent: '#3498db',
        },
        light: {
            body: '#ffffff',
            text: '#000000',
            primary: '#f8f9fa',
            secondary: '#e9ecef',
            accent: '#007bff',
        }
    };

    const currentTheme = isDarkMode ? theme.dark : theme.light;

    useEffect(() => {
        // Apply theme to body element
        document.body.style.backgroundColor = currentTheme.body;
        document.body.style.color = currentTheme.text;
    }, [isDarkMode, currentTheme]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext); 