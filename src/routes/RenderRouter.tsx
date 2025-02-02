import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

type RenderRouterProps = {
  children: React.ReactNode;
};

export default function RenderRouter({ children }: RenderRouterProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Liste des routes publiques
    const publicRoutes = ['/login', '/register'];
    // Liste des routes privées
    const privateRoutes = ['/dashboard', '/leads', '/my-leads', '/credits', '/requests'];

    const currentPath = router.pathname;

    // Redirection pour les routes publiques
    if (publicRoutes.includes(currentPath)) {
      if (isAuthenticated) {
        router.push('/dashboard');
      }
    }
    // Redirection pour les routes privées
    else if (privateRoutes.includes(currentPath)) {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }
    // Redirection par défaut
    else if (currentPath === '/') {
      router.push(isAuthenticated ? '/dashboard' : '/login');
    }
  }, [isAuthenticated, router.pathname]);

  return <>{children}</>;
}
