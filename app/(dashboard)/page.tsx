import DataTable from "@/components/data/supa-data-table";
import { OverviewDashboard } from "@/components/supa-dasboard-overview";
import { fetchSupaDashboardData } from "@/components/data/supa-dashboard-data";

export default async function Home() {
  // 1. Fetch both the table data AND the summary stats
  // We use Promise.all here so the page loads faster
  const [statsData] = await Promise.all([
    fetchSupaDashboardData(),
  ]);

  return (
    <div className="p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* 2. Pass the calculated stats object to the dashboard */}
          <OverviewDashboard data={statsData} />
        </div>
      </div>

      
    </div>
  );
}
