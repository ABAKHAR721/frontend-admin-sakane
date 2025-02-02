import axios from "./request";
import { LoginCredentials, SignupCredentials, AuthResponse } from "../../types/auth";

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const { data, status } = await axios.post("/auth/login", credentials);
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        return { data, status };
    } catch (error) {
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
    localStorage.removeItem("token");
    window.location.href = "/login";
};
