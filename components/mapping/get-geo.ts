import { createSupabaseServerClient } from "@/lib/db";

export async function getRoadsGeoJSON() {
  const supabase = createSupabaseServerClient();
  
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

  const { data, error } = await supabase.rpc('pg_catalog.to_regclass', { text: sql });
  
  // Fallback: use text() for raw SQL if available
  const { data: resData, error: resError } = await supabase
    .from('roads')
    .select('*')
    .limit(1);
    
  // Since Supabase doesn't directly support ST_AsGeoJSON via the client,
  // we'll fetch the raw data and transform it on the client side
  const { data: roadsData, error: roadsError } = await supabase
    .from('roads')
    .select('id, road_name, length');

  if (roadsError) {
    console.error('Error fetching roads:', roadsError);
    return null;
  }

  // Build GeoJSON manually
  const geojson = {
    type: 'FeatureCollection',
    features: (roadsData || []).map((road: any) => ({
      type: 'Feature',
      geometry: null, // Would need PostGIS to get actual geometry
      properties: {
        id: road.id,
        road_name: road.road_name,
        length: road.length
      }
    }))
  };

  return geojson;
}
