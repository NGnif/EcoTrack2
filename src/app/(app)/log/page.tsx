import { ActivityLogger } from "@/components/log/activity-logger";
import { PageHeader } from "@/components/shared/page-header";

export default function LogPage() {
    return (
        <div>
            <PageHeader
                title="Log New Activity"
                description="Add your daily activities to calculate their carbon footprint."
            />
            <ActivityLogger />
        </div>
    );
}