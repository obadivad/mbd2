-- =====================================================
-- MINISTÉRIO DO BLOCO - DATABASE BACKUP SCRIPT
-- Date: December 2024
-- Purpose: Create complete backup before schema migration
-- =====================================================

-- 🚨 CRITICAL: Run this BEFORE any schema changes
-- This creates a backup schema with all current data

BEGIN;

-- Drop existing backup schema if it exists (for fresh backup each time)
DROP SCHEMA IF EXISTS backup_dec2024 CASCADE;

-- Create backup schema
CREATE SCHEMA backup_dec2024;

-- Set search path to include both schemas
SET search_path TO backup_dec2024, public;

-- =====================================================
-- BACKUP CORE TABLES WITH DATA
-- =====================================================

-- Backup blocos (main data - 1,802 records)
CREATE TABLE backup_dec2024.blocos AS 
SELECT * FROM public.blocos;

-- Backup cities (location data - 20 records)
CREATE TABLE backup_dec2024.cities AS 
SELECT * FROM public.cities;

-- Backup events (minimal data - 1 record)
CREATE TABLE backup_dec2024.events AS 
SELECT * FROM public.events;

-- Backup blocos_parades (comprehensive event data)
CREATE TABLE backup_dec2024.blocos_parades AS 
SELECT * FROM public.blocos_parades;

-- =====================================================
-- BACKUP RELATIONSHIP TABLES
-- =====================================================

-- Backup bloco-city relationships
CREATE TABLE backup_dec2024.blocos_cities AS 
SELECT * FROM public.blocos_cities;

-- Backup musical genres
CREATE TABLE backup_dec2024.musical_genres AS 
SELECT * FROM public.musical_genres;

-- Backup bloco genres relationships
CREATE TABLE backup_dec2024.bloco_genres AS 
SELECT * FROM public.bloco_genres;

-- Backup bloco types
CREATE TABLE backup_dec2024.blocos_types AS 
SELECT * FROM public.blocos_types;

-- Backup bloco types relationships
CREATE TABLE backup_dec2024.blocos_types_relations AS 
SELECT * FROM public.blocos_types_relations;

-- =====================================================
-- BACKUP USER & SOCIAL FEATURES (if any data exists)
-- =====================================================

-- Backup profiles
CREATE TABLE backup_dec2024.profiles AS 
SELECT * FROM public.profiles;

-- Backup user preferences
CREATE TABLE backup_dec2024.user_preferences AS 
SELECT * FROM public.user_preferences;

-- Backup user favorite blocos
CREATE TABLE backup_dec2024.user_favorite_blocos AS 
SELECT * FROM public.user_favorite_blocos;

-- Backup user agenda
CREATE TABLE backup_dec2024.user_agenda AS 
SELECT * FROM public.user_agenda;

-- Backup friendships
CREATE TABLE backup_dec2024.friendships AS 
SELECT * FROM public.friendships;

-- Backup notifications
CREATE TABLE backup_dec2024.notifications AS 
SELECT * FROM public.notifications;

-- =====================================================
-- BACKUP ADDITIONAL TABLES
-- =====================================================

-- Backup instagram data
CREATE TABLE backup_dec2024.instagram AS 
SELECT * FROM public.instagram;

-- Backup carnival circuits
CREATE TABLE backup_dec2024.carnival_circuits AS 
SELECT * FROM public.carnival_circuits;

-- Backup notification preferences
CREATE TABLE backup_dec2024.notification_preferences AS 
SELECT * FROM public.notification_preferences;

-- Backup mobile notifications
CREATE TABLE backup_dec2024.mobile_notifications AS 
SELECT * FROM public.mobile_notifications;

-- =====================================================
-- BACKUP SCHEMA METADATA
-- =====================================================

-- Backup current enum types
CREATE TABLE backup_dec2024.enum_types AS
SELECT 
  t.typname AS enum_name,
  e.enumlabel AS enum_value,
  e.enumsortorder
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typtype = 'e'
ORDER BY t.typname, e.enumsortorder;

-- Backup table constraints info
CREATE TABLE backup_dec2024.table_constraints AS
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc 
LEFT JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name 
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu 
  ON tc.constraint_name = ccu.constraint_name 
  AND tc.table_schema = ccu.table_schema
WHERE tc.table_schema = 'public' 
  AND tc.constraint_type IN ('FOREIGN KEY', 'PRIMARY KEY', 'UNIQUE');

-- Backup column information
CREATE TABLE backup_dec2024.column_info AS
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable, 
  column_default,
  ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Create verification summary
CREATE TABLE backup_dec2024.backup_summary AS
SELECT 
  'blocos' as table_name, 
  COUNT(*) as record_count,
  MIN(created_at) as earliest_record,
  MAX(created_at) as latest_record
FROM backup_dec2024.blocos
UNION ALL
SELECT 
  'cities' as table_name, 
  COUNT(*) as record_count,
  MIN(created_at) as earliest_record,
  MAX(created_at) as latest_record
FROM backup_dec2024.cities
UNION ALL
SELECT 
  'events' as table_name, 
  COUNT(*) as record_count,
  MIN(created_at) as earliest_record,
  MAX(created_at) as latest_record
FROM backup_dec2024.events
UNION ALL
SELECT 
  'blocos_parades' as table_name, 
  COUNT(*) as record_count,
  MIN(created_at) as earliest_record,
  MAX(created_at) as latest_record
FROM backup_dec2024.blocos_parades;

-- Create backup metadata
CREATE TABLE backup_dec2024.backup_metadata AS
SELECT 
  'backup_dec2024' as backup_schema,
  NOW() as backup_timestamp,
  current_user as backed_up_by,
  version() as database_version,
  'Pre-migration backup for schema update to match #3 schema.md' as backup_purpose;

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES (run after backup)
-- =====================================================

-- Verify backup was successful
SELECT 
  'BACKUP VERIFICATION' as status,
  schemaname as schema_name,
  relname as table_name,
  n_tup_ins as total_records
FROM pg_stat_user_tables 
WHERE schemaname = 'backup_dec2024'
ORDER BY relname;

-- Summary of backed up data
SELECT * FROM backup_dec2024.backup_summary;
SELECT * FROM backup_dec2024.backup_metadata;

-- =====================================================
-- EXPORT COMMANDS (run in shell after SQL backup)
-- =====================================================

/*
# Additional CSV exports for extra safety
# Run these commands in your terminal:

psql $SUPABASE_DB_URL -c "COPY backup_dec2024.blocos TO STDOUT WITH CSV HEADER" > backup_blocos_$(date +%Y%m%d).csv
psql $SUPABASE_DB_URL -c "COPY backup_dec2024.cities TO STDOUT WITH CSV HEADER" > backup_cities_$(date +%Y%m%d).csv
psql $SUPABASE_DB_URL -c "COPY backup_dec2024.blocos_parades TO STDOUT WITH CSV HEADER" > backup_events_$(date +%Y%m%d).csv
psql $SUPABASE_DB_URL -c "COPY backup_dec2024.musical_genres TO STDOUT WITH CSV HEADER" > backup_genres_$(date +%Y%m%d).csv

# Create a compressed backup of the entire backup schema
pg_dump $SUPABASE_DB_URL --schema=backup_dec2024 --no-owner --no-privileges > full_backup_$(date +%Y%m%d).sql
gzip full_backup_$(date +%Y%m%d).sql

echo "✅ Backup completed successfully!"
echo "📁 Files created:"
echo "   - SQL schema backup in database"
echo "   - CSV exports for critical tables"
echo "   - Compressed full backup file"
*/

-- =====================================================
-- ROLLBACK TEMPLATE (for emergency use)
-- =====================================================

/*
-- EMERGENCY ROLLBACK PROCEDURE
-- Only use if migration fails and you need to restore

BEGIN;

-- Drop current tables (if migration corrupted them)
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.blocos CASCADE;
-- ... add other tables as needed

-- Restore from backup
CREATE TABLE public.events AS SELECT * FROM backup_dec2024.events;
CREATE TABLE public.blocos AS SELECT * FROM backup_dec2024.blocos;
-- ... restore other tables as needed

-- Restore constraints (you'll need to add specific constraint recreation here)

COMMIT;
*/ 