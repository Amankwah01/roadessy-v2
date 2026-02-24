import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

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
  // If stats are passed, use them
  if (stats) {
    const content: { title: string; value: number }[] = [
      { title: "Total Roads", value: stats.totalRoads },
      { title: "Total Road Segments", value: stats.totalSegments },
      { title: "Inspections Completed", value: stats.inspectionsCompleted },
      { title: "Roads Needing Attention", value: stats.roadsNeeding },
      { title: "Average PCI Score", value: stats.avgPci },
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

  // Default fallback values
  const defaults = {
    totalRoads: 1250,
    totalSegments: 3400,
    inspectionsCompleted: 2750,
    roadsNeeding: 150,
    avgPci: 85,
  };

  // Try to fetch from Supabase
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Fetch all required data
    const [
      { data: roadsData, error: roadsError },
      { data: iriData, error: iriError },
      { data: pciData, error: pciError }
    ] = await Promise.all([
      // Get all road data including road_condition
      supabase.from('iri_sample').select('road_name, road_condition'),
      // Get all IRI values for roads needing attention
      supabase.from('iri_sample').select('iri').not('iri', 'is', null),
      // Get all PCI scores for average
      supabase.from('iri_sample').select('pci_score').not('pci_score', 'is', null),
    ]);

    // Calculate Total Roads (unique road names - normalized to handle duplicates with different cases)
    const uniqueRoads = new Set(roadsData?.map(r => r.road_name?.trim().toLowerCase()));
    const totalRoads = uniqueRoads.size || defaults.totalRoads;

    // Total Segments
    const totalSegments = roadsData?.length || defaults.totalSegments;

    // Inspections Completed (rows with road_condition)
    const inspectionsCompleted = roadsData?.filter(r => r.road_condition !== null).length || defaults.inspectionsCompleted;

    // Roads Needing Attention (IRI > 150)
    const roadsNeeding = iriData?.filter(r => r.iri > 150).length || defaults.roadsNeeding;

    // Average PCI
    let avgPci = defaults.avgPci;
    if (pciData && pciData.length > 0) {
      const sum = pciData.reduce((acc, r) => acc + (r.pci_score || 0), 0);
      avgPci = Math.round(sum / pciData.length);
    }

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
  } catch (error) {
    console.error("Supabase fetch error:", error);
  }

  // Fallback to defaults
  const content: { title: string; value: number }[] = [
    { title: "Total Roads", value: defaults.totalRoads },
    { title: "Total Road Segments", value: defaults.totalSegments },
    { title: "Inspections Completed", value: defaults.inspectionsCompleted },
    { title: "Roads Needing Attention", value: defaults.roadsNeeding },
    { title: "Average PCI Score", value: defaults.avgPci },
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
