import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import AdminLayout from '../components/admin/layout/AdminLayout';
import DashboardPage from '../app/admin/dashboard/page';
import UsersPage from '../app/admin/users/page';
import LeadsPage from '../app/admin/leads/page';
import TransactionsPage from '../app/admin/transactions/page';
import StatsPage from '../app/admin/stats/page';

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
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </AdminGuard>
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
