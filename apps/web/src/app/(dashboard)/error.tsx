'use client';

import { useEffect } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Dashboard Error:', error);
    }, [error]);

    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="text-xl">Something went wrong</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        We encountered an error while loading the dashboard.
                    </p>
                    <div className="rounded-md bg-black/40 p-4 font-mono text-xs text-left mb-4 overflow-auto max-h-32">
                        {error.message || 'Unknown error occurred'}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button
                        variant="default"
                        onClick={reset}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/')}
                        className="gap-2"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
