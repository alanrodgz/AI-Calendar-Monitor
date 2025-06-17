import { QueryClient } from '@tanstack/react-query';

export async function apiRequest(method: string, url: string, data?: any) {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey, signal }) => {
        const res = await fetch(queryKey[0] as string, { signal });
        if (!res.ok) {
          if (res.status >= 500) {
            throw new Error(`${res.status}: ${res.statusText}`);
          }
          
          if (res.status === 401) {
            throw new Error("Unauthorized");
          }
          
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        return res.json();
      },
    },
  },
});