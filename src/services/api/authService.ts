import axios from "./request";
import { LoginCredentials, SignupCredentials, AuthResponse } from "../../types/auth";

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        // Clear any existing tokens first
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        delete axios.defaults.headers.common['Authorization'];

        const { data, status } = await axios.post("/auth/login", credentials);
        
        if (data.token) {
            // Set token in both localStorage and cookie
            localStorage.setItem("token", data.token);
            document.cookie = `token=${data.token}; path=/; secure; samesite=strict; max-age=86400`;
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            // Verify token immediately
            const verifyResponse = await axios.get("/auth/me", {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            });
            
            if (!verifyResponse.data) {
                throw new Error('Token verification failed');
            }
        } else if (data.user && !data.token) {
            console.error('Login response missing token');
            throw new Error('Authentication error: Missing token');
        }

        return { data, status };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
        const { data, status } = await axios.post("/auth/signup", credentials);
        return { data, status };
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    // Clear token from both cookie and localStorage
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    localStorage.removeItem("token");
    delete axios.defaults.headers.common['Authorization'];
    window.location.replace("/login");
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
    try {
        // Get token from cookie or localStorage
        const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const localToken = localStorage.getItem('token');
        const token = cookieToken || localToken;

        if (!token) {
            return { data: null, status: 401 };
        }

        // Ensure both storage methods have the token
        if (cookieToken && !localToken) {
            localStorage.setItem('token', cookieToken);
        } else if (localToken && !cookieToken) {
            document.cookie = `token=${localToken}; path=/; secure; samesite=strict`;
        }

        // Set axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const { data, status } = await axios.get("/auth/me", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!data || !data.user) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            return { data: null, status: 401 };
        }

        return { data, status };
    } catch (error) {
        console.error('Get current user error:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        throw error;
    }
};
