import { Card, CardContent } from '@/components/ui/card';

const steps = [
    {
        number: '01',
        title: 'Create Your Profile',
        description: 'Sign up and set your investment preferences including risk tolerance and experience level.',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        number: '02',
        title: 'Connect Your Wallets',
        description: 'Add your Bitcoin and Ethereum wallet addresses. We only need public addresses - never private keys.',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
        ),
    },
    {
        number: '03',
        title: 'Get AI Analysis',
        description: 'Our AI analyzes your transactions, calculates profit/loss, and generates personalized insights.',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
    },
    {
        number: '04',
        title: 'Take Action',
        description: 'Use actionable recommendations to optimize your portfolio based on your investment style.',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
    },
];

/**
 * How it works section with step-by-step process
 */
export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Get started in minutes with our simple onboarding process.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-14 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                            )}

                            <Card className="relative bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                                <CardContent className="p-6 text-center">
                                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        {step.icon}
                                    </div>
                                    <div className="absolute -top-3 right-4 text-5xl font-bold text-primary/10">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground text-sm">{step.description}</p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
