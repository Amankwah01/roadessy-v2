import { OverviewDashboard } from "@/components/dashboard-overview";
import DataTable from "@/components/data/supa-data-table";
import DataTableClient from "@/components/data/data-table-client";
import { columns } from "@/components/data/columns";
import { safeQuery } from "@/lib/db-pg";

async function fetchDashboardData() {
  try {
    const res = await safeQuery(
      `SELECT id, road_name, iri, iri_inst, iri_smartphone, speed_inst, speed_smartphone, vert_displacement, travel_distance, road_type, region, road_condition, pci_score FROM iri_sample ORDER BY id`,
    );
    return res.rows ?? [];
  } catch (error) {
    console.error("Dashboard DB fetch error:", error);
    return [];
  }
}

async function fetchStats() {
  try {
    // Fetch all stats in parallel for efficiency
    const [
      totalRoadsRes,
      totalSegmentsRes,
      inspectionsRes,
      roadsNeedingRes,
      avgPciRes,
    ] = await Promise.all([
      safeQuery("SELECT COUNT(DISTINCT road_name) AS c FROM iri_sample"),
      safeQuery("SELECT COUNT(*) AS c FROM iri_sample"),
      safeQuery(
        "SELECT COUNT(*) AS c FROM iri_sample WHERE road_condition IS NOT NULL",
      ),
      safeQuery(
        "SELECT COUNT(*) AS c FROM iri_sample WHERE iri IS NOT NULL AND iri > 150",
      ),
      safeQuery(
        "SELECT AVG(pci_score) AS a FROM iri_sample WHERE pci_score IS NOT NULL",
      ),
    ]);

    return {
      totalRoads: Number(totalRoadsRes.rows?.[0]?.c ?? 0),
      totalSegments: Number(totalSegmentsRes.rows?.[0]?.c ?? 0),
      inspectionsCompleted: Number(inspectionsRes.rows?.[0]?.c ?? 0),
      roadsNeeding: Number(roadsNeedingRes.rows?.[0]?.c ?? 0),
      avgPci: Math.round(Number(avgPciRes.rows?.[0]?.a ?? 0)),
    };
  } catch (error) {
    console.error("Stats fetch error:", error);
    return {
      totalRoads: 0,
      totalSegments: 0,
      inspectionsCompleted: 0,
      roadsNeeding: 0,
      avgPci: 0,
    };
  }
}

export default async function Home() {
  const roadData = await fetchDashboardData();
  const stats = await fetchStats();

  return (
    <div className="p-4 flex-col">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <OverviewDashboard stats={stats} />
        </div>
      </div>
      <div className="mt-4">
        {roadData.length > 0 ? (
          <DataTableClient columns={columns} data={roadData} />
        ) : (
          <DataTable />
        )}
      </div>
      <div className="relative flex justify-end"></div>
    </div>
  );
}
