import type { Metadata } from 'next';
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials';

export const metadata: Metadata = {
    title: 'Sign In - Banker Expert',
    description: 'Sign in to your Banker Expert account',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-black">
            {/* Left panel - Testimonials */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
                <div className="absolute inset-0 z-0">
                    <StaggerTestimonials />
                </div>

            </div>

            {/* Right panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Subtle background glow for consistency */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
