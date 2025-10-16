import { HistoryTable } from "@/components/history/history-table";
import { PageHeader } from "@/components/shared/page-header";

export default function HistoryPage() {
    return (
        <div>
            <PageHeader
                title="Activity History"
                description="Review and track your past carbon footprint entries."
            />
            <HistoryTable />
        </div>
    );
}
