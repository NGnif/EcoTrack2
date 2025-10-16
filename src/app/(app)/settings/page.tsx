'use client';

import { PageHeader } from "@/components/shared/page-header";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { seedActivities } from "@/lib/firestore-service";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/login');
            toast({
                title: 'Signed Out',
                description: 'You have been successfully signed out.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Sign Out Failed',
                description: 'An error occurred while signing out.',
            });
        }
    };

    const handleSeedData = async () => {
        if (!user) return;
        setIsSeeding(true);
        toast({
            title: 'Seeding Data...',
            description: 'Please wait while we populate the database.',
        });
        
        await seedActivities(user.uid);

        toast({
            title: 'Seeding Complete!',
            description: 'Sample activity data has been added. Refreshing page...',
        });

        // Refresh the page to show new data on dashboard/history
        router.refresh();
        setIsSeeding(false);
    }

    return (
        <div>
            <PageHeader
                title="Settings"
                description="Manage your account and preferences."
            />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>This is your profile information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={user?.displayName || ''} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={user?.email || ''} disabled />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button variant="destructive" onClick={handleSignOut}>Log Out</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Developer</CardTitle>
                        <CardDescription>Actions for development and testing.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Populate your database with sample activity data to see how the dashboard, history, and tips pages look.
                        </p>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button onClick={handleSeedData} disabled={isSeeding}>
                            {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Seed Sample Data
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
