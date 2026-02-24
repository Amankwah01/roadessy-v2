-- Create the iri_sample table for road data
CREATE TABLE IF NOT EXISTS iri_sample (
    id SERIAL PRIMARY KEY,
    road_name VARCHAR(255),
    iri NUMERIC,
    iri_inst NUMERIC,
    iri_smartphone NUMERIC,
    speed_inst NUMERIC,
    speed_smartphone NUMERIC,
    vert_displacement NUMERIC,
    travel_distance NUMERIC,
    road_type VARCHAR(100),
    region VARCHAR(100),
    road_condition VARCHAR(100),
    pci_score NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_iri_sample_road_name ON iri_sample(road_name);
CREATE INDEX IF NOT EXISTS idx_iri_sample_region ON iri_sample(region);
CREATE INDEX IF NOT EXISTS idx_iri_sample_road_condition ON iri_sample(road_condition);

-- Insert some sample data for testing
INSERT INTO iri_sample (road_name, iri, iri_inst, iri_smartphone, speed_inst, speed_smartphone, vert_displacement, travel_distance, road_type, region, road_condition, pci_score) VALUES
('Accra-Tema Motorway', 2.5, 2.3, 2.7, 80, 75, 0.5, 25.5, 'Highway', 'Greater Accra', 'Good', 85),
('Kumasi-Bekwai Road', 4.2, 4.0, 4.5, 65, 60, 1.2, 15.2, 'Urban', 'Ashanti', 'Fair', 65),
('Cape Coast-Elmina Road', 3.8, 3.5, 4.1, 70, 68, 0.9, 12.8, 'Urban', 'Central', 'Good', 75),
('Takoradi-Sekondi Road', 5.1, 4.8, 5.4, 55, 52, 1.8, 18.3, 'Urban', 'Western', 'Poor', 45),
('Tamale-Yendi Road', 6.3, 6.0, 6.6, 45, 42, 2.5, 35.7, 'Rural', 'Northern', 'Poor', 35),
('Koforidua-Akuapim Road', 3.2, 3.0, 3.4, 72, 70, 0.7, 22.1, 'Rural', 'Eastern', 'Good', 80),
('Ho-Aflao Road', 4.5, 4.2, 4.8, 62, 58, 1.4, 28.9, 'Highway', 'Volta', 'Fair', 60),
('Bolgatanga-Bawku Road', 5.8, 5.5, 6.1, 48, 45, 2.1, 42.3, 'Rural', 'Upper East', 'Poor', 40),
('Sunyani-Berekum Road', 3.9, 3.6, 4.2, 68, 65, 1.0, 19.5, 'Urban', 'Bono', 'Good', 72),
('Wa-Lawra Road', 4.8, 4.5, 5.1, 58, 55, 1.6, 38.2, 'Rural', 'Upper West', 'Fair', 55);
