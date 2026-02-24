import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db";

export async function GET() {
  const supabase = createSupabaseServerClient();
  try {
    // Fetch roads data from Supabase
    const { data, error } = await supabase
      .from('roads_ghana_final')
      .select('gid, roadname, condition');

    if (error) throw error;

    // Build GeoJSON manually
    const geojson = {
      type: 'FeatureCollection',
      features: (data || []).map((road: any) => ({
        type: 'Feature',
        geometry: null, // Would need PostGIS extension for actual geometry
        properties: {
          id: road.gid,
          road_name: road.roadname,
          condition: road.condition
        }
      }))
    };

    return NextResponse.json(geojson);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load roads" },
      { status: 500 },
    );
  }
}
