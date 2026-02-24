import { OverviewDashboard } from "@/components/dashboard-overview";
import DataTable from "@/components/data/data-table";
import DataTableClient from "@/components/data/data-table-client";
import { columns } from "@/components/data/columns";
import { createSupabaseServerClient } from "@/lib/db";

async function fetchDashboardData() {
  const supabase = createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from("central_reg_data")
      .select("id, road_name, iri, speed, latitude, longitude, road_condition")
      .order("id");

    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("Dashboard DB fetch error:", error);
    return [];
  }
}

async function fetchStats() {
  const supabase = createSupabaseServerClient();
  try {
    // Fetch all stats in parallel for efficiency
    const [
      { data: totalRoadsData },
      { count: totalSegments },
      { count: inspectionsCompleted },
      { count: roadsNeeding },
      { data: pciData },
    ] = await Promise.all([
      supabase.from("central_reg_data").select("road_name"),
      supabase
        .from("central_reg_data")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("central_reg_data")
        .select("*", { count: "exact", head: true })
        .not("road_condition", "is", null),
      supabase
        .from("central_reg_data")
        .select("*", { count: "exact", head: true })
        .gt("iri", 150)
        .not("iri", "is", null),
      supabase
        .from("central_reg_data")
        .select("pci_score")
        .not("pci_score", "is", null),
    ]);

    // Get unique road names
    const roadNames = new Set(totalRoadsData?.map((d) => d.road_name));

    // Calculate average PCI
    const avgPci =
      pciData && pciData.length > 0
        ? Math.round(
            pciData.reduce((sum, row) => sum + (row.pci_score || 0), 0) /
              pciData.length,
          )
        : 0;

    return {
      totalRoads: roadNames.size,
      totalSegments: totalSegments || 0,
      inspectionsCompleted: inspectionsCompleted || 0,
      roadsNeeding: roadsNeeding || 0,
      avgPci,
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
