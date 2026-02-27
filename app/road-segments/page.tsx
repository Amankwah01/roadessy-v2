import DataTable from "@/components/data/data-table";
import DataTableClient from "@/components/data/data-table-client";
import { columns } from "@/components/data/columns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/db";

export const dynamic = "force-dynamic";
export type RoadRow = {
  id: number;
  road_name: string;
  iri: number;
  speed: number;
  latitude: number;
  longitude: number;
  road_condition: string;
};

async function fetchRoadSegmentsData() {
  const supabase = createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('iri_sample')
      .select('id, road_name, iri_inst, iri_smartphone, speed_inst, speed_smartphone, vert_displacement, travel_distance, road_type, region, road_condition')
      .order('id');
    
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("Road Segments DB fetch error:", error);
    return [];
  }
}

async function fetchStats() {
  const supabase = createSupabaseServerClient();
  try {
    const [
      { count: totalCount },
      { data: conditionData },
      // { data: pciData }
    ] = await Promise.all([
      supabase.from('iri_sample').select('*', { count: 'exact', head: true }),
      supabase.from('iri_sample').select('road_condition').not('road_condition', 'is', null),
      // supabase.from('iri_sample').select('pci_score').not('pci_score', 'is', null)
    ]);

    // Group by condition
    const byCondition = (conditionData || []).reduce((acc: any, row) => {
      const cond = row.road_condition || 'Unknown';
      acc[cond] = (acc[cond] || 0) + 1;
      return acc;
    }, {});

    // Calculate average PCI
      // const avgPci = pciData && pciData.length > 0
      //   ? Math.round(pciData.reduce((sum, row) => sum + (row.pci_score || 0), 0) / pciData.length)
      //   : 0;

    return {
      total: totalCount || 0,
      byCondition: Object.entries(byCondition).map(([road_condition, count]) => ({ road_condition, count })),
      // avgPci,
    };
  } catch (error) {
    console.error("Stats fetch error:", error);
    return { total: 0, byCondition: [], avgPci: 0 };
  }
}

export default async function RoadSegments() {
  const roadSegmentsData = await fetchRoadSegmentsData();
  const stats = await fetchStats();

  return (
    <div className="p-4 flex-col">
      <p className="text-2xl font-semibold my-5">Road Segments</p>
      <div className="grid grid-cols-1 gap-x-3 mt-1">
        {roadSegmentsData.length > 0 ? (
          <DataTableClient columns={columns} data={roadSegmentsData} />
        ) : (
          <DataTable />
        )}
        {/* <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-xl"></CardTitle>
          </CardHeader>

          <CardContent className="grid gap-2"></CardContent>

          <CardFooter></CardFooter>
        </Card> */}
      </div>
    </div>
  );
}


// <div className="">
//   {/* 3. Pass the detailed rows to the data table */}
//   <DataTable />
// </div>