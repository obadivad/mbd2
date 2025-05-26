-- Fix All Missing Primary Key Constraints
-- This script adds missing primary key constraints to all tables

-- Add primary keys to tables with id columns
-- Note: These tables should have id columns based on common database patterns

-- Core tables (already done, but included for completeness)
-- ALTER TABLE blocos ADD CONSTRAINT blocos_pkey PRIMARY KEY (id);
-- ALTER TABLE cities ADD CONSTRAINT cities_pkey PRIMARY KEY (id);

-- Add primary keys to other core tables
DO $$
BEGIN
    -- Check and add primary keys where id column exists
    
    -- Events table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'id') THEN
        ALTER TABLE events ADD CONSTRAINT events_pkey PRIMARY KEY (id);
    END IF;
    
    -- Profiles table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'id') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
    END IF;
    
    -- Users table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id') THEN
        ALTER TABLE users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
    END IF;
    
    -- Groups table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'groups' AND column_name = 'id') THEN
        ALTER TABLE groups ADD CONSTRAINT groups_pkey PRIMARY KEY (id);
    END IF;
    
    -- Musical genres table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'musical_genres' AND column_name = 'id') THEN
        ALTER TABLE musical_genres ADD CONSTRAINT musical_genres_pkey PRIMARY KEY (id);
    END IF;
    
    -- Blocos types table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blocos_types' AND column_name = 'id') THEN
        ALTER TABLE blocos_types ADD CONSTRAINT blocos_types_pkey PRIMARY KEY (id);
    END IF;
    
    -- Carnival circuits table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'carnival_circuits' AND column_name = 'id') THEN
        ALTER TABLE carnival_circuits ADD CONSTRAINT carnival_circuits_pkey PRIMARY KEY (id);
    END IF;
    
    -- Notifications table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'id') THEN
        ALTER TABLE notifications ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
    END IF;
    
    -- Pages table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'id') THEN
        ALTER TABLE pages ADD CONSTRAINT pages_pkey PRIMARY KEY (id);
    END IF;

END $$;

-- Verify all primary keys were added
SELECT 
    t.table_name,
    CASE 
        WHEN pk.constraint_name IS NULL THEN 'NO PRIMARY KEY'
        ELSE 'HAS PRIMARY KEY'
    END as pk_status
FROM information_schema.tables t
LEFT JOIN (
    SELECT 
        tc.table_name,
        tc.constraint_name
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_schema = 'public'
) pk ON t.table_name = pk.table_name
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
  AND t.table_name IN ('blocos', 'cities', 'events', 'profiles', 'users', 'groups', 'musical_genres', 'blocos_types', 'carnival_circuits', 'notifications', 'pages')
ORDER BY t.table_name; 