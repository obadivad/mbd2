# **Schema Design Document (Updated)**

## **Ministério do Bloco - Optimized Database Structure with Enhanced Event URLs**

Based on your current structure and requirements, here's the final optimized schema that supports the improved event URL structure:

---

## **1. Core Tables**

### **🎭 blocos** (Main Bloco Information)

```sql
CREATE TABLE blocos (
  -- Primary fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Multilingual content (separate columns for SEO)
  short_description_pt TEXT,
  short_description_en TEXT,
  short_description_fr TEXT,
  short_description_es TEXT,

  long_description_pt TEXT,
  long_description_en TEXT,
  long_description_fr TEXT,
  long_description_es TEXT,

  -- Location & geo data
  primary_city_id UUID REFERENCES cities(id),
  coordinates JSONB, -- {lat: number, lng: number}

  -- Media (simplified)
  image_url TEXT, -- Main profile image
  cover_image_url TEXT,
  media_urls TEXT[], -- Array of additional media

  -- Social media links (separate columns for type safety)
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  tiktok_url TEXT,
  youtube_channel_url TEXT,

  -- Music links (separate columns)
  spotify_profile_url TEXT,
  spotify_playlist_url TEXT,
  deezer_url TEXT,
  soundcloud_url TEXT,
  bandcamp_url TEXT,

  -- Stats & metadata
  followers_count INTEGER DEFAULT 0,
  avg_participants INTEGER,
  founded_year INTEGER,

  -- Status flags
  is_draft BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_blocos_slug ON blocos(slug);
CREATE INDEX idx_blocos_primary_city ON blocos(primary_city_id);
CREATE INDEX idx_blocos_featured ON blocos(is_featured) WHERE is_featured = true;
CREATE INDEX idx_blocos_search ON blocos USING gin(to_tsvector('portuguese', name || ' ' || COALESCE(long_description_pt, '')));
```

### **📅 events** (Unified Events with Enhanced URL Support)

```sql
-- Enhanced event types for better URL structure
CREATE TYPE event_type AS ENUM (
  'parade',      -- desfile/parade/défilé
  'rehearsal',   -- ensaio/rehearsal/répétition
  'performance', -- apresentação/performance/spectacle
  'workshop',    -- workshop/workshop/atelier
  'party',       -- festa/party/fête
  'meetup',      -- encontro/meetup/rencontre
  'competition', -- competição/competition/concours
  'other'        -- outro/other/autre
);

CREATE TYPE event_status AS ENUM ('scheduled', 'confirmed', 'cancelled', 'postponed', 'completed');

CREATE TABLE events (
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
  location_name TEXT, -- "Praça da República"
  address TEXT,
  coordinates JSONB, -- {lat: number, lng: number}

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

-- 🆕 Enhanced indexes for URL-based queries
CREATE INDEX idx_events_bloco_id ON events(bloco_id);
CREATE INDEX idx_events_city_id ON events(city_id);
CREATE INDEX idx_events_datetime ON events(start_datetime);
CREATE INDEX idx_events_type_status ON events(event_type, event_status);
CREATE INDEX idx_events_featured ON events(is_featured) WHERE is_featured = true;

-- 🎯 NEW: Indexes specifically for URL-based event lookups
CREATE INDEX idx_events_city_date_type ON events(city_id, DATE(start_datetime), event_type);
CREATE INDEX idx_events_bloco_date_type ON events(bloco_id, DATE(start_datetime), event_type);
CREATE INDEX idx_events_date_type ON events(DATE(start_datetime), event_type);

-- 🚀 CRITICAL: Composite index for full URL query optimization
CREATE INDEX idx_events_url_lookup ON events(city_id, DATE(start_datetime), event_type, bloco_id);
```

---

## **2. Location & Geography**

### **🏙️ cities** (Enhanced with Slug for URLs)

```sql
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL, -- 🆕 Added for URL generation
  state VARCHAR(255) NOT NULL,
  state_code VARCHAR(2) NOT NULL,
  country VARCHAR(2) DEFAULT 'BR',

  -- Geographic data
  coordinates JSONB, -- {lat: number, lng: number}
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',

  -- Carnival-specific
  carnival_season_start DATE,
  carnival_season_end DATE,

  -- Media & SEO
  banner_url TEXT,
  description_pt TEXT,
  description_en TEXT,
  description_fr TEXT, -- 🆕 Added French
  description_es TEXT, -- 🆕 Added Spanish

  -- Status
  is_hidden BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🆕 Index for city slug lookups
CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_cities_featured ON cities(is_featured) WHERE is_featured = true;
```

### **🌍 blocos_cities** (Multi-city Bloco Support)

```sql
-- This junction table is the BEST approach for blocos that perform in multiple cities
CREATE TABLE blocos_cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bloco_id UUID NOT NULL REFERENCES blocos(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false, -- One primary city per bloco

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(bloco_id, city_id)
);

CREATE INDEX idx_blocos_cities_bloco ON blocos_cities(bloco_id);
CREATE INDEX idx_blocos_cities_city ON blocos_cities(city_id);
CREATE INDEX idx_blocos_cities_primary ON blocos_cities(bloco_id, is_primary) WHERE is_primary = true;
```

---

## **3. 🆕 Event URL Optimization Views**

### **Event URL Lookup View (Performance Optimization)**

```sql
-- 🚀 Helper view for efficient event URL queries
CREATE VIEW event_url_view AS
SELECT
    e.*,
    c.slug as city_slug,
    c.name as city_name,
    b.slug as bloco_slug,
    b.name as bloco_name,
    DATE(e.start_datetime) as event_date,
    -- 🎯 Pre-computed URL components for faster queries
    EXTRACT(YEAR FROM e.start_datetime) as event_year,
    EXTRACT(MONTH FROM e.start_datetime) as event_month,
    EXTRACT(DAY FROM e.start_datetime) as event_day
FROM events e
LEFT JOIN cities c ON e.city_id = c.id
LEFT JOIN blocos b ON e.bloco_id = b.id
WHERE e.is_draft = false;

-- 🎯 Critical index for URL-based lookups
CREATE INDEX idx_event_url_view_lookup
ON event_url_view(city_slug, event_date, event_type, bloco_slug);

-- Additional performance indexes
CREATE INDEX idx_event_url_view_city_date
ON event_url_view(city_slug, event_date);

CREATE INDEX idx_event_url_view_city_type
ON event_url_view(city_slug, event_type);
```

### **Event Type Translation Function**

```sql
-- 🌐 Function for translating event types to different languages
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
```

---

## **4. Classification & Taxonomy**

### **🎵 musical_genres**

```sql
CREATE TABLE musical_genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Multilingual support
  description_pt TEXT,
  description_en TEXT,
  description_fr TEXT, -- 🆕 Added French
  description_es TEXT, -- 🆕 Added Spanish

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blocos_musical_genres (
  bloco_id UUID NOT NULL REFERENCES blocos(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES musical_genres(id) ON DELETE CASCADE,

  PRIMARY KEY (bloco_id, genre_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **🎪 bloco_types**

```sql
CREATE TABLE bloco_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Multilingual descriptions
  description_pt TEXT,
  description_en TEXT,
  description_fr TEXT, -- 🆕 Added French
  description_es TEXT, -- 🆕 Added Spanish

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blocos_types_relations (
  bloco_id UUID NOT NULL REFERENCES blocos(id) ON DELETE CASCADE,
  type_id UUID NOT NULL REFERENCES bloco_types(id) ON DELETE CASCADE,

  PRIMARY KEY (bloco_id, type_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## **5. User & Social Features**

### **👥 users** (Supabase Auth Integration)

```sql
-- Extends Supabase auth.users
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Profile information
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,

  -- Preferences
  preferred_language VARCHAR(2) DEFAULT 'pt',
  preferred_cities UUID[] DEFAULT '{}', -- Array of city IDs
  notification_settings JSONB DEFAULT '{}',

  -- Privacy settings
  location_sharing_enabled BOOLEAN DEFAULT false,
  profile_visibility VARCHAR(20) DEFAULT 'public', -- public, friends, private

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **👯 User Social Features**

```sql
-- Following blocos
CREATE TABLE user_bloco_follows (
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  bloco_id UUID NOT NULL REFERENCES blocos(id) ON DELETE CASCADE,

  notifications_enabled BOOLEAN DEFAULT true,
  followed_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, bloco_id)
);

-- Saved events (user's personal agenda)
CREATE TABLE user_saved_events (
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  calendar_synced BOOLEAN DEFAULT false,
  reminder_enabled BOOLEAN DEFAULT true,
  saved_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, event_id)
);

-- User connections (friend system)
CREATE TABLE user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(requester_id, addressee_id)
);
```

---

## **6. Real-time & Location Features**

### **📍 Real-time Location Sharing (Zenly-like)**

```sql
CREATE TABLE user_location_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Session details
  session_name VARCHAR(255), -- "Carnival Saturday"
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,

  -- Privacy settings
  visibility VARCHAR(20) DEFAULT 'friends', -- friends, specific_users, public
  shared_with_users UUID[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES user_location_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Location data
  coordinates JSONB NOT NULL, -- {lat: number, lng: number, accuracy: number}
  address TEXT,

  -- Context
  nearby_event_id UUID REFERENCES events(id),
  battery_level INTEGER, -- 0-100

  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for real-time queries
CREATE INDEX idx_user_locations_session ON user_locations(session_id, timestamp DESC);
CREATE INDEX idx_user_locations_recent ON user_locations(user_id, timestamp DESC);
```

### **💬 In-app Chat**

```sql
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  room_type VARCHAR(20) DEFAULT 'direct', -- direct, group, event_discussion

  -- Optional associations
  event_id UUID REFERENCES events(id),
  bloco_id UUID REFERENCES blocos(id),

  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_participants (
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (room_id, user_id)
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- text, image, location, event_share
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## **7. Content & Media**

### **📰 Blog & Editorial Content**

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content
  title_pt VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  title_fr VARCHAR(500),
  title_es VARCHAR(500),

  content_pt TEXT NOT NULL,
  content_en TEXT,
  content_fr TEXT,
  content_es TEXT,

  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt_pt TEXT,
  excerpt_en TEXT,
  excerpt_fr TEXT, -- 🆕 Added French
  excerpt_es TEXT, -- 🆕 Added Spanish

  -- Media
  featured_image_url TEXT,

  -- Associations
  author_id UUID REFERENCES user_profiles(id),
  related_blocos UUID[] DEFAULT '{}',
  related_cities UUID[] DEFAULT '{}',

  -- SEO & metadata
  meta_description_pt TEXT,
  meta_description_en TEXT,
  meta_description_fr TEXT, -- 🆕 Added French
  meta_description_es TEXT, -- 🆕 Added Spanish

  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## **8. 🆕 URL Generation & Performance**

### **Event URL Query Functions**

```sql
-- 🎯 Function to get event by URL components (optimized for new URL structure)
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

-- 🎯 Function to get all events of a type on a specific date in a city
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
```

---

## **9. Key Schema Optimizations Explained**

### **✅ Enhanced Event URL Support**

- **City Slug**: Added to cities table for clean URL generation
- **Event URL View**: Pre-computed joins for faster URL-based queries
- **Composite Indexes**: Optimized for the specific URL query patterns
- **Translation Function**: Localized event type URLs

### **✅ Performance Improvements**

- **URL-Specific Indexes**: Designed for city/date/type/bloco lookup patterns
- **View-Based Optimization**: Pre-computed joins reduce query complexity
- **Function-Based Queries**: Reusable, optimized database functions
- **Selective Indexing**: Partial indexes for active/featured content

### **✅ SEO & Internationalization Ready**

- **Multilingual Content**: Separate columns for all supported languages
- **URL Generation**: Built-in support for localized URLs
- **Search Optimization**: Full-text search indexes in Portuguese
- **Schema.org Ready**: Structure supports rich event markup

### **✅ Scalability Considerations**

- **Partitioning Ready**: Events table can be partitioned by date
- **Index Optimization**: Composite indexes for common query patterns
- **Real-time Ready**: Optimized for location and chat features
- **Analytics Ready**: Structure supports future analytics tables
