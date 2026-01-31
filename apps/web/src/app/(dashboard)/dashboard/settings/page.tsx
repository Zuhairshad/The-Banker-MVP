'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, AlertTriangle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useSeedData } from '@/contexts/seed-data';

const preferenceLabels: Record<string, { label: string; description: string }> = {
    riskAversion: { label: 'Risk Aversion', description: 'How much do you avoid financial risk?' },
    volatilityTolerance: { label: 'Volatility Tolerance', description: 'How comfortable are you with price swings?' },
    growthFocus: { label: 'Growth Focus', description: 'How important is growth vs. stability?' },
    cryptoExperience: { label: 'Crypto Experience', description: 'How experienced are you with cryptocurrency?' },
    innovationTrust: { label: 'Innovation Trust', description: 'How much do you trust new technologies?' },
    impactInterest: { label: 'Impact Interest', description: 'How important is sustainable investing?' },
    diversification: { label: 'Diversification', description: 'How much do you value portfolio diversity?' },
    holdingPatience: { label: 'Holding Patience', description: 'How long are you willing to hold investments?' },
    monitoringFrequency: { label: 'Monitoring Frequency', description: 'How often do you check your portfolio?' },
    adviceOpenness: { label: 'Advice Openness', description: 'How open are you to investment recommendations?' },
};

export default function SettingsPage() {
    const router = useRouter();
    const { user, preferences, updatePreferences, logout } = useSeedData();
    const [localPrefs, setLocalPrefs] = useState(preferences);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handlePreferenceChange = (key: string, value: number[]) => {
        const newPrefs = { ...localPrefs, [key]: value[0] };
        setLocalPrefs(newPrefs);
        // Auto-save on change
        updatePreferences({ [key]: value[0] });
    };

    const handleSaveAccount = async () => {
        setIsSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsSaving(false);
    };

    const handleDeleteAccount = async () => {
        logout();
        router.push('/');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account and investment preferences
                </p>
            </div>

            <Tabs defaultValue="preferences" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="preferences">Investment Preferences</TabsTrigger>
                    <TabsTrigger value="account">Account Settings</TabsTrigger>
                    <TabsTrigger value="danger">Danger Zone</TabsTrigger>
                </TabsList>

                {/* Investment Preferences Tab */}
                <TabsContent value="preferences" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Investment Profile</CardTitle>
                            <CardDescription>
                                Adjust your preferences to personalize AI recommendations. Changes are saved automatically.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {Object.entries(preferenceLabels).map(([key, { label, description }]) => (
                                <div key={key} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>{label}</Label>
                                            <p className="text-xs text-muted-foreground">{description}</p>
                                        </div>
                                        <span className="text-sm font-medium tabular-nums">
                                            {localPrefs[key as keyof typeof localPrefs]}/10
                                        </span>
                                    </div>
                                    <Slider
                                        value={[localPrefs[key as keyof typeof localPrefs]]}
                                        onValueChange={(value) => handlePreferenceChange(key, value)}
                                        min={1}
                                        max={10}
                                        step={1}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Account Settings Tab */}
                <TabsContent value="account" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={user?.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={user?.email} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveAccount} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Update Password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Danger Zone Tab */}
                <TabsContent value="danger" className="space-y-6">
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="text-destructive flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Danger Zone
                            </CardTitle>
                            <CardDescription>
                                Irreversible actions that affect your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                                <div>
                                    <h4 className="font-medium">Delete Account</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently delete your account and all associated data
                                    </p>
                                </div>
                                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive">Delete Account</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete your
                                                account, all connected wallets, and all generated reports.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button variant="destructive" onClick={handleDeleteAccount}>
                                                Yes, delete my account
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
