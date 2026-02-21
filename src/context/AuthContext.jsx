import { createContext, useContext, useState } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    const login = (userId) => {
        const user = users.find((u) => u.id === userId);
        if (user) setCurrentUser(user);
    };

    const logout = () => setCurrentUser(null);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!currentUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
