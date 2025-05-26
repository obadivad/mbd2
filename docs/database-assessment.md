# **Database Assessment & Migration Plan**

## **🔍 Current Database Assessment (December 2024)**

### **📊 Current Database Overview**

**Tables Discovered:** 51 tables
**Core Data:**

- **1,802 blocos** (main content)
- **1 event** (minimal events data)
- **20 cities** (location data)
- **0 profiles** (user system not populated)

### **🏗️ Current Schema Analysis**

#### **✅ Tables That Align Well with Target Schema**

1. **`blocos`** - ✅ **Good alignment**

   - Has multilingual fields (pt, en, fr, es)
   - Missing: `primary_city_id`, `coordinates`, separate social media fields
   - Extra: `profile_image_url`, `content_status`, `last_updated`

2. **`cities`** - ✅ **Good foundation**

   - Missing: `slug`, `timezone`, `carnival_season_start/end`, multilingual descriptions
   - Extra: `profile_fallback_url`, `cover_fallback_url`

3. **`events`** - ⚠️ **Needs major restructuring**
   - Missing: `event_type` enum, `event_status` enum, multilingual descriptions
   - Missing: Parade-specific fields, enhanced URL support
   - Current structure too basic

#### **⚠️ Tables That Need Updates/Migration**

1. **`blocos_parades`** - Should migrate to enhanced `events` table
2. **`blocos_cities`** - ✅ Already exists, needs `is_primary` logic
3. **`musical_genres`** - ✅ Exists, needs multilingual descriptions
4. **`blocos_types`** - ✅ Exists, needs multilingual descriptions

#### **❌ Missing Critical Tables**

1. **User system tables** (from target schema):

   - `user_profiles` (extends Supabase auth)
   - `user_bloco_follows`
   - `user_saved_events`
   - `user_connections`

2. **Enhanced event system**:

   - Missing `event_type` and `event_status` enums
   - Missing event URL optimization views
   - Missing localization functions

3. **Real-time features**:

   - `user_location_sessions`
   - `user_locations` (different from current)
   - `chat_rooms`, `chat_participants`, `chat_messages`

4. **Content management**:
   - `articles` (blog/editorial)

#### **🗑️ Legacy/Redundant Tables**

Tables that seem to be legacy or specific to old systems:

- `pages`, `pages_links`, `links_links` (CMS-related)
- `users` (separate from Supabase auth)
- `settings`, `seo_settings` (can be consolidated)

---

## **💾 Database Backup Strategy**

### **1. Pre-Migration Backup Plan**

```sql
-- 🚨 CRITICAL: Create full database backup before any changes
-- Run this command in your Supabase SQL editor or via pg_dump

-- Export current schema structure
CREATE SCHEMA backup_dec2024;

-- Backup critical tables with data
CREATE TABLE backup_dec2024.blocos AS SELECT * FROM public.blocos;
CREATE TABLE backup_dec2024.cities AS SELECT * FROM public.cities;
CREATE TABLE backup_dec2024.events AS SELECT * FROM public.events;
CREATE TABLE backup_dec2024.blocos_parades AS SELECT * FROM public.blocos_parades;
CREATE TABLE backup_dec2024.blocos_cities AS SELECT * FROM public.blocos_cities;
CREATE TABLE backup_dec2024.musical_genres AS SELECT * FROM public.musical_genres;
CREATE TABLE backup_dec2024.blocos_types AS SELECT * FROM public.blocos_types;

-- Backup relationship tables
CREATE TABLE backup_dec2024.bloco_genres AS SELECT * FROM public.bloco_genres;
CREATE TABLE backup_dec2024.blocos_types_relations AS SELECT * FROM public.blocos_types_relations;
```

### **2. Data Export for External Backup**

```bash
# Export key data to JSON files for extra safety
psql $DATABASE_URL -c "COPY (SELECT * FROM blocos) TO STDOUT WITH CSV HEADER" > backup_blocos_$(date +%Y%m%d).csv
psql $DATABASE_URL -c "COPY (SELECT * FROM cities) TO STDOUT WITH CSV HEADER" > backup_cities_$(date +%Y%m%d).csv
psql $DATABASE_URL -c "COPY (SELECT * FROM blocos_parades) TO STDOUT WITH CSV HEADER" > backup_events_$(date +%Y%m%d).csv
```

---

## **🔄 Migration Plan to Target Schema**

### **Phase 1: Schema Foundation (PRIORITY 1)**

#### **1.1 Update Core Tables**

```sql
-- Add missing fields to blocos table
ALTER TABLE blocos
ADD COLUMN IF NOT EXISTS primary_city_id UUID REFERENCES cities(id),
ADD COLUMN IF NOT EXISTS coordinates JSONB,
ADD COLUMN IF NOT EXISTS media_urls TEXT[],
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS tiktok_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_channel_url TEXT,
ADD COLUMN IF NOT EXISTS spotify_profile_url TEXT,
ADD COLUMN IF NOT EXISTS spotify_playlist_url TEXT,
ADD COLUMN IF NOT EXISTS deezer_url TEXT,
ADD COLUMN IF NOT EXISTS soundcloud_url TEXT,
ADD COLUMN IF NOT EXISTS bandcamp_url TEXT,
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add missing fields to cities table
ALTER TABLE cities
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS country VARCHAR(2) DEFAULT 'BR',
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
ADD COLUMN IF NOT EXISTS carnival_season_start DATE,
ADD COLUMN IF NOT EXISTS carnival_season_end DATE,
ADD COLUMN IF NOT EXISTS description_pt TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
```

#### **1.2 Create Essential Enums**

```sql
-- Create event types enum
CREATE TYPE event_type AS ENUM (
  'parade', 'rehearsal', 'performance', 'workshop',
  'party', 'meetup', 'competition', 'other'
);

-- Create event status enum
CREATE TYPE event_status AS ENUM (
  'scheduled', 'confirmed', 'cancelled', 'postponed', 'completed'
);
```

#### **1.3 Rebuild Events Table**

```sql
-- Create new events table structure
CREATE TABLE events_new (
  -- Primary fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bloco_id UUID NOT NULL REFERENCES blocos(id) ON DELETE CASCADE,

  -- Event details
  title VARCHAR(255) NOT NULL,
  event_type event_type NOT NULL DEFAULT 'parade',
  event_status event_status DEFAULT 'scheduled',

  -- Multilingual descriptions
  description_pt TEXT,
  description_en TEXT,
  description_fr TEXT,
  description_es TEXT,

  -- Date & time
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT false,

  -- Location details
  city_id UUID REFERENCES cities(id),
  location_name TEXT,
  address TEXT,
  coordinates JSONB,

  -- Parade-specific fields
  concentration_location TEXT,
  concentration_coordinates JSONB,
  concentration_time TIMESTAMPTZ,
  dispersal_location TEXT,
  dispersal_coordinates JSONB,
  dispersal_time TIMESTAMPTZ,

  -- Media & links
  banner_url TEXT,
  external_url TEXT,
  external_url_text TEXT,

  -- Metadata
  expected_participants INTEGER,
  ticket_required BOOLEAN DEFAULT false,
  ticket_price DECIMAL(10,2),

  -- Status flags
  is_draft BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Phase 2: Data Migration (PRIORITY 1)**

#### **2.1 Migrate Existing Events Data**

```sql
-- Migrate from old events table
INSERT INTO events_new (
  bloco_id, title, description_pt, start_datetime, end_datetime,
  city_id, location_name, coordinates, banner_url, external_url,
  external_url_text, is_featured, is_draft, created_at
)
SELECT
  bloco_id,
  title,
  description,
  start_date,
  end_date,
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

-- Migrate from blocos_parades (more comprehensive data)
INSERT INTO events_new (
  bloco_id, title, event_type, start_datetime,
  city_id, location_name, concentration_location, dispersal_location,
  concentration_time, dispersal_time, created_at
)
SELECT
  bp.bloco_id,
  COALESCE(bp.bloco_name, 'Parade Event'),
  'parade'::event_type,
  -- Combine date and time
  (bp.parade_date + COALESCE(bp.parade_time, '10:00'::time))::timestamptz,
  bp.cities_id,
  bp.comprehensive_location,
  bp.location_concentration,
  bp.location_dispersal,
  (bp.parade_date + COALESCE(bp.concentration_time, '09:00'::time))::timestamptz,
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

#### **2.2 Migrate Social Media Data**

```sql
-- Extract social media links from JSON to separate columns
UPDATE blocos SET
  facebook_url = social_links->>'facebook',
  instagram_url = social_links->>'instagram',
  twitter_url = social_links->>'twitter',
  youtube_channel_url = social_links->>'youtube'
WHERE social_links IS NOT NULL;

-- Extract music links from JSON to separate columns
UPDATE blocos SET
  spotify_profile_url = music_links->>'spotify',
  spotify_playlist_url = music_links->>'spotify_playlist',
  deezer_url = music_links->>'deezer',
  soundcloud_url = music_links->>'soundcloud'
WHERE music_links IS NOT NULL;
```

### **Phase 3: Enhanced Features (PRIORITY 2)**

#### **3.1 Create URL Optimization Views**

```sql
-- City slugs generation
UPDATE cities SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'));

-- Event URL optimization view
CREATE VIEW event_url_view AS
SELECT
    e.*,
    c.slug as city_slug,
    c.name as city_name,
    b.slug as bloco_slug,
    b.name as bloco_name,
    DATE(e.start_datetime) as event_date,
    EXTRACT(YEAR FROM e.start_datetime) as event_year,
    EXTRACT(MONTH FROM e.start_datetime) as event_month,
    EXTRACT(DAY FROM e.start_datetime) as event_day
FROM events_new e
LEFT JOIN cities c ON e.city_id = c.id
LEFT JOIN blocos b ON e.bloco_id = b.id
WHERE e.is_draft = false;
```

#### **3.2 Add Performance Indexes**

```sql
-- Critical indexes for URL-based queries
CREATE INDEX idx_events_city_date_type ON events_new(city_id, DATE(start_datetime), event_type);
CREATE INDEX idx_events_bloco_date_type ON events_new(bloco_id, DATE(start_datetime), event_type);
CREATE INDEX idx_events_url_lookup ON events_new(city_id, DATE(start_datetime), event_type, bloco_id);

-- City slug index
CREATE INDEX idx_cities_slug ON cities(slug);

-- Bloco search optimization
CREATE INDEX idx_blocos_search ON blocos USING gin(to_tsvector('portuguese', name || ' ' || COALESCE(long_description_pt, '')));
```

### **Phase 4: User System (PRIORITY 3)**

#### **4.1 Create User Profile System**

```sql
-- User profiles extending Supabase auth
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

-- User bloco follows
CREATE TABLE user_bloco_follows (
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  bloco_id UUID NOT NULL REFERENCES blocos(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT true,
  followed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, bloco_id)
);

-- User saved events
CREATE TABLE user_saved_events (
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events_new(id) ON DELETE CASCADE,
  calendar_synced BOOLEAN DEFAULT false,
  reminder_enabled BOOLEAN DEFAULT true,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, event_id)
);
```

---

## **🚨 Rollback Strategy**

### **Emergency Rollback Plan**

```sql
-- Step 1: Drop new tables if migration fails
DROP TABLE IF EXISTS events_new CASCADE;
DROP VIEW IF EXISTS event_url_view CASCADE;

-- Step 2: Restore from backup schema
CREATE TABLE events AS SELECT * FROM backup_dec2024.events;
CREATE TABLE blocos AS SELECT * FROM backup_dec2024.blocos;
-- ... restore other tables as needed

-- Step 3: Restore original constraints and indexes
-- (Would need to be documented during migration)
```

### **Validation Queries**

```sql
-- Verify data integrity after migration
SELECT
  'blocos' as table_name,
  COUNT(*) as new_count,
  (SELECT COUNT(*) FROM backup_dec2024.blocos) as backup_count
FROM blocos
UNION ALL
SELECT
  'events' as table_name,
  COUNT(*) as new_count,
  (SELECT COUNT(*) FROM backup_dec2024.events) as backup_count
FROM events_new;

-- Check for data loss
SELECT COUNT(*) as total_events_migrated
FROM events_new
WHERE created_at < NOW() - INTERVAL '1 day';
```

---

## **📋 Implementation Checklist**

### **✅ Pre-Migration Tasks**

- [ ] Create backup schema with current data
- [ ] Export CSV backups of critical tables
- [ ] Document current constraints and indexes
- [ ] Test migration scripts on development database
- [ ] Prepare rollback procedures

### **🔄 Migration Execution**

- [ ] Phase 1: Schema foundation updates
- [ ] Phase 2: Data migration and validation
- [ ] Phase 3: Enhanced features and optimization
- [ ] Phase 4: User system implementation

### **🧪 Post-Migration Validation**

- [ ] Verify data integrity with validation queries
- [ ] Test URL generation and event lookups
- [ ] Performance test new indexes
- [ ] Update TypeScript types to match new schema
- [ ] Test application functionality end-to-end

### **📚 Documentation Updates**

- [ ] Update API documentation
- [ ] Update database schema documentation
- [ ] Update development setup instructions
- [ ] Document new query patterns and functions

---

## **⏱️ Estimated Timeline**

- **Phase 1 (Schema Foundation)**: 2-3 days
- **Phase 2 (Data Migration)**: 3-4 days
- **Phase 3 (Enhanced Features)**: 2-3 days
- **Phase 4 (User System)**: 4-5 days
- **Testing & Validation**: 2-3 days

**Total Estimated Time**: 13-18 days

---

## **🎯 Success Metrics**

1. **Zero data loss** - All existing blocos and events preserved
2. **Performance improvement** - Event queries 50%+ faster with new indexes
3. **URL functionality** - All event URLs working with new structure
4. **Type safety** - Updated TypeScript types match new schema
5. **Feature readiness** - Database ready for enhanced event URL structure and user features
