import axios from "./request";
import { LoginCredentials, SignupCredentials, AuthResponse } from "../../types/auth";

// Function to set token in both localStorage and cookie
const setToken = (token: string) => {
    console.log('Setting token:', token); // Debug log
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/; secure; samesite=lax; max-age=86400`; // Changed samesite to lax
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Function to get token from storage
export const getToken = () => {
    if (typeof window === 'undefined') return null;

    let token = localStorage.getItem('token');
    if (!token) {
        const tokenCookie = document.cookie.split(';')
          .find(c => c.trim().startsWith('token='));
        if (tokenCookie) {
            token = tokenCookie.split('=')[1];
            localStorage.setItem('token', token);
        }
    }
    return token;
};


export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        // Clear any existing tokens first
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        delete axios.defaults.headers.common['Authorization'];

        console.log('Attempting login with credentials:', credentials); // Debug log
        const { data, status } = await axios.post("/auth/login", credentials);
        console.log('Login response:', { status, data }); // Debug log
        
        if (data.token) {
            setToken(data.token);

            // Verify token immediately
            const verifyResponse = await axios.get("/auth/me", {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            });
            
            console.log('Token verification response:', verifyResponse.data); // Debug log
            
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
        console.log('Attempting signup with credentials:', credentials); // Debug log
        const { data, status } = await axios.post("/auth/signup", credentials);
        console.log('Signup response:', { status, data }); // Debug log
        return { data, status };
    } catch (error) {
        console.error('Signup error:', error); // Debug log
        throw error;
    }
};

export const clearAuthState = () => {
    // Clear token from both cookie and localStorage
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=lax';
    localStorage.removeItem("token");
    sessionStorage.clear();
    
    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];
};

export const logout = async () => {
    try {
        console.log('Attempting logout'); // Debug log
        clearAuthState();
        
        // Clear any cached responses
        if ('caches' in window) {
            const cacheNames = await window.caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => window.caches.delete(cacheName))
            );
        }
    } catch (error) {
        console.error('Logout error:', error); // Debug log
        throw error;
    }
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
    try {
        const token = getToken();

        if (!token) {
            return { data: null, status: 401 };
        }

        // Set axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        console.log('Attempting to get current user with token:', token); // Debug log
        const { data, status } = await axios.get("/auth/me", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Get current user response:', { status, data }); // Debug log

        if (!data || !data.user) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            return { data: null, status: 401 };
        }

        return { data, status };
    } catch (error) {
        console.error('Get current user error:', error); // Debug log
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        throw error;
    }
};
