import { safeQuery } from "@/lib/db";

export async function getRoadsGeoJSON() {
  const sql = `
    SELECT jsonb_build_object(
      'type', 'FeatureCollection',
      'features', jsonb_agg(
        jsonb_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(geom)::jsonb,
          'properties', jsonb_build_object(
            'id', id,
            'road_name', road_name,
            'length', length
          )
        )
      )
    ) AS geojson
    FROM roads;
  `;

  const res = await safeQuery(sql);
  return res.rows[0]?.geojson;
}
