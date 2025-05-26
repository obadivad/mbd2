-- Fix Blocos Table Primary Key Constraint
-- This script adds the missing primary key constraint to the blocos table

-- Add primary key constraint to blocos table
ALTER TABLE blocos ADD CONSTRAINT blocos_pkey PRIMARY KEY (id);

-- Verify the constraint was added
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'blocos'
  AND tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_schema = 'public'; 