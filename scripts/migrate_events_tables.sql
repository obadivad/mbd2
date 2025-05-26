-- =====================================================
-- MINISTÉRIO DO BLOCO - EVENTS TABLE MIGRATION SCRIPT
-- =====================================================
-- This script merges blocos_parades, events, and events_new tables
-- to match the schema design in #3 schema.md

-- Step 1: Create backup tables
CREATE TABLE IF NOT EXISTS blocos_parades_backup AS SELECT * FROM blocos_parades;
CREATE TABLE IF NOT EXISTS events_backup AS SELECT * FROM events;
CREATE TABLE IF NOT EXISTS events_new_backup AS SELECT * FROM events_new;

-- Step 2: Clear events_new table (keeping structure)
DELETE FROM events_new;

-- Step 3: Migrate data from blocos_parades to events_new
INSERT INTO events_new (
    bloco_id,
    title,
    event_type,
    event_status,
    description_pt,
    start_datetime,
    end_datetime,
    all_day,
    city_id,
    location_name,
    address,
    coordinates,
    concentration_location,
    concentration_coordinates,
    concentration_time,
    dispersal_location,
    dispersal_coordinates,
    dispersal_time,
    expected_participants,
    ticket_required,
    ticket_price,
    is_draft,
    is_featured,
    created_at,
    updated_at
)
SELECT 
    bp.bloco_id,
    
    -- Generate meaningful titles
    CASE 
        WHEN bp.bloco_name IS NOT NULL THEN bp.bloco_name || ' - Desfile'
        ELSE 'Desfile de Carnaval'
    END as title,
    
    'parade'::event_type as event_type,
    'scheduled'::event_status as event_status,
    
    -- Description in Portuguese
    CASE 
        WHEN bp.location_concentration IS NOT NULL AND bp.location_dispersal IS NOT NULL THEN
            'Desfile do bloco ' || COALESCE(bp.bloco_name, 'Carnaval') || 
            '. Concentração: ' || bp.location_concentration || 
            '. Dispersão: ' || bp.location_dispersal || '.'
        WHEN bp.location_concentration IS NOT NULL THEN
            'Desfile do bloco ' || COALESCE(bp.bloco_name, 'Carnaval') || 
            '. Concentração: ' || bp.location_concentration || '.'
        ELSE
            'Desfile do bloco ' || COALESCE(bp.bloco_name, 'Carnaval') || '.'
    END as description_pt,
    
    -- Start datetime: combine parade_date with concentration_time
    CASE 
        WHEN bp.parade_date IS NOT NULL AND bp.concentration_time IS NOT NULL THEN
            bp.parade_date::date + bp.concentration_time::time
        WHEN bp.parade_date IS NOT NULL THEN
            bp.parade_date
        ELSE NOW()
    END as start_datetime,
    
    -- End datetime: combine parade_date with dispersal_time or add 4 hours
    CASE 
        WHEN bp.parade_date IS NOT NULL AND bp.dispersal_time IS NOT NULL THEN
            bp.parade_date::date + bp.dispersal_time::time
        WHEN bp.parade_date IS NOT NULL AND bp.concentration_time IS NOT NULL THEN
            bp.parade_date::date + bp.concentration_time::time + INTERVAL '4 hours'
        WHEN bp.parade_date IS NOT NULL THEN
            bp.parade_date + INTERVAL '4 hours'
        ELSE NULL
    END as end_datetime,
    
    false as all_day,
    bp.cities_id as city_id,
    bp.location_concentration as location_name,
    
    -- Combine location information for address
    CASE 
        WHEN bp.comprehensive_location IS NOT NULL THEN bp.comprehensive_location
        WHEN bp.location_concentration IS NOT NULL THEN bp.location_concentration
        ELSE NULL
    END as address,
    
    -- Use concentration coordinates as main coordinates
    COALESCE(bp.concentration_coordinates, bp.cooordinates) as coordinates,
    
    bp.location_concentration as concentration_location,
    bp.concentration_coordinates,
    
    -- Concentration time as full timestamp
    CASE 
        WHEN bp.parade_date IS NOT NULL AND bp.concentration_time IS NOT NULL THEN
            bp.parade_date::date + bp.concentration_time::time
        ELSE NULL
    END as concentration_time,
    
    bp.location_dispersal as dispersal_location,
    bp.dispersal_coordinates,
    
    -- Dispersal time as full timestamp
    CASE 
        WHEN bp.parade_date IS NOT NULL AND bp.dispersal_time IS NOT NULL THEN
            bp.parade_date::date + bp.dispersal_time::time
        ELSE NULL
    END as dispersal_time,
    
    NULL as expected_participants,
    false as ticket_required,
    NULL as ticket_price,
    false as is_draft,
    false as is_featured,
    COALESCE(bp.created_at, NOW()) as created_at,
    COALESCE(bp.updated_at, NOW()) as updated_at

FROM blocos_parades bp
WHERE bp.bloco_id IS NOT NULL 
  AND bp.parade_date IS NOT NULL
  AND bp.bloco_id != '00000000-0000-0000-0000-000000000000'; -- Exclude invalid UUIDs

-- Step 4: Migrate any useful data from old events table
INSERT INTO events_new (
    bloco_id,
    title,
    event_type,
    event_status,
    description_pt,
    start_datetime,
    end_datetime,
    city_id,
    location_name,
    coordinates,
    banner_url,
    external_url,
    external_url_text,
    is_draft,
    is_featured,
    created_at
)
SELECT 
    e.bloco_id,
    e.title,
    'other'::event_type as event_type, -- Default since old events don't have type
    'scheduled'::event_status,
    
    -- Extract Portuguese description from JSONB or use description field
    COALESCE(
        e.descriptions->>'pt',
        e.descriptions->>'description_pt', 
        e.description
    ) as description_pt,
    
    e.start_date as start_datetime,
    e.end_date as end_datetime,
    e.city_id,
    e.location as location_name,
    e.coordinates,
    e.banner_url,
    e.url as external_url,
    e.url_text as external_url_text,
    COALESCE(e.is_draft, false) as is_draft,
    COALESCE(e.is_featured, false) as is_featured,
    e.created_at

FROM events e
WHERE e.bloco_id IS NOT NULL
  AND e.bloco_id NOT IN (
    SELECT bloco_id FROM events_new WHERE bloco_id IS NOT NULL
  );

-- Step 5: Drop old tables (commented out for safety - uncomment after verification)
-- DROP TABLE IF EXISTS blocos_parades;
-- DROP TABLE IF EXISTS events;

-- Step 6: Rename events_new to events (commented out for safety)
-- ALTER TABLE events_new RENAME TO events;

-- Step 7: Create indexes for performance (based on schema.md)
CREATE INDEX IF NOT EXISTS idx_events_new_bloco_id ON events_new(bloco_id);
CREATE INDEX IF NOT EXISTS idx_events_new_city_id ON events_new(city_id);
CREATE INDEX IF NOT EXISTS idx_events_new_datetime ON events_new(start_datetime);
CREATE INDEX IF NOT EXISTS idx_events_new_type_status ON events_new(event_type, event_status);
CREATE INDEX IF NOT EXISTS idx_events_new_featured ON events_new(is_featured) WHERE is_featured = true;

-- Enhanced indexes for URL-based queries
CREATE INDEX IF NOT EXISTS idx_events_new_city_date_type ON events_new(city_id, DATE(start_datetime), event_type);
CREATE INDEX IF NOT EXISTS idx_events_new_bloco_date_type ON events_new(bloco_id, DATE(start_datetime), event_type);
CREATE INDEX IF NOT EXISTS idx_events_new_date_type ON events_new(DATE(start_datetime), event_type);

-- Critical composite index for full URL query optimization
CREATE INDEX IF NOT EXISTS idx_events_new_url_lookup ON events_new(city_id, DATE(start_datetime), event_type, bloco_id);

-- Step 8: Create the event URL view (based on schema.md)
CREATE OR REPLACE VIEW event_url_view AS
SELECT
    e.*,
    c.slug as city_slug,
    c.name as city_name,
    b.slug as bloco_slug,
    b.name as bloco_name,
    DATE(e.start_datetime) as event_date,
    -- Pre-computed URL components for faster queries
    EXTRACT(YEAR FROM e.start_datetime) as event_year,
    EXTRACT(MONTH FROM e.start_datetime) as event_month,
    EXTRACT(DAY FROM e.start_datetime) as event_day
FROM events_new e
LEFT JOIN cities c ON e.city_id = c.id
LEFT JOIN blocos b ON e.bloco_id = b.id
WHERE e.is_draft = false;

-- Step 9: Create localization function for event types
CREATE OR REPLACE FUNCTION get_localized_event_type(
    event_type_value event_type,
    locale VARCHAR(2)
) RETURNS VARCHAR AS $$
BEGIN
    RETURN CASE
        WHEN locale = 'pt' THEN
            CASE event_type_value
                WHEN 'parade' THEN 'desfile'
                WHEN 'rehearsal' THEN 'ensaio'
                WHEN 'party' THEN 'festa'
                WHEN 'workshop' THEN 'workshop'
                WHEN 'meetup' THEN 'encontro'
                WHEN 'performance' THEN 'apresentacao'
                WHEN 'competition' THEN 'competicao'
                ELSE 'outro'
            END
        WHEN locale = 'fr' THEN
            CASE event_type_value
                WHEN 'parade' THEN 'defile'
                WHEN 'rehearsal' THEN 'repetition'
                WHEN 'party' THEN 'fete'
                WHEN 'workshop' THEN 'atelier'
                WHEN 'meetup' THEN 'rencontre'
                WHEN 'performance' THEN 'spectacle'
                WHEN 'competition' THEN 'concours'
                ELSE 'autre'
            END
        WHEN locale = 'es' THEN
            CASE event_type_value
                WHEN 'parade' THEN 'desfile'
                WHEN 'rehearsal' THEN 'ensayo'
                WHEN 'party' THEN 'fiesta'
                WHEN 'workshop' THEN 'taller'
                WHEN 'meetup' THEN 'encuentro'
                WHEN 'performance' THEN 'actuacion'
                WHEN 'competition' THEN 'competencia'
                ELSE 'otro'
            END
        ELSE -- Default to English
            event_type_value::VARCHAR
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 10: Create helper functions for URL-based queries
CREATE OR REPLACE FUNCTION get_event_by_url_components(
    p_city_slug VARCHAR,
    p_event_date DATE,
    p_event_type event_type,
    p_bloco_slug VARCHAR
) RETURNS TABLE(
    event_id UUID,
    event_title VARCHAR,
    event_type event_type,
    start_datetime TIMESTAMPTZ,
    city_name VARCHAR,
    bloco_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        euv.id,
        euv.title,
        euv.event_type,
        euv.start_datetime,
        euv.city_name,
        euv.bloco_name
    FROM event_url_view euv
    WHERE euv.city_slug = p_city_slug
      AND euv.event_date = p_event_date
      AND euv.event_type = p_event_type
      AND euv.bloco_slug = p_bloco_slug
      AND euv.event_status != 'cancelled';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_events_by_city_date_type(
    p_city_slug VARCHAR,
    p_event_date DATE,
    p_event_type event_type
) RETURNS TABLE(
    event_id UUID,
    event_title VARCHAR,
    bloco_name VARCHAR,
    bloco_slug VARCHAR,
    start_datetime TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        euv.id,
        euv.title,
        euv.bloco_name,
        euv.bloco_slug,
        euv.start_datetime
    FROM event_url_view euv
    WHERE euv.city_slug = p_city_slug
      AND euv.event_date = p_event_date
      AND euv.event_type = p_event_type
      AND euv.event_status != 'cancelled'
    ORDER BY euv.start_datetime;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Update search vectors for full-text search
UPDATE events_new SET search_vector = to_tsvector('portuguese', 
    COALESCE(title, '') || ' ' || 
    COALESCE(description_pt, '') || ' ' ||
    COALESCE(location_name, '') || ' ' ||
    event_type::text
) WHERE search_vector IS NULL;

-- Step 12: Create trigger to automatically update search_vector
CREATE OR REPLACE FUNCTION update_events_search_vector() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := to_tsvector('portuguese', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.description_pt, '') || ' ' ||
        COALESCE(NEW.location_name, '') || ' ' ||
        NEW.event_type::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_new_search_vector_update 
    BEFORE INSERT OR UPDATE ON events_new
    FOR EACH ROW EXECUTE FUNCTION update_events_search_vector();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- 
-- Next steps:
-- 1. Verify data integrity: SELECT COUNT(*) FROM events_new;
-- 2. Test URL-based queries with the new functions
-- 3. If everything looks good, uncomment the DROP and RENAME statements
-- 4. Update application code to use the new events table structure
--
-- Rollback plan:
-- If something goes wrong, restore from backup tables:
-- DROP TABLE events_new;
-- CREATE TABLE events_new AS SELECT * FROM events_new_backup;
-- ===================================================== 