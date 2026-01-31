'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/data-context';

export function PortfolioChart() {
    const { wallets } = useData();

    const data = useMemo(() => {
        if (!wallets || !wallets.length) return [];

        const ethBalance = wallets
            .filter(w => w.blockchain === 'ethereum')
            .reduce((sum, w) => sum + w.balanceUsd, 0);

        const btcBalance = wallets
            .filter(w => w.blockchain === 'bitcoin')
            .reduce((sum, w) => sum + w.balanceUsd, 0);

        return [
            { name: 'Ethereum', value: ethBalance },
            { name: 'Bitcoin', value: btcBalance },
        ].filter(d => d.value > 0);
    }, [wallets]);

    const COLORS = ['#627EEA', '#F7931A']; // ETH Blue, BTC Orange

    if (data.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                    <CardDescription>Connect wallets to see your portfolio breakdown</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[250px] items-center justify-center">
                    <p className="text-muted-foreground text-sm">No data available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Distribution across blockchains</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.1)" />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString()}`, 'Value']}
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                itemStyle={{ color: '#f3f4f6' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
