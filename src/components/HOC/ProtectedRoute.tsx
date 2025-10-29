import routerMeta from '@/lib/routerMeta';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '@/contexts/UserContextProvider';
import { useContext } from 'react';
import LoadingFallback from '@/components/LoadingFallback';

interface IProtectedRoute {
  children: JSX.Element;
  path: string;
}

const ProtectedRoute = ({ children, path }: IProtectedRoute) => {
  const { isLogin, isLoading } = useContext(UserContext);
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return <LoadingFallback />;
  }

  const isProtectedRoute =
    path === routerMeta.NewArticlePage.path ||
    path === routerMeta.EditArticlePage.path ||
    path === routerMeta.SettingPage.path ||
    path === routerMeta.ArticlePage.path ||
    path.includes('/revisions');

  // Redirect to login if trying to access protected route while not logged in
  if (!isLogin && isProtectedRoute) {
    return <Navigate to={routerMeta.SignInPage.path} replace={true} state={{ from: location }} />;
  }

  // Redirect to home if trying to access auth pages while logged in
  if (isLogin && (path === routerMeta.SignUpPage.path || path === routerMeta.SignInPage.path)) {
    return <Navigate to={routerMeta.HomePage.path} replace={true} />;
  }

  return children;
};
export default ProtectedRoute;
