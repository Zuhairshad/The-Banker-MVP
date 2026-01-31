'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown, Wallet, FileText, ArrowRight, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/data-context';
import { useAuth } from '@/contexts/auth-context';
import { QuickAnalysisForm } from '@/components/dashboard/quick-analysis-form';
import { ConnectWalletCard } from '@/components/dashboard/connect-wallet-card';
import { PortfolioChart } from '@/components/dashboard/portfolio-chart';

export default function DashboardPage() {
    const { stats, wallets, reports, isLoading } = useData();
    const { user, isLoading: isAuthLoading } = useAuth();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (isLoading || isAuthLoading) {
        return (
            <div className="flex items-center justify-center p-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {user?.user_metadata?.['name'] || user?.email?.split('@')[0] || 'Investor'}
                </h1>
                <p className="text-muted-foreground">
                    Here's an overview of your crypto portfolio.
                </p>
            </div>

            {/* Top Section: Connect & Charts */}
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-8">
                    {/* Connect Wallet */}
                    <ConnectWalletCard />

                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                                {stats.totalProfitLoss >= 0 ? (
                                    <TrendingUp className="h-4 w-4 text-success" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-destructive" />
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${stats.totalProfitLoss >= 0 ? 'text-success' : 'text-destructive'
                                    }`}>
                                    {stats.totalProfitLoss >= 0 ? '+' : ''}
                                    {formatCurrency(stats.totalProfitLoss)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Across all wallets
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.activeWallets}</div>
                                <p className="text-xs text-muted-foreground">
                                    Connected wallets
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.reportsGenerated}</div>
                                <p className="text-xs text-muted-foreground">
                                    AI analysis reports
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Portfolio Chart */}
                <PortfolioChart />
            </div>

            {/* Quick Analysis (Fallback) */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Analysis</CardTitle>
                    <CardDescription>
                        Manually enter an address to generate an AI-powered analysis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <QuickAnalysisForm />
                </CardContent>
            </Card>

            {/* Lists Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Connected Wallets */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Connected Wallets</CardTitle>
                            <CardDescription>Your linked wallet addresses</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/wallets">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {(wallets || []).slice(0, 3).map((wallet) => (
                                <div
                                    key={wallet.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${wallet.blockchain === 'bitcoin'
                                            ? 'bg-orange-500/10 text-orange-500'
                                            : 'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {wallet.blockchain === 'bitcoin' ? '₿' : 'Ξ'}
                                        </div>
                                        <div>
                                            <p className="font-medium">{wallet.nickname}</p>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                {(wallet.address || '').slice(0, 8)}...{(wallet.address || '').slice(-6)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency(wallet.balanceUsd)}</p>
                                        {wallet.isPrimary && (
                                            <Badge variant="secondary" className="text-xs">Primary</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Reports */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Reports</CardTitle>
                            <CardDescription>Latest AI analysis results</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/reports">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {(reports || []).slice(0, 3).map((report) => (
                                <Link
                                    key={report.id}
                                    href={`/dashboard/reports/${report.id}`}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${report.blockchain === 'bitcoin'
                                            ? 'bg-orange-500/10 text-orange-500'
                                            : 'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">
                                                {(report.blockchain || '').charAt(0).toUpperCase() + (report.blockchain || '').slice(1)} Analysis
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(report.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-medium ${report.profitLoss >= 0 ? 'text-success' : 'text-destructive'
                                            }`}>
                                            {report.profitLoss >= 0 ? '+' : ''}{report.profitLossPercent.toFixed(2)}%
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
