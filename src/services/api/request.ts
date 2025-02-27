import { createContext, useContext } from "react";
import Axios from "axios";
import { useRouter } from 'next/navigation';

console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'https://lead.sakane.ma/api');

// Modifier l'URL de base pour éviter la duplication du segment 'api'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lead.sakane.ma';
console.log('Using API URL:', API_URL);

const axios = Axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

axios.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        // Try to get token from cookie first, then localStorage
        const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const localToken = localStorage.getItem("token");
        const token = cookieToken || localToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Ensure both storage methods have the token
            if (!cookieToken && localToken) {
                document.cookie = `token=${localToken}; path=/; secure; samesite=strict`;
            } else if (cookieToken && !localToken) {
                localStorage.setItem("token", cookieToken);
            }
        }
        config.headers["Content-Type"] = "application/json";
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                window.location.replace('/login');
            }
        }
        return Promise.reject(error);
    }
);

export const AxiosContext = createContext(axios);

export function apply() {
    return axios;
}

export function get() {
    return axios;
}

export function useAxios() {
    return useContext(AxiosContext);
}

export default axios;
