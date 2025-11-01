import { TipsDisplay } from "@/components/tips/tips-display";
import { PageHeader } from "@/components/shared/page-header";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function TipsPage() {
    return (
        <div>
            <PageHeader
                title="Personalized Tips"
                description="Here are some AI-powered suggestions based on your recent activities."
            />
            <TipsDisplay />
        </div>
    );
}
