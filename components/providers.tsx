/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState } from "react"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "./Theme-provider"
import { Toaster } from "sonner"
import { AuthProvider } from "../hooks/use-auth"

/**
 * Providers component that wraps the application with necessary providers:
 * - SessionProvider: For next-auth session management
 * - AuthProvider: For custom authentication
 * - QueryClientProvider: For React Query data fetching
 * - ThemeProvider: For theme management
 * - Sonner Toaster: For toast notifications
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (
                error instanceof Error &&
                "status" in error &&
                [401, 403, 404].includes((error as any).status)
              ) {
                return false
              }
              return failureCount < 2
            },
          },
        },
      }),
  )

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster position="bottom-right" richColors />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
