export interface Hospital {
  id: number
  name: string
  address?: string
  phone?: string
  created_at: string
}

export interface Department {
  id: number
  hospital_id: number
  name: string
  type: "emergency" | "opd" | "specialist"
  capacity: number
  created_at: string
}

export interface Doctor {
  id: number
  hospital_id: number
  department_id: number
  name: string
  specialization?: string
  avg_consultation_time: number
  is_available: boolean
  shift_start: string
  shift_end: string
  created_at: string
}

export interface Patient {
  id: number
  name: string
  phone?: string
  age?: number
  gender?: string
  medical_record_number?: string
  created_at: string
}

export interface QueueEntry {
  id: number
  patient_id: number
  hospital_id: number
  department_id: number
  doctor_id: number
  priority_level: 1 | 2 | 3 | 4 // 1=emergency, 2=urgent, 3=routine, 4=follow-up
  estimated_wait_time?: number
  actual_wait_time?: number
  status: "waiting" | "in_consultation" | "completed" | "cancelled"
  symptoms?: string
  arrival_time: string
  consultation_start_time?: string
  consultation_end_time?: string
  created_at: string
  updated_at: string
  // Joined data
  patient?: Patient
  doctor?: Doctor
  department?: Department
}

export interface WaitPrediction {
  id: number
  queue_entry_id: number
  predicted_wait_time: number
  confidence_score: number
  prediction_factors: Record<string, any>
  created_at: string
}

export interface HospitalStats {
  id: number
  hospital_id: number
  department_id: number
  date: string
  total_patients: number
  avg_wait_time: number
  emergency_cases: number
  patient_satisfaction_score: number
  created_at: string
}

export interface AIWaitTimePrediction {
  patientId: number
  estimatedWaitTime: number
  confidence: number
  factors: {
    queueLength: number
    doctorAvailability: number
    priorityLevel: number
    avgConsultationTime: number
    timeOfDay: string
  }
}
