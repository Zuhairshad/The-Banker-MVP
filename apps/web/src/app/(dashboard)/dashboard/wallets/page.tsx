'use client';

import { useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/data-context';
import { api } from '@/lib/api-client'; // Import API for connectMetaMask logic
import { Loader2 } from 'lucide-react'; // Import Loader2

export default function WalletsPage() {
    const { wallets, addWallet, removeWallet, generateAnalysis, refreshData } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false); // State for MetaMask loading
    const [newWallet, setNewWallet] = useState({
        address: '',
        blockchain: 'ethereum' as 'bitcoin' | 'ethereum',
        nickname: '',
    });

    // MetaMask connection logic reused
    const connectMetaMask = async () => {
        setIsConnecting(true);
        try {
            if (typeof window === 'undefined' || !(window as any).ethereum) {
                alert('MetaMask is not installed. Please install it to connect.'); // Simple alert for now
                return;
            }

            const accounts = await (window as any).ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found.');
            }

            const address = accounts[0];

            // Connect via API
            try {
                await api.connectWallet(address, 'ethereum', 'MetaMask Wallet');
            } catch (err: any) {
                // Ignore "already connected" error
                if (err.message && (err.message.includes('already connected') || err.message.includes('409'))) {
                    console.log('Wallet already connected, refreshing data...');
                } else {
                    throw err;
                }
            }

            // Generate Analysis
            try {
                await generateAnalysis(address, 'ethereum');
            } catch (e) { console.log('Analysis gen failed', e); }

            await refreshData();
            setIsOpen(false);

        } catch (err: any) {
            console.error('MetaMask connection error:', err);

            const errorMessage = err?.message || (typeof err === 'string' ? err : 'Failed to connect MetaMask');

            // Handle "Wallet already connected" as a soft success
            if (errorMessage.includes('already connected') || errorMessage.includes('409')) {
                console.log('Wallet already connected, refreshing data...');
                // Still try to refresh data and regenerate analysis
                try {
                    // Since we don't have the address in this scope if it failed early, we rely on refreshData
                    // But if we do (from the let above), use it.
                    // The previous code didn't hoist address, let's fix that too by just refreshing data.
                } catch (e) { console.log('Analysis refresh failed', e); }

                await refreshData();
                setIsOpen(false);
                return;
            }

            alert(errorMessage);
        } finally {
            setIsConnecting(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value || 0);
    };

    const handleAddWallet = async () => { // Make async
        if (!newWallet.address || !newWallet.nickname) return;

        try {
            console.log('Adding wallet:', newWallet);
            await addWallet(newWallet.address, newWallet.blockchain, newWallet.nickname);
            console.log('Wallet added, generating analysis...');
            await generateAnalysis(newWallet.address, newWallet.blockchain);
            console.log('Analysis generated.');

            setNewWallet({ address: '', blockchain: 'ethereum', nickname: '' });
            setIsOpen(false);
        } catch (e) {
            console.error('Manual add wallet error:', e);
            alert('Failed to add wallet: ' + (e as Error).message);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Wallets</h1>
                    <p className="text-muted-foreground">
                        Manage your connected cryptocurrency wallets
                    </p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Connect Wallet
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Connect New Wallet</DialogTitle>
                            <DialogDescription>
                                Add a wallet address to track and analyze its performance.
                            </DialogDescription>
                        </DialogHeader>

                        {/* MetaMask Option */}
                        <div className="mb-4 pt-2">
                            <Button
                                onClick={connectMetaMask}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                disabled={isConnecting}
                            >
                                {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M21.7059 13.9706C21.7059 13.9706 20.2647 12.8235 20.2647 10.9706C20.2647 9.11762 21.7059 7.97056 21.7059 7.97056C21.7059 7.97056 18.0588 7.3235 15.6765 9.08821C15.9118 7.02938 14.8824 5.35291 13.0882 4.02939C14.7353 3.64703 16.3235 4.14703 17.5 5.02939L17.1176 1.49997L13.0882 2.61762L11 0.499971L8.91176 2.61762L4.85294 1.49997L4.5 5.02939C5.64706 4.14703 7.23529 3.64703 8.91176 4.02939C7.11765 5.35291 6.08824 7.02938 6.32353 9.08821C3.91176 7.3235 0.294118 7.97056 0.294118 7.97056 1.70588 9.11762 1.70588 10.9706C1.70588 12.8235 0.294118 13.9706 0.294118 13.9706C0.294118 13.9706 4.38235 14.6176 7 12.6764C5.79412 16.2941 7.41176 18.5294 11 19.9999C11 19.9999 9.85294 23.4999 11 23.4999C12.1471 23.4999 11 19.9999 11 19.9999C14.5882 18.5294 16.2059 16.2941 15 12.6764C17.6176 14.6176 21.7059 13.9706 21.7059 13.9706Z" /></svg>
                                }
                                Connect with MetaMask
                            </Button>
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or connect manually</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Blockchain</Label>
                                <div className="flex rounded-lg border p-1">
                                    <button
                                        type="button"
                                        onClick={() => setNewWallet({ ...newWallet, blockchain: 'ethereum' })}
                                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${newWallet.blockchain === 'ethereum'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        Ethereum
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewWallet({ ...newWallet, blockchain: 'bitcoin' })}
                                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${newWallet.blockchain === 'bitcoin'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        Bitcoin
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nickname">Nickname</Label>
                                <Input
                                    id="nickname"
                                    placeholder="My Main Wallet"
                                    value={newWallet.nickname}
                                    onChange={(e) => setNewWallet({ ...newWallet, nickname: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Wallet Address</Label>
                                <Input
                                    id="address"
                                    placeholder={newWallet.blockchain === 'ethereum' ? '0x...' : 'bc1...'}
                                    value={newWallet.address}
                                    onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddWallet}>
                                Connect Wallet
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Wallets Grid */}
            {wallets.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="rounded-full bg-muted p-3 mb-4">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold mb-1">No wallets connected</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Connect your first wallet to start tracking your portfolio.
                        </p>
                        <Button onClick={() => setIsOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Connect Wallet
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {wallets.map((wallet) => (
                        <Card key={wallet.id} className="relative group">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg ${wallet.blockchain === 'bitcoin'
                                            ? 'bg-orange-500/10 text-orange-500'
                                            : 'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {wallet.blockchain === 'bitcoin' ? '₿' : 'Ξ'}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                {wallet.nickname}
                                                {wallet.isPrimary && (
                                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                )}
                                            </CardTitle>
                                            <CardDescription className="font-mono text-xs">
                                                {(wallet.address || '').slice(0, 10)}...{(wallet.address || '').slice(-6)}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeWallet(wallet.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Balance</span>
                                        <span className="font-medium">{formatCurrency(wallet.balanceUsd)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Crypto</span>
                                        <span className="font-medium">
                                            {wallet.balance} {wallet.blockchain === 'bitcoin' ? 'BTC' : 'ETH'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Last Sync</span>
                                        <span className="text-sm">{formatDate(wallet.lastSync)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
