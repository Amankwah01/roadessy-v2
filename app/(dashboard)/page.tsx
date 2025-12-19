import { OverviewDashboard } from "@/components/dashboard-overview";
import { columns } from "@/components/data/columns";
import DataTable from "@/components/data/data-table";
import DataTableClient from "@/components/data/data-table-client";
import pool from "@/lib/db";

export default async function Home() {
  try {
    const res = await pool.query(
      `SELECT id, road_name, iri, speed, latitude, longitude, road_condition FROM central_reg_data ORDER BY id`
    );
    const rows = res.rows ?? [];

    return (
      <div className="p-4 flex-col">
        <OverviewDashboard />
        <div className="mt-4">
          <DataTable  />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard DB fetch error:", error);
    return (
      <div className="p-4">
        <OverviewDashboard />
        <div className="mt-4">Failed to load dashboard data.</div>
      </div>
    );
  }
}
