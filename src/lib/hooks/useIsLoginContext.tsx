import { ACCESS_TOKEN_KEY } from '@/constants/token.contant';
import token from '@/lib/token';
import { useEffect, useState, useCallback } from 'react';
import queryClient from '@/queries/queryClient';

const useIsLoginContext = () => {
  const [isLogin, setIsLogin] = useState(() => token.isValidToken());
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = useCallback(() => {
    const isValid = token.isValidToken();
    setIsLogin(isValid);
    setIsLoading(false);

    if (!isValid && token.getToken(ACCESS_TOKEN_KEY)) {
      // If we have an invalid token, clean it up
      token.removeToken(ACCESS_TOKEN_KEY);
      // Clear all queries when auth state changes
      queryClient.clear();
    }
  }, []);

  // Function to handle login
  const login = useCallback(
    (newToken: string) => {
      token.setToken(ACCESS_TOKEN_KEY, newToken);
      checkToken();
    },
    [checkToken],
  );

  // Function to handle logout
  const logout = useCallback(() => {
    token.removeToken(ACCESS_TOKEN_KEY);
    checkToken();
    queryClient.clear();
  }, [checkToken]);

  useEffect(() => {
    // Check on mount
    checkToken();

    // Listen for storage events (token changes)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ACCESS_TOKEN_KEY) {
        checkToken();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [checkToken]);

  return {
    isLogin,
    setIsLogin: login,
    logout,
    isLoading,
  };
};

export default useIsLoginContext;
