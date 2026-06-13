-- SmileCare Dental Clinic Database Schema
-- Run this once on Neon.tech SQL editor

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blocked dates (holidays, clinic closed)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  reason VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patient_name VARCHAR(100) NOT NULL,
  patient_email VARCHAR(150) NOT NULL,
  patient_phone VARCHAR(20) NOT NULL,
  service_id INTEGER REFERENCES services(id),
  service_name VARCHAR(100) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed default services
INSERT INTO services (name, description, duration_minutes, price) VALUES
  ('General Checkup', 'Full oral examination, X-ray review and treatment plan', 30, 500),
  ('Teeth Cleaning', 'Professional scaling and polishing for healthy gums', 45, 800),
  ('Tooth Filling', 'Composite resin filling for cavities and tooth decay', 45, 1200),
  ('Tooth Extraction', 'Safe removal of damaged or wisdom teeth', 30, 1500),
  ('Root Canal', 'Complete root canal treatment with permanent filling', 60, 4500),
  ('Teeth Whitening', 'Professional in-clinic whitening for a brighter smile', 60, 3500)
ON CONFLICT DO NOTHING;

-- Index for faster appointment queries
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
