import { NextResponse } from "next/server";
import { safeQuery } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await safeQuery(`
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
          jsonb_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(geom)::jsonb,
            'properties', jsonb_build_object(
              'id', gid,
              'road_name', roadname,
              'condition', condition
            )
          )
        )
      ) AS geojson
          FROM roads_ghana_final
    `);

    return NextResponse.json(rows[0].geojson);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load roads" },
      { status: 500 },
    );
  }
}
