# **Data Migration Patterns Document**

## **🔄 Identified Migration Patterns**

Based on the database assessment, here are the specific data migration patterns needed to transform the current database to match the target schema from `#3 schema.md`.

---

## **📊 Current vs Target Schema Comparison**

### **1. Blocos Table Migration**

#### **✅ Fields That Already Match**

- `id`, `name`, `slug` ✅
- `short_description_pt/en/fr/es` ✅
- `long_description_pt/en/fr/es` ✅
- `image_url`, `cover_image_url` ✅
- `social_links`, `music_links` (JSON) ✅
- `followers_count`, `avg_participants` ✅
- `is_draft`, `is_featured`, `is_verified` ✅
- `created_at` ✅

#### **🔄 Fields Requiring Migration**

```sql
-- Pattern 1: Add missing fields with defaults
ALTER TABLE blocos
ADD COLUMN IF NOT EXISTS primary_city_id UUID,
ADD COLUMN IF NOT EXISTS coordinates JSONB,
ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Pattern 2: Extract from existing data
UPDATE blocos SET founded_year = founding_year WHERE founding_year IS NOT NULL;

-- Pattern 3: Derive primary_city_id from blocos_cities relationship
UPDATE blocos SET primary_city_id = (
  SELECT city_id
  FROM blocos_cities bc
  WHERE bc.bloco_id = blocos.id
  AND bc.is_primary = true
  LIMIT 1
);

-- Pattern 4: Split JSON social_links into separate columns
UPDATE blocos SET
  facebook_url = social_links->>'facebook',
  instagram_url = social_links->>'instagram',
  twitter_url = social_links->>'twitter',
  tiktok_url = social_links->>'tiktok',
  youtube_channel_url = social_links->>'youtube'
WHERE social_links IS NOT NULL;

-- Pattern 5: Split JSON music_links into separate columns
UPDATE blocos SET
  spotify_profile_url = music_links->>'spotify',
  spotify_playlist_url = music_links->>'spotify_playlist',
  deezer_url = music_links->>'deezer',
  soundcloud_url = music_links->>'soundcloud',
  bandcamp_url = music_links->>'bandcamp'
WHERE music_links IS NOT NULL;
```

#### **🗑️ Fields to Deprecate**

- `profile_image_url` → Use `image_url` instead
- `content_status` → Use `is_draft` instead
- `last_updated` → Use `updated_at` instead
- `location` → Use `primary_city_id` instead
- `location_visible` → Not needed in new schema

---

### **2. Cities Table Migration**

#### **✅ Fields That Already Match**

- `id`, `name`, `state`, `state_code` ✅
- `coordinates` ✅
- `banner_url` ✅
- `is_hidden` ✅
- `created_at` ✅

#### **🔄 Fields Requiring Migration**

```sql
-- Pattern 6: Add missing fields for enhanced cities
ALTER TABLE cities
ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
ADD COLUMN IF NOT EXISTS country VARCHAR(2) DEFAULT 'BR',
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
ADD COLUMN IF NOT EXISTS carnival_season_start DATE,
ADD COLUMN IF NOT EXISTS carnival_season_end DATE,
ADD COLUMN IF NOT EXISTS description_pt TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Pattern 7: Generate slugs from city names
UPDATE cities SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'));

-- Pattern 8: Migrate carnival dates
UPDATE cities SET
  carnival_season_start = carnival_start_date,
  carnival_season_end = carnival_start_date + INTERVAL '7 days'
WHERE carnival_start_date IS NOT NULL;
```

#### **🗑️ Fields to Deprecate**

- `profile_fallback_url` → Not needed in new schema
- `cover_fallback_url` → Not needed in new schema

---

### **3. Events Table Complete Restructure**

#### **🚨 Major Migration Pattern: Complete Table Rebuild**

The current `events` table is too simple and needs to be completely restructured. The new table incorporates data from both `events` and `blocos_parades`.

```sql
-- Pattern 9: Create new events table with enhanced structure
CREATE TABLE events_new (
  -- [Full table definition from migration plan]
);

-- Pattern 10: Migrate from existing events table (minimal data)
INSERT INTO events_new (
  bloco_id, title, description_pt, start_datetime, end_datetime,
  city_id, location_name, coordinates, banner_url, external_url,
  external_url_text, is_featured, is_draft, created_at
)
SELECT
  bloco_id,
  title,
  description,
  start_date::timestamptz,
  end_date::timestamptz,
  city_id,
  location,
  coordinates,
  banner_url,
  url,
  url_text,
  is_featured,
  COALESCE(is_draft, false),
  created_at
FROM events;

-- Pattern 11: Migrate from blocos_parades (comprehensive data)
INSERT INTO events_new (
  bloco_id, title, event_type, start_datetime,
  city_id, location_name, concentration_location, dispersal_location,
  concentration_coordinates, dispersal_coordinates,
  concentration_time, dispersal_time, created_at
)
SELECT
  bp.bloco_id,
  COALESCE(bp.bloco_name, 'Parade Event') as title,
  'parade'::event_type,
  -- Combine date and time for start_datetime
  (bp.parade_date + COALESCE(bp.parade_time, '10:00'::time))::timestamptz,
  bp.cities_id,
  bp.comprehensive_location,
  bp.location_concentration,
  bp.location_dispersal,
  -- Build coordinates JSON from lat/lng
  CASE
    WHEN bp.concentration_latitude IS NOT NULL AND bp.concentration_longitude IS NOT NULL
    THEN jsonb_build_object('lat', bp.concentration_latitude, 'lng', bp.concentration_longitude)
    ELSE NULL
  END,
  CASE
    WHEN bp.dispersal_latitude IS NOT NULL AND bp.dispersal_longitude IS NOT NULL
    THEN jsonb_build_object('lat', bp.dispersal_latitude, 'lng', bp.dispersal_longitude)
    ELSE NULL
  END,
  -- Build concentration time
  (bp.parade_date + COALESCE(bp.concentration_time, '09:00'::time))::timestamptz,
  -- Build dispersal time
  (bp.parade_date + COALESCE(bp.dispersal_time, '14:00'::time))::timestamptz,
  bp.created_at
FROM blocos_parades bp
WHERE bp.bloco_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM events_new en
    WHERE en.bloco_id = bp.bloco_id
    AND DATE(en.start_datetime) = bp.parade_date
  );
```

---

### **4. Musical Genres Migration**

#### **✅ Current Structure is Good**

The `musical_genres` table already exists with basic structure.

#### **🔄 Enhancement Migration**

```sql
-- Pattern 12: Add multilingual descriptions to existing tables
ALTER TABLE musical_genres
ADD COLUMN IF NOT EXISTS description_pt TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT;

-- Pattern 13: Ensure slug generation
UPDATE musical_genres
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;
```

---

### **5. Bloco Types Migration**

#### **✅ Current Structure is Good**

The `blocos_types` table already exists.

#### **🔄 Enhancement Migration**

```sql
-- Pattern 14: Add multilingual descriptions
ALTER TABLE blocos_types
ADD COLUMN IF NOT EXISTS description_pt TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT;

-- Ensure proper slug format
UPDATE blocos_types
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;
```

---

## **🆕 New Tables Creation Patterns**

### **6. User System Tables (New)**

These tables don't exist and need to be created from scratch:

```sql
-- Pattern 15: Create user profiles extending Supabase auth
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  preferred_language VARCHAR(2) DEFAULT 'pt',
  preferred_cities UUID[] DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  location_sharing_enabled BOOLEAN DEFAULT false,
  profile_visibility VARCHAR(20) DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pattern 16: Migrate existing profiles data (if any)
INSERT INTO user_profiles (id, display_name, bio, avatar_url, created_at)
SELECT
  user_id,
  COALESCE(display_name, full_name, username),
  bio,
  avatar_url,
  created_at
FROM profiles p
WHERE EXISTS (SELECT 1 FROM auth.users au WHERE au.id = p.user_id);
```

### **7. User Social Features (New)**

```sql
-- Pattern 17: Create user-bloco follows
CREATE TABLE user_bloco_follows (
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  bloco_id UUID NOT NULL REFERENCES blocos(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT true,
  followed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, bloco_id)
);

-- Pattern 18: Migrate existing user_favorite_blocos data
INSERT INTO user_bloco_follows (user_id, bloco_id, followed_at)
SELECT user_id, bloco_id, created_at
FROM user_favorite_blocos ufb
WHERE EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = ufb.user_id)
  AND EXISTS (SELECT 1 FROM blocos b WHERE b.id = ufb.bloco_id);

-- Pattern 19: Create user saved events
CREATE TABLE user_saved_events (
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events_new(id) ON DELETE CASCADE,
  calendar_synced BOOLEAN DEFAULT false,
  reminder_enabled BOOLEAN DEFAULT true,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, event_id)
);

-- Pattern 20: Migrate existing user_agenda data
INSERT INTO user_saved_events (user_id, event_id, saved_at)
SELECT ua.user_id, en.id, ua.created_at
FROM user_agenda ua
JOIN events_new en ON en.id = ua.event_id  -- Will need mapping logic
WHERE EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = ua.user_id);
```

---

## **🔧 Data Quality Improvement Patterns**

### **8. Data Cleaning Patterns**

```sql
-- Pattern 21: Clean up duplicate events
WITH duplicate_events AS (
  SELECT bloco_id, DATE(start_datetime) as event_date, COUNT(*) as count
  FROM events_new
  GROUP BY bloco_id, DATE(start_datetime)
  HAVING COUNT(*) > 1
)
DELETE FROM events_new e1
WHERE EXISTS (
  SELECT 1 FROM events_new e2
  WHERE e2.bloco_id = e1.bloco_id
  AND DATE(e2.start_datetime) = DATE(e1.start_datetime)
  AND e2.id > e1.id  -- Keep the one with higher ID
);

-- Pattern 22: Normalize coordinates format
UPDATE blocos SET coordinates =
  jsonb_build_object(
    'lat', CAST(coordinates->>'latitude' AS float),
    'lng', CAST(coordinates->>'longitude' AS float)
  )
WHERE coordinates ? 'latitude' AND coordinates ? 'longitude';

-- Pattern 23: Clean up URL formats
UPDATE blocos SET
  facebook_url = 'https://facebook.com/' || facebook_url
WHERE facebook_url IS NOT NULL
  AND facebook_url NOT LIKE 'http%'
  AND facebook_url NOT LIKE 'https%';

UPDATE blocos SET
  instagram_url = 'https://instagram.com/' || instagram_url
WHERE instagram_url IS NOT NULL
  AND instagram_url NOT LIKE 'http%'
  AND instagram_url NOT LIKE 'https%';
```

### **9. Data Validation Patterns**

```sql
-- Pattern 24: Validate required relationships
-- Ensure all blocos have a primary city
UPDATE blocos SET primary_city_id = (
  SELECT city_id FROM blocos_cities bc
  WHERE bc.bloco_id = blocos.id
  LIMIT 1
)
WHERE primary_city_id IS NULL;

-- Pattern 25: Validate event dates
UPDATE events_new SET event_status = 'completed'
WHERE start_datetime < NOW() - INTERVAL '1 day'
  AND event_status = 'scheduled';

-- Pattern 26: Ensure all cities have slugs
UPDATE cities SET slug =
  lower(regexp_replace(
    regexp_replace(name, '[áàâãä]', 'a', 'g'),
    '[^a-z0-9]+', '-', 'g'
  ))
WHERE slug IS NULL;
```

---

## **🔄 Post-Migration Cleanup Patterns**

### **10. Legacy Table Cleanup**

```sql
-- Pattern 27: Archive legacy tables before dropping
CREATE SCHEMA IF NOT EXISTS legacy_archive;

-- Move old tables to archive schema
ALTER TABLE events SET SCHEMA legacy_archive;
ALTER TABLE blocos_parades SET SCHEMA legacy_archive;

-- Drop archived tables after validation (future step)
-- DROP TABLE legacy_archive.events;
-- DROP TABLE legacy_archive.blocos_parades;

-- Pattern 28: Rename new table to final name
ALTER TABLE events_new RENAME TO events;

-- Pattern 29: Remove deprecated columns after validation
-- ALTER TABLE blocos DROP COLUMN profile_image_url;
-- ALTER TABLE blocos DROP COLUMN content_status;
-- ALTER TABLE blocos DROP COLUMN last_updated;
```

---

## **📊 Data Migration Validation Patterns**

### **11. Validation Queries**

```sql
-- Pattern 30: Record count validation
SELECT
  'blocos' as table_name,
  COUNT(*) as new_count,
  (SELECT COUNT(*) FROM backup_dec2024.blocos) as backup_count,
  COUNT(*) - (SELECT COUNT(*) FROM backup_dec2024.blocos) as difference
FROM blocos;

-- Pattern 31: Data integrity validation
SELECT
  'events' as table_name,
  COUNT(*) as total_events,
  COUNT(CASE WHEN bloco_id IS NULL THEN 1 END) as missing_bloco,
  COUNT(CASE WHEN start_datetime IS NULL THEN 1 END) as missing_datetime,
  COUNT(CASE WHEN city_id IS NULL THEN 1 END) as missing_city
FROM events;

-- Pattern 32: URL validation
SELECT
  'social_urls' as check_name,
  COUNT(*) as total_blocos,
  COUNT(CASE WHEN facebook_url LIKE 'http%' THEN 1 END) as valid_facebook,
  COUNT(CASE WHEN instagram_url LIKE 'http%' THEN 1 END) as valid_instagram
FROM blocos
WHERE facebook_url IS NOT NULL OR instagram_url IS NOT NULL;

-- Pattern 33: Relationship validation
SELECT
  'bloco_city_relationships' as check_name,
  COUNT(DISTINCT b.id) as total_blocos,
  COUNT(DISTINCT CASE WHEN bc.city_id IS NOT NULL THEN b.id END) as blocos_with_cities,
  COUNT(DISTINCT b.id) - COUNT(DISTINCT CASE WHEN bc.city_id IS NOT NULL THEN b.id END) as orphaned_blocos
FROM blocos b
LEFT JOIN blocos_cities bc ON b.id = bc.bloco_id;
```

---

## **🚀 Performance Optimization Patterns**

### **12. Index Creation Patterns**

```sql
-- Pattern 34: URL-optimized indexes
CREATE INDEX CONCURRENTLY idx_events_url_lookup
ON events(city_id, DATE(start_datetime), event_type, bloco_id);

CREATE INDEX CONCURRENTLY idx_cities_slug ON cities(slug);
CREATE INDEX CONCURRENTLY idx_blocos_slug ON blocos(slug);

-- Pattern 35: Search optimization indexes
CREATE INDEX CONCURRENTLY idx_blocos_search
ON blocos USING gin(to_tsvector('portuguese', name || ' ' || COALESCE(long_description_pt, '')));

CREATE INDEX CONCURRENTLY idx_events_datetime ON events(start_datetime);
CREATE INDEX CONCURRENTLY idx_events_status ON events(event_status) WHERE event_status != 'completed';

-- Pattern 36: Foreign key indexes
CREATE INDEX CONCURRENTLY idx_events_bloco_id ON events(bloco_id);
CREATE INDEX CONCURRENTLY idx_events_city_id ON events(city_id);
CREATE INDEX CONCURRENTLY idx_blocos_primary_city ON blocos(primary_city_id);
```

---

## **⚡ Execution Order & Dependencies**

### **Migration Phases Order**

1. **Phase 1**: Backup & Schema Foundation
   - Patterns 1-8: Basic table enhancements
2. **Phase 2**: Data Migration
   - Patterns 9-14: Core data transformations
3. **Phase 3**: New Features
   - Patterns 15-20: User system creation
4. **Phase 4**: Data Quality
   - Patterns 21-26: Cleanup & validation
5. **Phase 5**: Performance & Cleanup
   - Patterns 27-36: Optimization & finalization

### **Dependencies Map**

```
backup_dec2024 schema → All migration patterns
blocos enhancements → events_new creation
cities enhancements → events_new creation
events_new → user_saved_events
user_profiles → user_bloco_follows, user_saved_events
All tables ready → indexes creation
```

This migration pattern document provides the detailed roadmap for transforming your current database to match the target schema while preserving all existing data and maintaining referential integrity.
