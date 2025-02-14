import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

type RenderRouterProps = {
  children: React.ReactNode;
};

export default function RenderRouter({ children }: RenderRouterProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Don't redirect while loading

    // Liste des routes publiques
    const publicRoutes = ['/login', '/register'];
    // Liste des routes privées
    const privateRoutes = ['/dashboard', '/leads', '/my-leads', '/credits', '/requests'];

    const currentPath = router.pathname;

    const handleNavigation = async () => {
      // Redirection pour les routes publiques
      if (publicRoutes.includes(currentPath)) {
        if (isAuthenticated) {
          await router.push('/dashboard');
        }
      }
      // Redirection pour les routes privées
      else if (privateRoutes.includes(currentPath)) {
        if (!isAuthenticated) {
          await router.push('/login');
        }
      }
      // Redirection par défaut
      else if (currentPath === '/') {
        await router.push(isAuthenticated ? '/dashboard' : '/login');
      }
    };

    handleNavigation();
  }, [isAuthenticated, loading, router.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
