import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as authService from '../services/api/authService';
import { LoginCredentials, SignupCredentials } from '../types/auth';

export const useAuth = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Optionnel: Vérifier la validité du token
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.user) {
                    setUser(response.data.user);
                }
                router.push('/dashboard');
                return response.data;
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw new Error('Email ou mot de passe incorrect');
        }
    };

    const signup = async (credentials: SignupCredentials) => {
        try {
            const response = await authService.signup(credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.user) {
                    setUser(response.data.user);
                }
                router.push('/dashboard');
                return response.data;
            }
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw new Error('Erreur lors de l\'inscription');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!localStorage.getItem('token')
    };
};
