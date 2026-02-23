import { OverviewDashboard } from "@/components/dashboard-overview";
import DataTable from "@/components/data/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns } from "@/components/data/columns";
// import pool from "@/lib/db";

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

export default async function RoadSegments() {
  //   const { rows } = await pool.query<RoadRow>(`
  //     SELECT
  //       id,
  //       road_name,
  //       iri,
  //       speed,
  //       latitude,
  //       longitude,
  //       road_condition
  //     FROM road_roughness_data
  //     ORDER BY id
  //     LIMIT 100
  //   `);

  return (
    <div className="p-4 flex-col">
      <div className="grid grid-cols-1 gap-x-3 mt-1">
        <Card className="border-none shadow-none"> 
          <CardHeader>
            <CardTitle className="text-xl">Road Segments</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-2">
            <DataTable />
          </CardContent>

          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
        {/*<Tabs defaultValue="overview">*/}
        {/*  <TabsList>*/}
        {/*    <TabsTrigger className="border-2" value="overview">*/}
        {/*      Overview*/}
        {/*    </TabsTrigger>*/}
        {/*    <TabsTrigger className="border-2" value="photos">*/}
        {/*      Photos*/}
        {/*    </TabsTrigger>*/}
        {/*    <TabsTrigger className="border-2" value="condition-ratings">*/}
        {/*      Condition ratings*/}
        {/*    </TabsTrigger>*/}
        {/*    <TabsTrigger className="border-2" value="defects">*/}
        {/*      Defects*/}
        {/*    </TabsTrigger>*/}
        {/*    <TabsTrigger className="border-2" value="inspection-history">*/}
        {/*      Inspection history*/}
        {/*    </TabsTrigger>*/}
        {/*    <TabsTrigger className="border-2" value="inspector-notes">*/}
        {/*      Inspector notes*/}
        {/*    </TabsTrigger>*/}
        {/*  </TabsList>*/}

        {/*  <TabsContent value="overview">*/}
        {/*    */}
        {/*  </TabsContent>*/}
        {/*</Tabs>*/}
      </div>
    </div>
  );
}
