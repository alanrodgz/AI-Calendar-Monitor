"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
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
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}