'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function QuickAnalysisForm() {
    const router = useRouter();
    const [address, setAddress] = useState('');
    const [blockchain, setBlockchain] = useState<'bitcoin' | 'ethereum'>('ethereum');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.trim()) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push(`/dashboard/reports/new?address=${encodeURIComponent(address)}&blockchain=${blockchain}`);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
                <div className="space-y-2">
                    <Label htmlFor="wallet-address">Wallet Address</Label>
                    <Input
                        id="wallet-address"
                        placeholder="Enter Bitcoin or Ethereum address..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Blockchain</Label>
                    <div className="flex rounded-lg border p-1">
                        <button
                            type="button"
                            onClick={() => setBlockchain('ethereum')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${blockchain === 'ethereum'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Ethereum
                        </button>
                        <button
                            type="button"
                            onClick={() => setBlockchain('bitcoin')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${blockchain === 'bitcoin'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Bitcoin
                        </button>
                    </div>
                </div>

                <div className="flex items-end">
                    <Button type="submit" disabled={isLoading || !address.trim()}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Analyze
                    </Button>
                </div>
            </div>
        </form>
    );
}
