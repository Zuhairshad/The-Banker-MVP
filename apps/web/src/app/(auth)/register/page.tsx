'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { api } from '@/lib/api-client';

const accountSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type AccountFormData = z.infer<typeof accountSchema>;

const preferenceQuestions = [
    { key: 'riskAversion', label: 'Risk Aversion', description: 'How much do you avoid financial risk?' },
    { key: 'volatilityTolerance', label: 'Volatility Tolerance', description: 'How comfortable are you with price swings?' },
    { key: 'growthFocus', label: 'Growth Focus', description: 'How important is growth vs. stability?' },
    { key: 'cryptoExperience', label: 'Crypto Experience', description: 'How experienced are you with cryptocurrency?' },
    { key: 'innovationTrust', label: 'Innovation Trust', description: 'How much do you trust new technologies?' },
    { key: 'impactInterest', label: 'Impact Interest', description: 'How important is sustainable investing?' },
    { key: 'diversification', label: 'Diversification', description: 'How much do you value portfolio diversity?' },
    { key: 'holdingPatience', label: 'Holding Patience', description: 'How long are you willing to hold investments?' },
    { key: 'monitoringFrequency', label: 'Monitoring Frequency', description: 'How often do you check your portfolio?' },
    { key: 'adviceOpenness', label: 'Advice Openness', description: 'How open are you to investment recommendations?' },
] as const;

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [accountData, setAccountData] = useState<AccountFormData | null>(null);
    const [preferences, setPreferences] = useState<Record<string, number>>(
        Object.fromEntries(preferenceQuestions.map((q) => [q.key, 5]))
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
    });

    const onAccountSubmit = (data: AccountFormData) => {
        setAccountData(data);
        setStep(2);
    };

    const handlePreferenceChange = (key: string, value: number[]) => {
        const newValue = value[0];
        if (newValue !== undefined) {
            setPreferences((prev) => ({ ...prev, [key]: newValue }));
        }
    };

    const handleComplete = async () => {
        if (!accountData) {
            console.error('No account data available for registration');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Attempting registration for:', accountData.email);

            // Strictly typed payload
            const registrationPayload = {
                riskAversion: preferences['riskAversion'] || 5,
                volatilityTolerance: preferences['volatilityTolerance'] || 5,
                growthFocus: preferences['growthFocus'] || 5,
                cryptoExperience: preferences['cryptoExperience'] || 5,
                innovationTrust: preferences['innovationTrust'] || 5,
                impactInterest: preferences['impactInterest'] || 5,
                diversification: preferences['diversification'] || 5,
                holdingPatience: preferences['holdingPatience'] || 5,
                monitoringFrequency: preferences['monitoringFrequency'] || 5,
                adviceOpenness: preferences['adviceOpenness'] || 5,
            };

            await api.register(
                accountData.email,
                accountData.password,
                accountData.name,
                registrationPayload as any
            );

            console.log('Registration successful, redirecting...');
            router.push('/login?registered=true');
        } catch (err: any) {
            // Prevent [object Event] by extracting the message or error object properly
            const errorMessage = err instanceof Error ? err.message : (typeof err === 'object' ? JSON.stringify(err) : String(err));
            console.error('Registration failed:', errorMessage);
            // You might want to set an error state here to show to the user
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                        1
                    </div>
                    <div className={`h-1 w-16 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                        2
                    </div>
                </div>
                <span className="text-sm text-muted-foreground">
                    Step {step} of 2
                </span>
            </div>

            {step === 1 && (
                <>
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                        <p className="text-muted-foreground">
                            Enter your details to get started
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onAccountSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                autoComplete="name"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Continue
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Investment Profile</h1>
                        <p className="text-muted-foreground">
                            Help us understand your investment preferences
                        </p>
                    </div>

                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                        {preferenceQuestions.map((question) => (
                            <div key={question.key} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>{question.label}</Label>
                                        <p className="text-xs text-muted-foreground">
                                            {question.description}
                                        </p>
                                    </div>
                                    <span className="text-sm font-medium">
                                        {preferences[question.key]}/10
                                    </span>
                                </div>
                                <Slider
                                    value={[preferences[question.key] ?? 5]}
                                    onValueChange={(value) => handlePreferenceChange(question.key, value)}
                                    min={1}
                                    max={10}
                                    step={1}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setStep(1)}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <Button
                            type="button"
                            className="flex-1"
                            onClick={handleComplete}
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Complete Setup
                        </Button>
                    </div>
                </>
            )}

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
