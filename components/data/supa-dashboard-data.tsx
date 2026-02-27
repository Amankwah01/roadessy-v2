import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function fetchSupaDashboardData() {
  // 1. Default fallback values
  const defaults = {
    totalRoads: 1250,
    totalSegments: 3400,
    inspectionsCompleted: 2750,
    roadsNeeding: 150,
    avgPci: 85,
  };

  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // 2. Fetch data in parallel
    const [
      { data: roadsData, error: roadsError },
      { data: iriData, error: iriError },
    ] = await Promise.all([
      supabase.from("iri_sample").select("road_name, road_condition"),
      supabase
        .from("iri_sample")
        .select("iri_smartphone")
        .not("iri_smartphone", "is", null),
    ]);

    // 3. Calculation Logic
    const uniqueRoads = new Set(
      roadsData?.map((r) => r.road_name?.trim().toLowerCase()),
    );

    const totalRoads =
      uniqueRoads.size > 0 ? uniqueRoads.size : defaults.totalRoads;
    const totalSegments = roadsData?.length ?? defaults.totalSegments;
    const inspectionsCompleted =
      roadsData?.filter((r) => r.road_condition !== null).length ??
      defaults.inspectionsCompleted;
    const roadsNeeding =
      iriData?.filter((r) => r.iri_smartphone > 5).length ??
      defaults.roadsNeeding;
    const avgIri =
      iriData && iriData.length > 0
        ? parseFloat(
            (
              iriData.reduce((sum, r) => sum + (r.iri_smartphone || 0), 0) /
              iriData.length
            ).toFixed(2),
          )
        : defaults.avgPci;

    // Static value since PCI fetch is currently commented out
    const avgPci = defaults.avgPci;

    console.log("Unique Roads Count:", uniqueRoads.size);

    // 4. Return the result object
    return {
      iriData,
      roadsData,
      roadsError,
      iriError,
      totalRoads,
      totalSegments,
      inspectionsCompleted,
      roadsNeeding,
      avgPci,
      avgIri,
    };
  } catch (error) {
    console.error("Unexpected Dashboard Error:", error);
    // Return defaults so the UI doesn't crash on a failed fetch
    return {
      ...defaults,
      iriData: [],
      roadsData: [],
      roadsError: error,
      iriError: null,
    };
  }
}

export { fetchSupaDashboardData };
