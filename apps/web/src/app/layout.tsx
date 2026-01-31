import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { DataProvider } from '@/contexts/data-context';
import { SeedDataProvider } from '@/contexts/seed-data';

import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'Banker Expert - AI-Powered Crypto Wallet Analysis',
    description: 'Connect your Bitcoin and Ethereum wallets to get personalized AI insights, profit/loss analysis, and intelligent recommendations tailored to your investment style.',
    keywords: ['crypto', 'wallet', 'analysis', 'blockchain', 'AI', 'bitcoin', 'ethereum', 'investment'],
    openGraph: {
        title: 'Banker Expert - AI-Powered Crypto Wallet Analysis',
        description: 'Get personalized AI insights for your crypto portfolio',
        type: 'website',
    },
};

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <DataProvider>
                            <SeedDataProvider>
                                {children}
                            </SeedDataProvider>
                        </DataProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
