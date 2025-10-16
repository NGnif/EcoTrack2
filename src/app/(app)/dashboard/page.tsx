'use client'

import { PageHeader } from "@/components/shared/page-header";
import { useAuth } from "@/lib/auth";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div>
            <PageHeader 
                title={`Welcome, ${user?.displayName || user?.email?.split('@')[0] || 'User'}!`}
                description="Here's a summary of your carbon footprint. Keep up the great work!"
            />
            <div className="space-y-6">
                <StatsCards />
                <WeeklyChart />
            </div>
        </div>
    );
}