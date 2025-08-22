-- Creating database schema for hospital wait-time optimizer
-- Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER REFERENCES hospitals(id),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'emergency', 'opd', 'specialist'
    capacity INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER REFERENCES hospitals(id),
    department_id INTEGER REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100),
    avg_consultation_time INTEGER DEFAULT 15, -- minutes
    is_available BOOLEAN DEFAULT true,
    shift_start TIME DEFAULT '09:00:00',
    shift_end TIME DEFAULT '17:00:00',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    age INTEGER,
    gender VARCHAR(10),
    medical_record_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Queue entries table
CREATE TABLE IF NOT EXISTS queue_entries (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    hospital_id INTEGER REFERENCES hospitals(id),
    department_id INTEGER REFERENCES departments(id),
    doctor_id INTEGER REFERENCES doctors(id),
    priority_level INTEGER DEFAULT 3, -- 1=emergency, 2=urgent, 3=routine, 4=follow-up
    estimated_wait_time INTEGER, -- minutes
    actual_wait_time INTEGER, -- minutes (filled after consultation)
    status VARCHAR(20) DEFAULT 'waiting', -- 'waiting', 'in_consultation', 'completed', 'cancelled'
    symptoms TEXT,
    arrival_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    consultation_start_time TIMESTAMP,
    consultation_end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wait time predictions table (for ML model results)
CREATE TABLE IF NOT EXISTS wait_predictions (
    id SERIAL PRIMARY KEY,
    queue_entry_id INTEGER REFERENCES queue_entries(id),
    predicted_wait_time INTEGER NOT NULL, -- minutes
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    prediction_factors JSONB, -- store factors that influenced prediction
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospital statistics table (for dashboard analytics)
CREATE TABLE IF NOT EXISTS hospital_stats (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER REFERENCES hospitals(id),
    department_id INTEGER REFERENCES departments(id),
    date DATE NOT NULL,
    total_patients INTEGER DEFAULT 0,
    avg_wait_time DECIMAL(5,2), -- minutes
    emergency_cases INTEGER DEFAULT 0,
    patient_satisfaction_score DECIMAL(3,2), -- 0.00 to 5.00
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_queue_entries_status ON queue_entries(status);
CREATE INDEX IF NOT EXISTS idx_queue_entries_priority ON queue_entries(priority_level);
CREATE INDEX IF NOT EXISTS idx_queue_entries_hospital_dept ON queue_entries(hospital_id, department_id);
CREATE INDEX IF NOT EXISTS idx_queue_entries_arrival_time ON queue_entries(arrival_time);
CREATE INDEX IF NOT EXISTS idx_doctors_availability ON doctors(is_available);
