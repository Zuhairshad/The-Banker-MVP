import type { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/sidebar';

export const metadata: Metadata = {
    title: 'Dashboard - Banker Expert',
    description: 'Manage your crypto portfolio with AI-powered insights',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <div className="container py-8 lg:py-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
