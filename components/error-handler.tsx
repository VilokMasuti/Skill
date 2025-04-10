/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerProps {
  children: React.ReactNode;
}

export function ErrorHandler({ children }: ErrorHandlerProps) {
  const queryClient = useQueryClient();

  // Global error handler for unhandled errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      toast.error('An unexpected error occurred. Please try again later.');

      // Optionally report to an error tracking service like Sentry
      // reportErrorToService(event.error)
    };

    // Handle unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      toast.error('An unexpected error occurred. Please try again later.');

      // Optionally report to an error tracking service
      // reportErrorToService(event.reason)
    };

    // Handle React Query errors
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query && event.query.state?.error) {
        const error = event.query.state.error;
        console.error('React Query error:', error);

        // Only show toast if it's not already handled by the component
        if (!(error as any).handled) {
          toast.error('Failed to fetch data. Please try again later.');
        }
      }
    });

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      unsubscribe();
    };
  }, [queryClient]);

  return <>{children}</>;
}
