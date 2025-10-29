import { QueryClient } from '@tanstack/react-query';
import token from '@/lib/token';
import { ACCESS_TOKEN_KEY } from '@/constants/token.contant';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          // Clear token on auth errors
          token.removeToken(ACCESS_TOKEN_KEY);
          window.dispatchEvent(new Event('storage')); // Trigger auth check
          return false;
        }
        // Retry other errors up to 3 times
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    },
  },
});

export default queryClient;
