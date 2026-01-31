'use client';

import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSeedData } from '@/contexts/seed-data';

interface ReportDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function ReportDetailPage({ params }: ReportDetailPageProps) {
    const { id } = use(params);
    const { reports } = useSeedData();

    const report = reports.find((r) => r.id === id);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!report) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/reports">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Report Not Found</h1>
                </div>
                <Card>
                    <CardContent className="py-16 text-center">
                        <p className="text-muted-foreground">
                            The report you're looking for doesn't exist.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/dashboard/reports">Back to Reports</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/reports">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {report.blockchain.charAt(0).toUpperCase() + report.blockchain.slice(1)} Analysis
                            </h1>
                            <Badge variant="secondary">
                                {report.blockchain === 'bitcoin' ? 'BTC' : 'ETH'}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">
                            Generated on {formatDate(report.createdAt)}
                        </p>
                    </div>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                </Button>
            </div>

            {/* Wallet Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Wallet Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <code className="px-4 py-2 rounded-lg bg-muted text-sm font-mono block overflow-x-auto">
                        {report.walletAddress}
                    </code>
                </CardContent>
            </Card>

            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(report.totalValue)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
                        {report.profitLoss >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${report.profitLoss >= 0 ? 'text-success' : 'text-destructive'
                            }`}>
                            {report.profitLoss >= 0 ? '+' : ''}{formatCurrency(report.profitLoss)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {report.profitLoss >= 0 ? '+' : ''}{report.profitLossPercent.toFixed(2)}% change
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Performance</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report.profitLossPercent >= 0 ? 'Positive' : 'Negative'}
                        </div>
                        <p className="text-xs text-muted-foreground">30-day trend</p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Insights */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <svg
                            className="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                        </svg>
                        AI Insights
                    </CardTitle>
                    <CardDescription>
                        Powered by Google Gemini AI
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{report.aiInsights}</ReactMarkdown>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
