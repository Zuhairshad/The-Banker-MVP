import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    eslint: {
        // Lint runs in CI separately; do not block production builds on style errors
        ignoreDuringBuilds: true,
    },
    poweredByHeader: false,
    experimental: {
        typedRoutes: true,
    },
    transpilePackages: ['@banker-expert/shared'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.coingecko.com',
                pathname: '/coins/images/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
