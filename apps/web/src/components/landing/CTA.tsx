import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Call-to-action section
 */
export const CTA = () => {
    return (
        <section className="py-24 bg-gradient-to-br from-brand-600 via-brand-500 to-cyan-500 relative overflow-hidden">
            {/* Background decoration */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="container relative z-10">
                <div className="max-w-3xl mx-auto text-center text-white">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                        Ready to Understand Your Crypto Better?
                    </h2>
                    <p className="text-xl text-white/80 mb-10">
                        Join thousands of investors who use Banker Expert to make smarter decisions.
                        Start your free analysis today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="text-lg px-8 h-12 bg-white text-brand-600 hover:bg-white/90"
                            asChild
                        >
                            <Link href="/register">
                                Get Started Free
                                <svg
                                    className="ml-2 h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 h-12 border-white/30 text-white hover:bg-white/10"
                            asChild
                        >
                            <Link href="#features">Learn More</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
