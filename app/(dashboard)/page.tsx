import { OverviewDashboard } from "@/components/dashboard-overview";
import DataTable from "@/components/data/supa-data-table";
import { AIAssistantSheet } from "@/components/ai/ai-assistant-sheet";
import pool, { safeQuery } from "@/lib/db";

async function fetchDashboardData() {
  try {
    const res = await safeQuery(
      `SELECT id, road_name, iri, speed, latitude, longitude, road_condition FROM central_reg_data ORDER BY id`
    );
    return res.rows ?? [];
  } catch (error) {
    console.error("Dashboard DB fetch error:", error);
    return null;
  }
}

export default async function Home() {
  await fetchDashboardData();

  return (
    <div className="p-4 flex-col">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <OverviewDashboard />
        </div>
      </div>
      <div className="mt-4">
        <DataTable />
      </div>
      <div className="relative flex justify-end">
        
      </div>
    </div>
  );
}
