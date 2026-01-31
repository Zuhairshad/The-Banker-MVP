'use client';

import { useState } from 'react';
import { Wallet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useData } from '@/contexts/data-context';
import { api } from '@/lib/api-client';

export function ConnectWalletCard() {
    const { } = useAuth();
    const { generateAnalysis, refreshData } = useData();
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const connectMetaMask = async () => {
        setIsConnecting(true);
        setError(null);
        setSuccess(false);

        let address = '';
        let accounts: string[] = [];

        try {
            if (typeof window === 'undefined' || !(window as any).ethereum) {
                throw new Error('MetaMask is not installed. Please install it to connect.');
            }

            accounts = await (window as any).ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found.');
            }

            address = accounts[0];

            // Send to backend
            await api.connectWallet(address, 'ethereum', 'MetaMask Wallet');

            // Generate initial analysis
            try {
                // Generate report immediately after connection
                await generateAnalysis(address, 'ethereum');
            } catch (analysisErr) {
                console.error('Initial analysis generation failed:', analysisErr);
                // We don't block success if analysis fails, but we log it
            }

            setSuccess(true);

            // Refresh dashboard data
            await refreshData();

        } catch (err: any) {
            console.error('MetaMask connection error:', err);

            // Handle "Wallet already connected" as a soft success
            if (err.message && (err.message.includes('already connected') || err.message.includes('409'))) {
                setSuccess(true);
                // Still try to refresh data and regenerate analysis
                try {
                    if (address) {
                        await generateAnalysis(address, 'ethereum');
                    }
                } catch (e) { console.log('Analysis refresh failed', e); }
                await refreshData();
                return;
            }

            setError(err.message || 'Failed to connect MetaMask');
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    Connect Wallet
                </CardTitle>
                <CardDescription>
                    Link your MetaMask wallet to get instant AI analysis of your assets.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21.7059 13.9706C21.7059 13.9706 20.2647 12.8235 20.2647 10.9706C20.2647 9.11762 21.7059 7.97056 21.7059 7.97056C21.7059 7.97056 18.0588 7.3235 15.6765 9.08821C15.9118 7.02938 14.8824 5.35291 13.0882 4.02939C14.7353 3.64703 16.3235 4.14703 17.5 5.02939L17.1176 1.49997L13.0882 2.61762L11 0.499971L8.91176 2.61762L4.85294 1.49997L4.5 5.02939C5.64706 4.14703 7.23529 3.64703 8.91176 4.02939C7.11765 5.35291 6.08824 7.02938 6.32353 9.08821C3.91176 7.3235 0.294118 7.97056 0.294118 7.97056 1.70588 9.11762 1.70588 10.9706C1.70588 12.8235 0.294118 13.9706 0.294118 13.9706C0.294118 13.9706 4.38235 14.6176 7 12.6764C5.79412 16.2941 7.41176 18.5294 11 19.9999C11 19.9999 9.85294 23.4999 11 23.4999C12.1471 23.4999 11 19.9999 11 19.9999C14.5882 18.5294 16.2059 16.2941 15 12.6764C17.6176 14.6176 21.7059 13.9706 21.7059 13.9706Z" fill="#E2761B" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">MetaMask</p>
                                    <p className="text-sm text-muted-foreground">Browser Extension</p>
                                </div>
                            </div>
                            <Button
                                onClick={connectMetaMask}
                                disabled={isConnecting || success}
                                variant={success ? "outline" : "default"}
                                className={success ? "border-success text-success hover:text-success" : ""}
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Connecting...
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Connected
                                    </>
                                ) : (
                                    'Connect'
                                )}
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
