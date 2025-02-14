import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '../services/api/authService';
import { LoginCredentials, SignupCredentials } from '../types/auth';

// Define the type for the auth context
type AuthContextType = {
    user: any | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    signup: (credentials: SignupCredentials) => Promise<any>;
    logout: () => void;
    isAuthenticated: boolean;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (!token) {
                setUser(null);
                setIsAuthenticated(false);
                return;
            }

            const response = await authService.getCurrentUser();
            if (response.data) {
                setUser(response.data);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Recheck auth when localStorage or cookie changes
    useEffect(() => {
        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const response = await authService.login({ email, password });
            if (response.data.token) {
                // Set token in both localStorage and cookie
                localStorage.setItem('token', response.data.token);
                document.cookie = `token=${response.data.token}; path=/; secure; samesite=strict`;
                
                // After successful login and token storage, get current user data
                const userResponse = await authService.getCurrentUser();
                setUser(userResponse.data);
                setIsAuthenticated(true);
                
                // Use push instead of replace for better navigation
                await router.push('/dashboard');
                return response.data;
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw new Error('Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    const signup = async (credentials: SignupCredentials) => {
        try {
            const response = await authService.signup(credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                document.cookie = `token=${response.data.token}; path=/; secure; samesite=strict`;
                if (response.data.user) {
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                }
                await router.push('/dashboard');
                return response.data;
            }
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw new Error('Erreur lors de l\'inscription');
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            
            // Clear all auth state first
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            
            // Force immediate navigation to login
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, try to redirect to login
            window.location.href = '/login';
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};