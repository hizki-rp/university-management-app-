-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin users can insert universities" ON universities;
DROP POLICY IF EXISTS "Admin users can update universities" ON universities;
DROP POLICY IF EXISTS "Admin users can delete universities" ON universities;
DROP POLICY IF EXISTS "Admin users can view admin_users" ON admin_users;

-- Create new policies that allow public access for all operations
CREATE POLICY "Anyone can insert universities" ON universities FOR INSERT USING (true);
CREATE POLICY "Anyone can update universities" ON universities FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete universities" ON universities FOR DELETE USING (true);

-- We can drop the admin_users table since we don't need authentication
DROP TABLE IF EXISTS admin_users;
