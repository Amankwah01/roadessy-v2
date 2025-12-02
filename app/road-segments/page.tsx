"use client";
import { useEffect, useState } from "react";
import { OverviewDashboard } from "@/components/dashboard-overview";
import { DataTable } from "@/components/data/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns } from "@/components/data/columns";
import getData from "@/components/data/data";

function RoadSegments() {
  const [data, setData] = useState<any[]>([]);
  const [cols, setCols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resolvedCols = await columns;
        const resolvedData = await getData();
        if (mounted) {
          setCols(resolvedCols ?? []);
          setData(resolvedData ?? []);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-4 flex-col">
      <OverviewDashboard />
      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-3 mt-1">
        <div className="">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger className="border-2" value="overview">
                Overview 
              </TabsTrigger> |
              <TabsTrigger className="border-2" value="photos">
                Photos 
              </TabsTrigger> |
              <TabsTrigger className="border-2" value="condition-ratings">
                Condition ratings 
              </TabsTrigger> |
              <TabsTrigger className="border-2" value="defects">Defects </TabsTrigger> |
              <TabsTrigger className="border-2" value="inspection-history">
                Inspection history 
              </TabsTrigger> |
              <TabsTrigger className="border-2" value="inspector-notes">Inspector notes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Road Segments</CardTitle>
                  {/* <CardDescription>
                    Make changes to your account here. Click save when
                    you&apos;re done.
                  </CardDescription> */}
                </CardHeader>
                <CardContent className="grid gap-2">
                  {!loading ? (
                    <DataTable columns={cols} data={data} />
                  ) : (
                    <div>Loading...</div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you&apos;ll be
                    logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-current">Current password</Label>
                    <Input id="tabs-demo-current" type="password" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-new">New password</Label>
                    <Input id="tabs-demo-new" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default RoadSegments;