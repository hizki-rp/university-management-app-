-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create countries table
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(3) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create universities table
CREATE TABLE universities (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  tuition_fees_bachelor DECIMAL(10,2),
  tuition_fees_master DECIMAL(10,2),
  application_fee DECIMAL(10,2),
  admission_start_date DATE,
  admission_deadline DATE,
  admission_requirements TEXT,
  bachelor_programs TEXT[],
  master_programs TEXT[],
  english_requirements TEXT,
  acceptance_rate DECIMAL(5,2),
  website_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample countries
INSERT INTO countries (name, code) VALUES
('United States', 'US'),
('United Kingdom', 'UK'),
('Canada', 'CA'),
('Australia', 'AU'),
('Germany', 'DE'),
('Netherlands', 'NL'),
('Sweden', 'SE'),
('Norway', 'NO');

-- Insert sample universities
INSERT INTO universities (
  country_id, name, tuition_fees_bachelor, tuition_fees_master, 
  application_fee, admission_start_date, admission_deadline,
  admission_requirements, bachelor_programs, master_programs,
  english_requirements, acceptance_rate, website_url, description
) VALUES
(1, 'Harvard University', 54000.00, 56000.00, 75.00, '2024-09-01', '2024-01-01',
 'High school diploma, SAT/ACT scores, essays, recommendations',
 ARRAY['Computer Science', 'Business Administration', 'Engineering', 'Psychology'],
 ARRAY['MBA', 'Computer Science', 'Data Science', 'Public Policy'],
 'TOEFL 100+ or IELTS 7.0+', 3.4, 'https://harvard.edu',
 'Harvard University is a prestigious Ivy League institution known for academic excellence.'),

(2, 'University of Oxford', 35000.00, 40000.00, 50.00, '2024-10-01', '2024-01-15',
 'A-levels or equivalent, personal statement, references',
 ARRAY['Philosophy Politics Economics', 'Computer Science', 'Medicine', 'Law'],
 ARRAY['MBA', 'Machine Learning', 'International Relations', 'Philosophy'],
 'IELTS 7.5+ or TOEFL 110+', 17.5, 'https://ox.ac.uk',
 'The University of Oxford is one of the oldest and most prestigious universities in the world.');

-- Enable Row Level Security
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Countries are viewable by everyone" ON countries FOR SELECT USING (true);
CREATE POLICY "Universities are viewable by everyone" ON universities FOR SELECT USING (true);

-- Create policies for admin access
CREATE POLICY "Admin users can view admin_users" ON admin_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin users can insert universities" ON universities FOR INSERT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin users can update universities" ON universities FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin users can delete universities" ON universities FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
);
