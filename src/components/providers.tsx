"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HospitalProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 60, // 1 小時後視為陳舊
                        gcTime: 1000 * 60 * 60 * 24, // 24 小時垃圾回收
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <HospitalProvider>
                {children}
            </HospitalProvider>
        </QueryClientProvider>
    );
}
