-- Adding more diverse hospitals for better demo
INSERT INTO hospitals (name, address, phone) VALUES 
('St. Mary\'s Medical Center', '789 Healing Way, Northside', '+1-555-0789'),
('Children\'s Hospital of Hope', '321 Pediatric Plaza, Westend', '+1-555-0321'),
('Regional Trauma Center', '654 Emergency Blvd, Southgate', '+1-555-0654'),
('Community Health Clinic', '987 Wellness Street, Eastside', '+1-555-0987'),
('University Medical Center', '147 Research Drive, Campus District', '+1-555-0147');

-- Add departments for new hospitals
INSERT INTO departments (hospital_id, name, type, capacity) VALUES 
-- St. Mary's Medical Center (hospital_id = 3)
(3, 'Emergency Department', 'emergency', 45),
(3, 'Intensive Care Unit', 'specialist', 20),
(3, 'Surgery', 'specialist', 15),
(3, 'Maternity', 'specialist', 25),

-- Children's Hospital (hospital_id = 4)
(4, 'Pediatric Emergency', 'emergency', 30),
(4, 'Pediatric Surgery', 'specialist', 12),
(4, 'NICU', 'specialist', 18),

-- Regional Trauma Center (hospital_id = 5)
(5, 'Trauma Emergency', 'emergency', 60),
(5, 'Critical Care', 'specialist', 35),
(5, 'Neurology', 'specialist', 20),

-- Community Health Clinic (hospital_id = 6)
(6, 'Family Medicine', 'opd', 40),
(6, 'Preventive Care', 'opd', 30),

-- University Medical Center (hospital_id = 7)
(7, 'Emergency Department', 'emergency', 50),
(7, 'Research Clinic', 'specialist', 25),
(7, 'Teaching Hospital', 'opd', 45);

-- Add more doctors across all hospitals
INSERT INTO doctors (hospital_id, department_id, name, specialization, avg_consultation_time, is_available) VALUES 
-- St. Mary's Medical Center
(3, 7, 'Dr. Patricia Adams', 'Emergency Medicine', 19, true),
(3, 8, 'Dr. Christopher Lee', 'Critical Care', 30, true),
(3, 9, 'Dr. Michelle Taylor', 'General Surgery', 45, true),
(3, 10, 'Dr. Jennifer White', 'Obstetrics', 20, true),

-- Children's Hospital
(4, 11, 'Dr. Kevin Park', 'Pediatric Emergency', 22, true),
(4, 12, 'Dr. Amanda Foster', 'Pediatric Surgery', 50, true),
(4, 13, 'Dr. Daniel Moore', 'Neonatology', 25, true),

-- Regional Trauma Center
(5, 14, 'Dr. Steven Clark', 'Trauma Surgery', 35, true),
(5, 15, 'Dr. Rachel Green', 'Critical Care', 28, true),
(5, 16, 'Dr. Mark Anderson', 'Neurosurgery', 60, true),

-- Community Health Clinic
(6, 17, 'Dr. Laura Martinez', 'Family Medicine', 15, true),
(6, 18, 'Dr. Thomas Wright', 'Preventive Medicine', 12, true),

-- University Medical Center
(7, 19, 'Dr. Susan Hill', 'Emergency Medicine', 21, true),
(7, 20, 'Dr. Brian Scott', 'Research Medicine', 40, true),
(7, 21, 'Dr. Nicole Turner', 'Internal Medicine', 18, true);
