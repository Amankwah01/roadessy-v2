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

async function fetchInspectionData() {
  const supabase = createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('central_reg_data')
      .select('id, road_name, iri, speed, latitude, longitude, road_condition')
      .order('id');
    
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("Inspection DB fetch error:", error);
    return [];
  }
}

async function fetchStats() {
  const supabase = createSupabaseServerClient();
  try {
    const [
      { count: total },
      { count: completed },
      { count: pending },
      { data: iriData }
    ] = await Promise.all([
      supabase.from('central_reg_data').select('*', { count: 'exact', head: true }),
      supabase.from('central_reg_data').select('*', { count: 'exact', head: true }).not('road_condition', 'is', null),
      supabase.from('central_reg_data').select('*', { count: 'exact', head: true }).is('road_condition', null),
      supabase.from('central_reg_data').select('iri').not('iri', 'is', null)
    ]);

    // Calculate average IRI
    const avgIri = iriData && iriData.length > 0
      ? Math.round(iriData.reduce((sum, row) => sum + (row.iri || 0), 0) / iriData.length)
      : 0;

    return {
      total: total || 0,
      completed: completed || 0,
      pending: pending || 0,
      avgIri,
    };
  } catch (error) {
    console.error("Stats fetch error:", error);
    return { total: 0, completed: 0, pending: 0, avgIri: 0 };
  }
}

export default async function RoadSegments() {
  const inspectionData = await fetchInspectionData();
  const stats = await fetchStats();

  return (
    <div className="p-4 flex-col">
      <div className="grid grid-cols-1 gap-x-3 mt-1">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-xl">Road Inspections (PostgreSQL)</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-2">
            {inspectionData.length > 0 ? (
              <DataTableClient columns={columns} data={inspectionData} />
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
