import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db";

export async function GET() {
  const supabase = createSupabaseServerClient();
  try {
    // Fetch roads data from Supabase
    const { data, error } = await supabase
      .from('api_roads_ghana')
      .select('*');

    if (error) throw error;

    // Build GeoJSON manually
    const geojson = {
      type: 'FeatureCollection',
      features: (data || []).map((road: any) => ({
        type: 'Feature',
        geometry: road.geom, // Would need PostGIS extension for actual geometry
        properties: {
          id: road.gid,
          road_name: road.name,
          road_district: road.road_condition,
          road_region: road.region,
          road_type: road.fclass
        }
      }))
    };

    return NextResponse.json(geojson);
  } catch (err) {
    console.error("Error fetching roads:", err);
    return NextResponse.json(
      { error: "Failed to load roads", details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
