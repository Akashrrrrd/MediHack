-- Seeding sample data for demo
-- Insert sample hospital
INSERT INTO hospitals (name, address, phone) VALUES 
('City General Hospital', '123 Healthcare Ave, Medical District', '+1-555-0123'),
('Metro Emergency Center', '456 Urgent Care Blvd, Downtown', '+1-555-0456');

-- Insert departments
INSERT INTO departments (hospital_id, name, type, capacity) VALUES 
(1, 'Emergency Department', 'emergency', 30),
(1, 'General Medicine', 'opd', 50),
(1, 'Cardiology', 'specialist', 20),
(1, 'Pediatrics', 'opd', 25),
(2, 'Emergency Department', 'emergency', 40),
(2, 'Urgent Care', 'opd', 35);

-- Insert sample doctors
INSERT INTO doctors (hospital_id, department_id, name, specialization, avg_consultation_time, is_available) VALUES 
(1, 1, 'Dr. Sarah Johnson', 'Emergency Medicine', 20, true),
(1, 1, 'Dr. Michael Chen', 'Emergency Medicine', 18, true),
(1, 2, 'Dr. Emily Rodriguez', 'Internal Medicine', 15, true),
(1, 2, 'Dr. James Wilson', 'Family Medicine', 12, true),
(1, 3, 'Dr. Robert Kim', 'Cardiology', 25, true),
(1, 4, 'Dr. Lisa Thompson', 'Pediatrics', 18, true),
(2, 5, 'Dr. David Martinez', 'Emergency Medicine', 22, true),
(2, 6, 'Dr. Anna Patel', 'Urgent Care', 10, true);

-- Insert sample patients
INSERT INTO patients (name, phone, age, gender, medical_record_number) VALUES 
('John Smith', '+1-555-1001', 45, 'Male', 'MR001'),
('Maria Garcia', '+1-555-1002', 32, 'Female', 'MR002'),
('William Johnson', '+1-555-1003', 67, 'Male', 'MR003'),
('Jennifer Brown', '+1-555-1004', 28, 'Female', 'MR004'),
('Robert Davis', '+1-555-1005', 55, 'Male', 'MR005'),
('Lisa Wilson', '+1-555-1006', 41, 'Female', 'MR006');

-- Insert sample queue entries (current patients waiting)
INSERT INTO queue_entries (patient_id, hospital_id, department_id, doctor_id, priority_level, symptoms, arrival_time) VALUES 
(1, 1, 1, 1, 1, 'Chest pain, shortness of breath', NOW() - INTERVAL '45 minutes'),
(2, 1, 2, 3, 3, 'Annual checkup', NOW() - INTERVAL '30 minutes'),
(3, 1, 3, 5, 2, 'Heart palpitations', NOW() - INTERVAL '20 minutes'),
(4, 1, 4, 6, 3, 'Child fever and cough', NOW() - INTERVAL '15 minutes'),
(5, 2, 5, 7, 1, 'Severe abdominal pain', NOW() - INTERVAL '10 minutes'),
(6, 2, 6, 8, 3, 'Minor cut requiring stitches', NOW() - INTERVAL '5 minutes');
