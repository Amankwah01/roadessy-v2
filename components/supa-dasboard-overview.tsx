import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { safeQuery } from "@/lib/db";

type Stats = {
  totalRoads: number;
  totalSegments: number;
  inspectionsCompleted: number;
  roadsNeeding: number;
  avgPci: number;
};

type OverviewDashboardProps = {
  stats?: Stats;
};

export async function OverviewDashboard({ stats }: OverviewDashboardProps) {
  const defaults = {
    totalRoads: 1250,
    totalSegments: 3400,
    inspectionsCompleted: 2750,
    roadsNeeding: 150,
    avgPci: 85,
  };

  // Use passed stats or fall back to defaults
  const content: { title: string; value: number }[] = [
    { title: "Total Roads", value: stats?.totalRoads ?? defaults.totalRoads },
    {
      title: "Total Road Segments",
      value: stats?.totalSegments ?? defaults.totalSegments,
    },
    {
      title: "Inspections Completed",
      value: stats?.inspectionsCompleted ?? defaults.inspectionsCompleted,
    },
    {
      title: "Roads Needing Attention",
      value: stats?.roadsNeeding ?? defaults.roadsNeeding,
    },
    { title: "Average PCI Score", value: stats?.avgPci ?? defaults.avgPci },
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
