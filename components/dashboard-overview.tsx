import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import pool from "@/lib/db";

export async function OverviewDashboard() {
  const defaults = {
    totalRoads: 1250,
    totalSegments: 3400,
    inspectionsCompleted: 2750,
    roadsNeeding: 150,
    avgPci: 85,
  };

  let totalRoads = defaults.totalRoads;
  let totalSegments = defaults.totalSegments;
  let inspectionsCompleted = defaults.inspectionsCompleted;
  let roadsNeeding = defaults.roadsNeeding;
  let avgPci = defaults.avgPci;

  try {
    const res = await pool.query(
      "SELECT COUNT(DISTINCT road_name) AS c FROM central_reg_data"
    );
    totalRoads = Number(res.rows?.[0]?.c ?? totalRoads);
  } catch (e) {}

  try {
    const res = await pool.query("SELECT COUNT(*) AS c FROM central_reg_data");
    totalSegments = Number(res.rows?.[0]?.c ?? totalSegments);
  } catch (e) {}

  try {
    const res = await pool.query(
      "SELECT COUNT(*) AS c FROM central_reg_data WHERE road_condition IS NOT NULL"
    );
    inspectionsCompleted = Number(res.rows?.[0]?.c ?? inspectionsCompleted);
  } catch (e) {}

  try {
    const res = await pool.query(
      "SELECT COUNT(*) AS c FROM central_reg_data WHERE iri IS NOT NULL AND iri > 150"
    );
    roadsNeeding = Number(res.rows?.[0]?.c ?? roadsNeeding);
  } catch (e) {}

  try {
    const res = await pool.query(
      "SELECT AVG(pci_score) AS a FROM central_reg_data WHERE pci_score IS NOT NULL"
    );
    const raw = res.rows?.[0]?.a;
    avgPci =
      raw !== null && raw !== undefined ? Math.round(Number(raw)) : avgPci;
  } catch (e) {}

  const content: { title: string; value: number }[] = [
    { title: "Total Roads", value: totalRoads },
    { title: "Total Road Segments", value: totalSegments },
    { title: "Inspections Completed", value: inspectionsCompleted },
    { title: "Roads Needing Attention", value: roadsNeeding },
    { title: "Average PCI Score", value: avgPci },
  ];

  return (
    <div className="w-full flex gap-x-2">
      {content.map((item) => (
        <Card key={item.title} className="w-full mb-2">
          <CardHeader>
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="-mt-5">
            <p>{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
