-- =====================================================
-- MINISTÉRIO DO BLOCO - PHASE 4 DIAGNOSTIC (FIXED)
-- Check current state before migration
-- =====================================================

-- Check if user tables already exist and their structure
DO $$
BEGIN
    RAISE NOTICE '=== PHASE 4 DIAGNOSTIC REPORT ===';
END $$;

-- 1. Check if user_profiles table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        RAISE NOTICE '✅ user_profiles table EXISTS';
    ELSE
        RAISE NOTICE '❌ user_profiles table MISSING';
    END IF;
END $$;

-- 2. Check if user_location_sessions table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_location_sessions') THEN
        RAISE NOTICE '✅ user_location_sessions table EXISTS';
    ELSE
        RAISE NOTICE '❌ user_location_sessions table MISSING';
    END IF;
END $$;

-- 3. Check if user_locations table exists and its structure
DO $$
DECLARE
    col_count INTEGER;
    col_name TEXT;
    session_col_exists BOOLEAN := FALSE;
    location_session_col_exists BOOLEAN := FALSE;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_locations') THEN
        RAISE NOTICE '✅ user_locations table EXISTS';
        
        -- Check for session_id column
        SELECT COUNT(*) INTO col_count
        FROM information_schema.columns 
        WHERE table_name = 'user_locations' AND column_name = 'session_id';
        
        IF col_count > 0 THEN
            session_col_exists := TRUE;
            RAISE NOTICE '  ✅ session_id column EXISTS';
        ELSE
            RAISE NOTICE '  ❌ session_id column MISSING';
        END IF;
        
        -- Check for location_session_id column
        SELECT COUNT(*) INTO col_count
        FROM information_schema.columns 
        WHERE table_name = 'user_locations' AND column_name = 'location_session_id';
        
        IF col_count > 0 THEN
            location_session_col_exists := TRUE;
            RAISE NOTICE '  ✅ location_session_id column EXISTS';
        ELSE
            RAISE NOTICE '  ❌ location_session_id column MISSING';
        END IF;
        
        -- Show all columns in user_locations (FIXED)
        RAISE NOTICE '  📋 All columns in user_locations:';
        FOR col_name IN 
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'user_locations' 
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE '    - %', col_name;
        END LOOP;
        
    ELSE
        RAISE NOTICE '❌ user_locations table MISSING';
    END IF;
END $$;

-- 4. Check existing indexes that might conflict
DO $$
DECLARE
    idx_name TEXT;
BEGIN
    RAISE NOTICE '📋 Existing user-related indexes:';
    FOR idx_name IN 
        SELECT indexname FROM pg_indexes 
        WHERE indexname LIKE 'idx_user_%' OR indexname LIKE '%session%'
        ORDER BY indexname
    LOOP
        RAISE NOTICE '  - %', idx_name;
    END LOOP;
END $$;

-- 5. Check for any existing foreign key constraints
DO $$
DECLARE
    constraint_info TEXT;
BEGIN
    RAISE NOTICE '📋 Existing foreign key constraints on user tables:';
    FOR constraint_info IN 
        SELECT 
            tc.table_name || '.' || tc.constraint_name || ' -> ' || 
            ccu.table_name || '(' || ccu.column_name || ')'
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu 
            ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND (tc.table_name LIKE 'user_%' OR ccu.table_name LIKE 'user_%')
        ORDER BY tc.table_name, tc.constraint_name
    LOOP
        RAISE NOTICE '  - %', constraint_info;
    END LOOP;
END $$;

-- 6. Summary and recommendations
DO $$
DECLARE
    user_locations_exists BOOLEAN;
    session_id_exists BOOLEAN;
BEGIN
    -- Check table existence
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_locations'
    ) INTO user_locations_exists;
    
    -- Check session_id column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_locations' AND column_name = 'session_id'
    ) INTO session_id_exists;
    
    RAISE NOTICE '=== RECOMMENDATIONS ===';
    
    IF user_locations_exists AND NOT session_id_exists THEN
        RAISE NOTICE '🔧 ISSUE: user_locations table exists but session_id column is missing';
        RAISE NOTICE '💡 SOLUTION: Need to either:';
        RAISE NOTICE '   1. DROP existing user_locations table, or';
        RAISE NOTICE '   2. ALTER table to add missing session_id column';
    ELSIF NOT user_locations_exists THEN
        RAISE NOTICE '✅ READY: user_locations table does not exist - safe to create';
    ELSE
        RAISE NOTICE '✅ READY: user_locations table exists with correct structure';
    END IF;
    
    RAISE NOTICE '================================';
END $$; 