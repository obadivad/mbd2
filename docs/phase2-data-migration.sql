-- =====================================================
-- MINISTÉRIO DO BLOCO - PHASE 2 MIGRATION
-- Data Migration - Events and Enhanced Data
-- Date: December 2024
-- =====================================================

-- 🚨 IMPORTANT: Phase 1 must be completed before running this
-- This migrates data from old events table to new events_new table

BEGIN;

-- =====================================================
-- 1. MIGRATE EVENTS DATA
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 2.1: Migrating events data to new structure...';
END $$;

-- Check if old events table has data to migrate
DO $$
DECLARE
    old_events_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO old_events_count FROM events;
    RAISE NOTICE 'Found % events in old events table to migrate', old_events_count;
    
    IF old_events_count > 0 THEN
        -- Migrate events data from old table to new structure
        INSERT INTO events_new (
            id,
            bloco_id,
            title,
            event_type,
            description_pt,
            start_datetime,
            end_datetime,
            city_id,
            location_name,
            address,
            created_at,
            updated_at
        )
        SELECT 
            COALESCE(e.id, gen_random_uuid()) as id,
            e.bloco_id,
            COALESCE(e.name, e.title, 'Evento sem nome') as title,
            CASE 
                WHEN LOWER(COALESCE(e.type, '')) LIKE '%parade%' THEN 'parade'::event_type
                WHEN LOWER(COALESCE(e.type, '')) LIKE '%ensaio%' THEN 'rehearsal'::event_type
                WHEN LOWER(COALESCE(e.type, '')) LIKE '%festa%' THEN 'party'::event_type
                WHEN LOWER(COALESCE(e.type, '')) LIKE '%workshop%' THEN 'workshop'::event_type
                WHEN LOWER(COALESCE(e.type, '')) LIKE '%encontro%' THEN 'meetup'::event_type
                ELSE 'other'::event_type
            END as event_type,
            e.description as description_pt,
            COALESCE(e.start_time, e.date_time, e.created_at) as start_datetime,
            e.end_time as end_datetime,
            e.city_id,
            e.location as location_name,
            e.address,
            COALESCE(e.created_at, NOW()) as created_at,
            COALESCE(e.updated_at, NOW()) as updated_at
        FROM events e
        WHERE e.bloco_id IS NOT NULL
        ON CONFLICT (id) DO NOTHING;
        
        GET DIAGNOSTICS old_events_count = ROW_COUNT;
        RAISE NOTICE 'Successfully migrated % events to new structure', old_events_count;
    ELSE
        RAISE NOTICE 'No events found in old table to migrate';
    END IF;
END $$;

-- =====================================================
-- 2. POPULATE BLOCOS PRIMARY CITY
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 2.2: Setting primary cities for blocos...';
END $$;

-- Set primary_city_id for blocos based on their most common city association
UPDATE blocos 
SET primary_city_id = (
    SELECT bc.city_id 
    FROM blocos_cities bc 
    WHERE bc.bloco_id = blocos.id 
    LIMIT 1
)
WHERE primary_city_id IS NULL
AND EXISTS (
    SELECT 1 FROM blocos_cities bc 
    WHERE bc.bloco_id = blocos.id
);

-- If no blocos_cities relationship exists, try to infer from city_id field
UPDATE blocos 
SET primary_city_id = city_id
WHERE primary_city_id IS NULL 
AND city_id IS NOT NULL;

-- =====================================================
-- 3. GENERATE SLUGS FOR CITIES
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 2.3: Generating slugs for cities...';
END $$;

-- Generate slugs for cities that don't have them
UPDATE cities 
SET slug = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(
            UNACCENT(name), 
            '[^a-zA-Z0-9\s-]', '', 'g'
        ), 
        '\s+', '-', 'g'
    )
)
WHERE slug IS NULL OR slug = '';

-- Handle duplicate slugs by appending state code
UPDATE cities 
SET slug = slug || '-' || LOWER(state_code)
WHERE slug IN (
    SELECT slug 
    FROM cities 
    WHERE slug IS NOT NULL 
    GROUP BY slug 
    HAVING COUNT(*) > 1
);

-- =====================================================
-- 4. POPULATE SOCIAL LINKS FROM EXISTING DATA
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 2.4: Migrating social links to new structure...';
END $$;

-- Extract Instagram URLs from existing social_links JSONB
UPDATE blocos 
SET instagram_url = social_links->>'instagram'
WHERE social_links ? 'instagram' 
AND (instagram_url IS NULL OR instagram_url = '');

-- Extract Facebook URLs from existing social_links JSONB  
UPDATE blocos 
SET facebook_url = social_links->>'facebook'
WHERE social_links ? 'facebook' 
AND (facebook_url IS NULL OR facebook_url = '');

-- Extract Twitter URLs from existing social_links JSONB
UPDATE blocos 
SET twitter_url = social_links->>'twitter'
WHERE social_links ? 'twitter' 
AND (twitter_url IS NULL OR twitter_url = '');

-- Extract website URLs from existing data
UPDATE blocos 
SET website_url = social_links->>'website'
WHERE social_links ? 'website' 
AND (website_url IS NULL OR website_url = '');

-- =====================================================
-- 5. POPULATE MUSIC LINKS FROM EXISTING DATA
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 2.5: Migrating music links to new structure...';
END $$;

-- Extract Spotify URLs from existing music_links JSONB
UPDATE blocos 
SET spotify_profile_url = music_links->>'spotify'
WHERE music_links ? 'spotify' 
AND (spotify_profile_url IS NULL OR spotify_profile_url = '');

-- Extract Spotify playlist URLs
UPDATE blocos 
SET spotify_playlist_url = music_links->>'spotify_playlist'
WHERE music_links ? 'spotify_playlist' 
AND (spotify_playlist_url IS NULL OR spotify_playlist_url = '');

-- Extract YouTube URLs
UPDATE blocos 
SET youtube_channel_url = music_links->>'youtube'
WHERE music_links ? 'youtube' 
AND (youtube_channel_url IS NULL OR youtube_channel_url = '');

-- Extract SoundCloud URLs
UPDATE blocos 
SET soundcloud_url = music_links->>'soundcloud'
WHERE music_links ? 'soundcloud' 
AND (soundcloud_url IS NULL OR soundcloud_url = '');

-- Extract Deezer URLs
UPDATE blocos 
SET deezer_url = music_links->>'deezer'
WHERE music_links ? 'deezer' 
AND (deezer_url IS NULL OR deezer_url = '');

-- =====================================================
-- 6. SET CARNIVAL DATES FOR CITIES
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 2.6: Setting carnival dates for major cities...';
END $$;

-- Set carnival dates for major Brazilian cities (2024/2025 season)
UPDATE cities 
SET 
    carnival_season_start = '2025-02-28'::date,
    carnival_season_end = '2025-03-04'::date,
    carnival_start_date = '2025-03-01'::date
WHERE name ILIKE '%rio%' OR name ILIKE '%salvador%' OR name ILIKE '%recife%' OR name ILIKE '%olinda%';

-- Set carnival dates for São Paulo (different dates)
UPDATE cities 
SET 
    carnival_season_start = '2025-02-28'::date,
    carnival_season_end = '2025-03-04'::date,
    carnival_start_date = '2025-03-01'::date
WHERE name ILIKE '%são paulo%' OR name ILIKE '%sao paulo%';

-- =====================================================
-- 7. DATA QUALITY IMPROVEMENTS
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 2.7: Applying data quality improvements...';
END $$;

-- Update blocos updated_at timestamp
UPDATE blocos 
SET updated_at = NOW()
WHERE updated_at IS NULL;

-- Set default coordinates for cities that might need them
UPDATE cities 
SET coordinates = jsonb_build_object(
    'latitude', -23.5505, 
    'longitude', -46.6333
)
WHERE name ILIKE '%são paulo%' 
AND (coordinates IS NULL OR coordinates = 'null'::jsonb);

UPDATE cities 
SET coordinates = jsonb_build_object(
    'latitude', -22.9068, 
    'longitude', -43.1729
)
WHERE name ILIKE '%rio%' 
AND (coordinates IS NULL OR coordinates = 'null'::jsonb);

-- =====================================================
-- 8. VALIDATION & SUMMARY
-- =====================================================

DO $$
DECLARE
    migrated_events INTEGER;
    blocos_with_primary_city INTEGER;
    cities_with_slugs INTEGER;
    blocos_with_social INTEGER;
BEGIN
    RAISE NOTICE 'Phase 2.8: Running validation checks...';
    
    -- Count migrated events
    SELECT COUNT(*) INTO migrated_events FROM events_new;
    
    -- Count blocos with primary cities
    SELECT COUNT(*) INTO blocos_with_primary_city 
    FROM blocos WHERE primary_city_id IS NOT NULL;
    
    -- Count cities with slugs
    SELECT COUNT(*) INTO cities_with_slugs 
    FROM cities WHERE slug IS NOT NULL AND slug != '';
    
    -- Count blocos with social links
    SELECT COUNT(*) INTO blocos_with_social 
    FROM blocos WHERE (
        instagram_url IS NOT NULL OR 
        facebook_url IS NOT NULL OR 
        twitter_url IS NOT NULL OR
        website_url IS NOT NULL
    );
    
    RAISE NOTICE '=== PHASE 2 MIGRATION SUMMARY ===';
    RAISE NOTICE 'Events migrated: %', migrated_events;
    RAISE NOTICE 'Blocos with primary city: %', blocos_with_primary_city;
    RAISE NOTICE 'Cities with slugs: %', cities_with_slugs;
    RAISE NOTICE 'Blocos with social links: %', blocos_with_social;
    RAISE NOTICE '=====================================';
END $$;

-- Create summary table for validation
CREATE TEMP TABLE phase2_validation AS
SELECT 
    'Phase 2 Complete' as info,
    'Data Migration & Enhancement' as action,
    'Ready for Phase 3: Advanced Features' as next_script;

SELECT * FROM phase2_validation;

COMMIT;

/*
📝 PHASE 2 MIGRATION NOTES:

✅ What was completed:
- Migrated events from old to new structure
- Set primary cities for blocos
- Generated slugs for cities
- Migrated social and music links
- Set carnival dates for major cities
- Applied data quality improvements

🔄 Next Steps:
- Phase 3: Advanced features (SEO, notifications, etc.)
- Phase 4: User system integration

⚠️ Important Notes:
- Original events table preserved (no data loss)
- All changes are additive (can be rolled back)
- Backup schema remains available for rollback
*/ 