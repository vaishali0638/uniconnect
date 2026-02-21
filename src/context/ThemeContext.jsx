import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        try { return localStorage.getItem('uniconnect-theme') === 'dark'; } catch { return false; }
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
        try { localStorage.setItem('uniconnect-theme', darkMode ? 'dark' : 'light'); } catch { }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode((v) => !v);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
