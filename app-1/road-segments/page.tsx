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
      .from('central_reg_data')
      .select('id, road_name, iri, speed, latitude, longitude, road_condition')
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
      { count: total },
      { data: conditionData },
      { data: iriData }
    ] = await Promise.all([
      supabase.from('central_reg_data').select('*', { count: 'exact', head: true }),
      supabase.from('central_reg_data').select('road_condition').not('road_condition', 'is', null),
      supabase.from('central_reg_data').select('iri').not('iri', 'is', null)
    ]);

    // Group by condition
    const byCondition = (conditionData || []).reduce((acc: any, row) => {
      const cond = row.road_condition || 'Unknown';
      acc[cond] = (acc[cond] || 0) + 1;
      return acc;
    }, {});

    // Calculate average IRI
    const avgIri = iriData && iriData.length > 0
      ? Math.round(iriData.reduce((sum, row) => sum + (row.iri || 0), 0) / iriData.length)
      : 0;

    return {
      total: total || 0,
      byCondition: Object.entries(byCondition).map(([road_condition, count]) => ({ road_condition, count })),
      avgIri,
    };
  } catch (error) {
    console.error("Stats fetch error:", error);
    return { total: 0, byCondition: [], avgIri: 0 };
  }
}

export default async function RoadSegments() {
  const roadSegmentsData = await fetchRoadSegmentsData();
  const stats = await fetchStats();

  return (
    <div className="p-4 flex-col">
      <div className="grid grid-cols-1 gap-x-3 mt-1">
        <Card className="border-none shadow-none"> 
          <CardHeader>
            <CardTitle className="text-xl">Road Segments (PostgreSQL)</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-2">
            {roadSegmentsData.length > 0 ? (
              <DataTableClient columns={columns} data={roadSegmentsData} />
            ) : (
              <DataTable />
            )}
          </CardContent>

          <CardFooter>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
