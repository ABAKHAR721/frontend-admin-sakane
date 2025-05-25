import { Navigate, RouteObject } from 'react-router-dom';
import AdminLayout from '../components/admin/layout/adminLayout';
import DashboardPage from '../pages/admin/dashboard';
import UsersPage from '../pages/admin/users';
import LeadsPage from '../app/admin/leads/page';
import TransactionsPage from '../pages/admin/transactions';
import StatsPage from '../pages/admin/stats';

// Auth guard component
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  // TODO: Replace with actual auth check using JWT from localStorage
  const isAdmin = localStorage.getItem('role') === 'admin' && localStorage.getItem('token');
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin/dashboard',
    element: (
      <AdminGuard>
        <AdminLayout />
      </adminGuard>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'leads',
        element: <LeadsPage />,
      },
      {
        path: 'transactions',
        element: <TransactionsPage />,
      },
      {
        path: 'stats',
        element: <StatsPage />,
      },
    ],
  },
];
