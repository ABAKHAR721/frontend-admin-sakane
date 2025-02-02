import { createContext, useContext } from "react";
import Axios from "axios";
import { useRouter } from 'next/router';

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

axios.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers["Content-Type"] = "application/json";
        }
    }
    return config;
});

axios.interceptors.response.use(
    (response) => {
        if (response.status <= 299 && response.status >= 200) {
            return response;
        }
        return Promise.reject(new Error(response.statusText || "Error"));
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                if (window.location.pathname !== "/login") {
                    localStorage.clear();
                    const router = useRouter();
                    router.push('/login');
                }
            }
            return Promise.reject(error);
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
