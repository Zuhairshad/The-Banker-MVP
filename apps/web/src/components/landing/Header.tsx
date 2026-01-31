'use client';

import Link from 'next/link';

/**
 * Navigation header component with glassmorphism
 */
export const Header = () => {
    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl px-8 h-20 flex items-center justify-between shadow-2xl">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white tracking-tighter">Banker Expert</span>
                </Link>

                {/* Center nav removed as requested */}

                <div className="flex items-center gap-6">
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </header>
    );
};
