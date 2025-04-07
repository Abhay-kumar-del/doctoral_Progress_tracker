
-- This file contains SQL statements for setting up Row Level Security (RLS) 
-- policies for the swayam_courses table in the Supabase database.
-- Execute these statements in the Supabase SQL editor.

-- Enable Row Level Security for the swayam_courses table
ALTER TABLE swayam_courses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to select from the swayam_courses table
CREATE POLICY "All users can view swayam_courses" ON swayam_courses
FOR SELECT
TO authenticated
USING (true);

-- Create a policy that allows authenticated users to insert into the swayam_courses table
CREATE POLICY "Authenticated users can insert swayam_courses" 
ON swayam_courses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create a policy that allows authenticated users to update the swayam_courses table
CREATE POLICY "Authenticated users can update swayam_courses" 
ON swayam_courses
FOR UPDATE
TO authenticated
USING (true);

-- Create a policy that allows authenticated users to delete from the swayam_courses table
CREATE POLICY "Authenticated users can delete swayam_courses" 
ON swayam_courses
FOR DELETE
TO authenticated
USING (true);
