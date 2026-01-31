'use client';

import { useEffect } from 'react';

import { logger } from '@/lib/logger';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

const ErrorBoundary = ({ error, reset }: ErrorProps) => {
    useEffect(() => {
        logger.error('Application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h2 className="text-2xl font-bold text-destructive">Something went wrong!</h2>
            <p className="mt-4 text-muted-foreground">
                {error.message || 'An unexpected error occurred'}
            </p>
            <button
                type="button"
                onClick={reset}
                className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
                Try again
            </button>
        </div>
    );
};

export default ErrorBoundary;
