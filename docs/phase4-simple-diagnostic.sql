-- =====================================================
-- MINISTÉRIO DO BLOCO - PHASE 4 SIMPLE DIAGNOSTIC
-- Returns results as tables for visibility
-- =====================================================

-- Check user table existence
SELECT 
    'user_profiles' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') 
         THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
    'user_location_sessions' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_location_sessions') 
         THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
    'user_locations' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_locations') 
         THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
    'user_bloco_follows' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_bloco_follows') 
         THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
    'user_saved_events' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_saved_events') 
         THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
ORDER BY table_name; 