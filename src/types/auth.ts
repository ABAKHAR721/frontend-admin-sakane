export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials extends LoginCredentials {
    name: string;
    phone?: string;
}

export interface AuthResponse {
    data: {
        token?: string;
        user?: {
            id: string;
            email: string;
            name: string;
            credits?: number;
            role?: string;
        };
    } | null;
    status: number;
}
