CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crd_id
  ON central_reg_data(id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crd_road_name
  ON central_reg_data(road_name);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crd_condition
  ON central_reg_data(road_condition);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crd_lat_lng
  ON central_reg_data(latitude, longitude);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crd_iri
  ON central_reg_data(iri);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crd_speed
  ON central_reg_data(speed);
