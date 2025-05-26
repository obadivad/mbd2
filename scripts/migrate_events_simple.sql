-- =====================================================
-- MINISTÉRIO DO BLOCO - SIMPLIFIED EVENTS MIGRATION
-- =====================================================

-- Step 1: Clear events_new table
DELETE FROM events_new;

-- Step 2: Migrate blocos_parades data (simplified version)
INSERT INTO events_new (
    bloco_id,
    title,
    event_type,
    event_status,
    start_datetime,
    city_id,
    location_name,
    concentration_location,
    concentration_coordinates,
    dispersal_location,
    dispersal_coordinates,
    is_draft,
    is_featured
)
SELECT 
    bp.bloco_id,
    COALESCE(bp.bloco_name, 'Bloco') || ' - Desfile' as title,
    'parade'::event_type,
    'scheduled'::event_status,
    bp.parade_date,
    bp.cities_id,
    bp.location_concentration,
    bp.location_concentration,
    bp.concentration_coordinates,
    bp.location_dispersal,
    bp.dispersal_coordinates,
    false as is_draft,
    false as is_featured
FROM blocos_parades bp
WHERE bp.bloco_id IS NOT NULL 
  AND bp.parade_date IS NOT NULL;

-- Step 3: Create basic indexes
CREATE INDEX IF NOT EXISTS idx_events_new_bloco_id ON events_new(bloco_id);
CREATE INDEX IF NOT EXISTS idx_events_new_city_id ON events_new(city_id);
CREATE INDEX IF NOT EXISTS idx_events_new_datetime ON events_new(start_datetime);
CREATE INDEX IF NOT EXISTS idx_events_new_type_status ON events_new(event_type, event_status);

-- Step 4: Create the event URL view
CREATE OR REPLACE VIEW event_url_view AS
SELECT
    e.*,
    c.slug as city_slug,
    c.name as city_name,
    b.slug as bloco_slug,
    b.name as bloco_name,
    DATE(e.start_datetime) as event_date
FROM events_new e
LEFT JOIN cities c ON e.city_id = c.id
LEFT JOIN blocos b ON e.bloco_id = b.id
WHERE e.is_draft = false;

-- Step 5: Create localization function
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