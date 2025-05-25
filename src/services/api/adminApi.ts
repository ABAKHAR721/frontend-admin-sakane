import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lead.sakane.ma/api';

const adminApi = axios.create({
  baseURL: `${API_URL}/api/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ Request Interceptor: Add token from localStorage or cookies
adminApi.interceptors.request.use((config) => {
  const localToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const cookieToken = typeof document !== 'undefined'
    ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
    : null;

  const token = localToken || cookieToken;

  if (token) {
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    console.log('[adminApi] Using token:', token);
  } else {
    console.warn('[adminApi] No auth token found');
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return config;
}, (error) => {
  console.error('[adminApi] Request interceptor error:', error);
  return Promise.reject(error);
});

// ✅ Response Interceptor: Handle 401 Unauthorized
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[adminApi] Unauthorized - clearing token and redirecting');
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==== API Methods ====

// Users
export const getUsers = (params: any) => adminApi.get('/users', { params });
export const getUserDetails = (id: number) => adminApi.get(`/users/${id}`);
export const updateUser = (id: number, data: any) => adminApi.put(`/users/${id}`, data);
export const deleteUser = (id: number) => adminApi.delete(`/users/${id}`);
// ✅ Users API (create, update, delete)
export const createUser = (data: any) => adminApi.post('/users', data);


// ADD THESE BELOW your current functions


// Leads
export const getLeads = (params: any) => adminApi.get('/leads', { params });
export const getAllLeadsWithPurchaseInfo = (params: { page: number; limit: number; search: string; status: string; buyer: string; }) => {
  return adminApi.get('/leads', { params: params });
};

// Transactions
export const getTransactions = (params: any) => adminApi.get('/transactions', { params });

// Statistics
export const getStatistics = (params: any) => adminApi.get('/stats', { params });

// Dashboard
export const getDashboardToday = () => adminApi.get('/dashboard/today');
export const getDashboardGraph = (params: any) => adminApi.get('/dashboard/graph', { params });

// Users Balance
export const updateUserBalance = (id: number, balance: number) => adminApi.put(`/balance/${id}`, { balance });


// Audit Logs
export const getAuditLogs = () => adminApi.get('/audit-logs');
export default adminApi;
