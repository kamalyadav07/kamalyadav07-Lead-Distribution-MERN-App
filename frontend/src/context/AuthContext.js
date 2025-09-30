import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // This effect runs when the component mounts.
        // It ensures that the app state is in sync with localStorage.
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            setIsAuthenticated(true);
        }
        setLoading(false); // Initial load is done
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            const { token } = res.data;

            // Store the token and update state
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setToken(token);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (err) {
            // Clear any old tokens on failure
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setIsAuthenticated(false);
            setLoading(false);
            // Re-throw the error so the component can handle it
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};