import { OverviewDashboard } from "@/components/dashboard-overview";
import DataTable from "@/components/data/data-table";
import DataTableClient from "@/components/data/data-table-client";
import { columns } from "@/components/data/columns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { safeQuery } from "@/lib/db";

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
  try {
    const res = await safeQuery(
      `SELECT id, road_name, iri, iri_inst, iri_smartphone, speed_inst, speed_smartphone, vert_displacement, travel_distance, road_type, region, road_condition FROM central_reg_data ORDER BY id`
    );
    return res.rows ?? [];
  } catch (error) {
    console.error("Inspection DB fetch error:", error);
    return [];
  }
}

async function fetchStats() {
  try {
    const [totalRes, completedRes, pendingRes, avgIriRes] = await Promise.all([
      safeQuery("SELECT COUNT(*) AS c FROM central_reg_data"),
      safeQuery("SELECT COUNT(*) AS c FROM central_reg_data WHERE road_condition IS NOT NULL"),
      safeQuery("SELECT COUNT(*) AS c FROM central_reg_data WHERE road_condition IS NULL"),
      safeQuery("SELECT AVG(iri) AS a FROM central_reg_data WHERE iri IS NOT NULL"),
    ]);

    return {
      total: Number(totalRes.rows?.[0]?.c ?? 0),
      completed: Number(completedRes.rows?.[0]?.c ?? 0),
      pending: Number(pendingRes.rows?.[0]?.c ?? 0),
      avgIri: Math.round(Number(avgIriRes.rows?.[0]?.a ?? 0)),
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
            <CardTitle className="text-xl">Road Inspections</CardTitle>
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
