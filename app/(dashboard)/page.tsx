import { OverviewDashboard } from "@/components/supa-dasboard-overview";
import DataTable from "@/components/data/supa-data-table";
import DataTableClient from "@/components/data/data-table-client";
import { columns } from "@/components/data/columns";
import { createSupabaseServerClient } from "@/lib/db";

async function fetchDashboardData() {
  const supabase = createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('iri_sample')
      .select('id, road_name, iri_inst, iri_smartphone, speed_inst, speed_smartphone, vert_displacement, travel_distance, road_type, region, road_condition')
      .order('id');
    
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
    // Fetch all required data
    const [
      { data: roadsData, error: error1 },
      { data: iriData, error: error4 },
      { data: pciData, error: error5 }
    ] = await Promise.all([
      // Get all road names and conditions
      supabase.from('iri_sample').select('road_name, road_condition'),
      // Get all IRI values
      supabase.from('iri_sample').select('iri_inst').not('iri_inst', 'is', null),
      // Get all PCI scores
      supabase.from('iri_sample').select('pci_score').not('pci_score', 'is', null),
    ]);

    // Calculate Total Roads (unique road names - normalized)
    const uniqueRoads = new Set(roadsData?.map(r => r.road_name?.trim().toLowerCase()));
    const totalRoads = uniqueRoads.size || 0;

    // Total Segments
    const totalSegments = roadsData?.length || 0;

    // Inspections Completed (rows with road_condition)
    const inspectionsCompleted = roadsData?.filter(r => r.road_condition !== null).length || 0;

    // Roads Needing Attention (IRI > 150)
    const roadsNeeding = iriData?.filter(r => r.iri_inst > 10).length || 0;

    // Average PCI
    let avgPci = 0;
    if (pciData && pciData.length > 0) {
      const sum = pciData.reduce((acc, r) => acc + (r.pci_score || 0), 0);
      avgPci = Math.round(sum / pciData.length);
    }

    return {
      totalRoads,
      totalSegments,
      inspectionsCompleted,
      roadsNeeding,
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
      <div className="relative flex justify-end">
        
      </div>
    </div>
  );
}
