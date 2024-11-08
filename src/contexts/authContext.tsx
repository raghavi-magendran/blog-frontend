import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectAuthToken } from '../slice/authSlice';
import { useSelector } from 'react-redux';

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const token = useSelector(selectAuthToken);  // Access the token from Redux
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchUserDetails(token);
        }
    }, [token]); // Run this effect whenever the token changes

    const fetchUserDetails = async (token: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            logout();
        }
    };

    const login = async (username: string, password: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const { access_token } = await response.json();
                // Assume Redux is set up to store the token when login is successful
                fetchUserDetails(access_token);
                navigate('/');
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
        setLoading(false);
    };

    const logout = () => {
        // Assume Redux will clear the token and reset auth state on logout
        setUser(undefined);
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
