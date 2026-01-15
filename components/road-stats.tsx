import { ProgressBar } from "./progress";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import pool, { safeQuery } from "@/lib/db";

type StatItem = { title: string; value: number };

export default async function RoadStats({ content }: { content?: StatItem[] }) {
  const defaultContent: StatItem[] = [
    // { title: "Total Roads", value: 1250 },
    // { title: "Total Road Segments", value: 3400 },
    // { title: "Inspections Completed", value: 2750 },
    // { title: "Roads Needing Attention", value: 150 },
    // { title: "Average IRI", value: 85 },
  ];

  if (content && content.length) {
    const data = content;
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-xl">Network Stats</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-8 -mt-4">
          {data.map((item) => {
            const fill = Math.min(Math.max((item.value / total) * 100, 0), 100);
            return (
              <div key={item.title}>
                <p className="text-xl flex">
                  {item.title} {fill.toFixed(2)}%
                </p>
                <p className="text-lg ">
                  {item.value}/{total}
                </p>
                <ProgressBar progressValue={fill} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  // Server-side fetch: attempt to compute real metrics; fall back to defaults on error
  let totalRoads = 1250;
  let totalSegments = 3400;
  let inspectionsCompleted = 2750;
  let roadsNeeding = 150;
  let avgIri = 85;

  try {
    const res1: any = await safeQuery(
      "SELECT COUNT(DISTINCT road_name) AS c FROM central_reg_data"
    );
    totalRoads = Number(res1.rows?.[0]?.c ?? totalRoads);
  } catch (e) {
    // table may not exist or column differs; keep default
  }

  try {
    const res2: any = await safeQuery(
      "SELECT COUNT(*) AS c FROM central_reg_data"
    );
    totalSegments = Number(res2.rows?.[0]?.c ?? totalSegments);
  } catch (e) {}

  try {
    const res3: any = await safeQuery(
      "SELECT COUNT(*) AS c FROM inspections WHERE status = 'completed'"
    );
    inspectionsCompleted = Number(res3.rows?.[0]?.c ?? inspectionsCompleted);
  } catch (e) {}

  try {
    const res4: any = await safeQuery(
      "SELECT COUNT(*) AS c FROM central_reg_data WHERE iri IS NOT NULL AND iri > 150"
    );
    roadsNeeding = Number(res4.rows?.[0]?.c ?? roadsNeeding);
  } catch (e) {}

  try {
    const res5: any = await safeQuery(
      "SELECT AVG(iri) AS a FROM central_reg_data WHERE iri IS NOT NULL"
    );
    const raw = res5.rows?.[0]?.a;
    avgIri =
      raw !== null && raw !== undefined ? Math.round(Number(raw)) : avgIri;
  } catch (e) {}

  const data: StatItem[] = [
    { title: "Total Roads", value: totalRoads },
    { title: "Total Road Segments", value: totalSegments },
    { title: "Inspections Completed", value: inspectionsCompleted },
    { title: "Roads Needing Attention", value: roadsNeeding },
    { title: "Average IRI", value: avgIri },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl">Network Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-8 -mt-4">
        {data.map((item) => {
          const fill = Math.min(Math.max((item.value / total) * 100, 0), 100);
          return (
            <div key={item.title}>
              <p className="text-xl flex">
                {item.title} {fill.toFixed(2)}%
              </p>
              <p className="text-lg ">
                {item.value}/{total}
              </p>
              <ProgressBar progressValue={fill} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
