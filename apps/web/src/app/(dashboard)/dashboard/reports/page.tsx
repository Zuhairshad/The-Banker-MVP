'use client';

import Link from 'next/link';
import { FileText, ArrowRight, Download } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/data-context';

export default function ReportsPage() {
    const { reports } = useData();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                <p className="text-muted-foreground">
                    View your AI-powered wallet analysis reports
                </p>
            </div>

            {/* Reports List */}
            {reports.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="rounded-full bg-muted p-3 mb-4">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold mb-1">No reports yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Generate your first analysis from the dashboard.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {reports.map((report) => (
                        <Card key={report.id} className="hover:border-primary/50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${report.blockchain === 'bitcoin'
                                            ? 'bg-orange-500/10 text-orange-500'
                                            : 'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">
                                                    {report.blockchain.charAt(0).toUpperCase() + report.blockchain.slice(1)} Analysis
                                                </h3>
                                                <Badge variant="secondary">
                                                    {report.blockchain === 'bitcoin' ? 'BTC' : 'ETH'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-mono">
                                                {report.walletAddress.slice(0, 12)}...{report.walletAddress.slice(-8)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Generated on {formatDate(report.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Total Value</p>
                                            <p className="font-semibold">{formatCurrency(report.totalValue)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">P&L</p>
                                            <p className={`font-semibold ${report.profitLoss >= 0 ? 'text-success' : 'text-destructive'
                                                }`}>
                                                {report.profitLoss >= 0 ? '+' : ''}{formatCurrency(report.profitLoss)}
                                                <span className="ml-1 text-xs">
                                                    ({report.profitLoss >= 0 ? '+' : ''}{report.profitLossPercent.toFixed(2)}%)
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button asChild>
                                                <Link href={`/dashboard/reports/${report.id}`}>
                                                    View
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
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
