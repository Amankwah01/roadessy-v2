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

async function fetchRoadSegmentsData() {
  try {
    const res = await safeQuery(
      `SELECT id, road_name, iri, iri_inst, iri_smartphone, speed_inst, speed_smartphone, vert_displacement, travel_distance, road_type, region, road_condition, pci_score FROM central_reg_data ORDER BY id`
    );
    return res.rows ?? [];
  } catch (error) {
    console.error("Road Segments DB fetch error:", error);
    return [];
  }
}

async function fetchStats() {
  try {
    const [totalRes, byConditionRes, avgPciRes] = await Promise.all([
      safeQuery("SELECT COUNT(*) AS c FROM central_reg_data"),
      safeQuery(`
        SELECT road_condition, COUNT(*) as count 
        FROM central_reg_data 
        WHERE road_condition IS NOT NULL 
        GROUP BY road_condition
      `),
      safeQuery("SELECT AVG(pci_score) AS a FROM central_reg_data WHERE pci_score IS NOT NULL"),
    ]);

    return {
      total: Number(totalRes.rows?.[0]?.c ?? 0),
      byCondition: byConditionRes.rows ?? [],
      avgPci: Math.round(Number(avgPciRes.rows?.[0]?.a ?? 0)),
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
      <div className="grid grid-cols-1 gap-x-3 mt-1">
        <Card className="border-none shadow-none"> 
          <CardHeader>
            <CardTitle className="text-xl">Road Segments</CardTitle>
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
