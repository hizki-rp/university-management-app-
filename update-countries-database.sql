-- Clear existing countries and add comprehensive European list
DELETE FROM countries;

-- Insert all European countries with proper categorization
-- Schengen Area countries (27 countries)
INSERT INTO countries (name, code, is_schengen, is_eu, region) VALUES
-- Core Schengen founding members
('Austria', 'AT', true, true, 'Central Europe'),
('Belgium', 'BE', true, true, 'Western Europe'),
('Denmark', 'DK', true, true, 'Northern Europe'),
('Finland', 'FI', true, true, 'Northern Europe'),
('France', 'FR', true, true, 'Western Europe'),
('Germany', 'DE', true, true, 'Central Europe'),
('Iceland', 'IS', true, false, 'Northern Europe'),
('Italy', 'IT', true, true, 'Southern Europe'),
('Luxembourg', 'LU', true, true, 'Western Europe'),
('Netherlands', 'NL', true, true, 'Western Europe'),
('Norway', 'NO', true, false, 'Northern Europe'),
('Portugal', 'PT', true, true, 'Southern Europe'),
('Spain', 'ES', true, true, 'Southern Europe'),
('Sweden', 'SE', true, true, 'Northern Europe'),
('Switzerland', 'CH', true, false, 'Central Europe'),

-- EU countries that joined Schengen later
('Czech Republic', 'CZ', true, true, 'Central Europe'),
('Estonia', 'EE', true, true, 'Northern Europe'),
('Greece', 'GR', true, true, 'Southern Europe'),
('Hungary', 'HU', true, true, 'Central Europe'),
('Latvia', 'LV', true, true, 'Northern Europe'),
('Lithuania', 'LT', true, true, 'Northern Europe'),
('Malta', 'MT', true, true, 'Southern Europe'),
('Poland', 'PL', true, true, 'Central Europe'),
('Slovakia', 'SK', true, true, 'Central Europe'),
('Slovenia', 'SI', true, true, 'Central Europe'),

-- Recent Schengen additions
('Croatia', 'HR', true, true, 'Southern Europe'),
('Liechtenstein', 'LI', true, false, 'Central Europe'),

-- EU countries not in Schengen
('Bulgaria', 'BG', false, true, 'Eastern Europe'),
('Cyprus', 'CY', false, true, 'Southern Europe'),
('Ireland', 'IE', false, true, 'Western Europe'),
('Romania', 'RO', false, true, 'Eastern Europe'),

-- Other European countries
('Albania', 'AL', false, false, 'Southern Europe'),
('Andorra', 'AD', false, false, 'Southern Europe'),
('Armenia', 'AM', false, false, 'Eastern Europe'),
('Azerbaijan', 'AZ', false, false, 'Eastern Europe'),
('Belarus', 'BY', false, false, 'Eastern Europe'),
('Bosnia and Herzegovina', 'BA', false, false, 'Southern Europe'),
('Georgia', 'GE', false, false, 'Eastern Europe'),
('Kazakhstan', 'KZ', false, false, 'Eastern Europe'),
('Kosovo', 'XK', false, false, 'Southern Europe'),
('Moldova', 'MD', false, false, 'Eastern Europe'),
('Monaco', 'MC', false, false, 'Western Europe'),
('Montenegro', 'ME', false, false, 'Southern Europe'),
('North Macedonia', 'MK', false, false, 'Southern Europe'),
('Russia', 'RU', false, false, 'Eastern Europe'),
('San Marino', 'SM', false, false, 'Southern Europe'),
('Serbia', 'RS', false, false, 'Southern Europe'),
('Turkey', 'TR', false, false, 'Eastern Europe'),
('Ukraine', 'UA', false, false, 'Eastern Europe'),
('United Kingdom', 'GB', false, false, 'Western Europe'),
('Vatican City', 'VA', false, false, 'Southern Europe'),

-- Popular non-European countries for international education
('United States', 'US', false, false, 'North America'),
('Canada', 'CA', false, false, 'North America'),
('Australia', 'AU', false, false, 'Oceania'),
('New Zealand', 'NZ', false, false, 'Oceania'),
('Japan', 'JP', false, false, 'Asia'),
('South Korea', 'KR', false, false, 'Asia'),
('Singapore', 'SG', false, false, 'Asia'),
('Hong Kong', 'HK', false, false, 'Asia'),
('China', 'CN', false, false, 'Asia'),
('India', 'IN', false, false, 'Asia'),
('United Arab Emirates', 'AE', false, false, 'Middle East'),
('Israel', 'IL', false, false, 'Middle East'),
('South Africa', 'ZA', false, false, 'Africa'),
('Brazil', 'BR', false, false, 'South America'),
('Argentina', 'AR', false, false, 'South America'),
('Chile', 'CL', false, false, 'South America'),
('Mexico', 'MX', false, false, 'North America');

-- Update the countries table structure to include additional metadata
ALTER TABLE countries ADD COLUMN IF NOT EXISTS is_schengen BOOLEAN DEFAULT false;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS is_eu BOOLEAN DEFAULT false;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS region VARCHAR(50);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 999;

-- Set display order to prioritize European countries
UPDATE countries SET display_order = 1 WHERE is_schengen = true;
UPDATE countries SET display_order = 2 WHERE is_eu = true AND is_schengen = false;
UPDATE countries SET display_order = 3 WHERE region LIKE '%Europe%' AND is_eu = false AND is_schengen = false;
UPDATE countries SET display_order = 4 WHERE region NOT LIKE '%Europe%';
