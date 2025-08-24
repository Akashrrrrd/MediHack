import type { QueueEntry, Doctor, Patient, WaitPrediction } from "./types"

// Mock database functions (in a real app, these would connect to your actual database)
export class DatabaseService {
  // Mock data storage with realistic hospital data
  private static queueEntries: QueueEntry[] = [
    {
      id: 1,
      patient_id: 1,
      hospital_id: 1,
      department_id: 1,
      doctor_id: 1,
      priority_level: 1,
      estimated_wait_time: 8,
      status: "waiting",
      symptoms: "Severe chest pain, difficulty breathing",
      arrival_time: new Date(Date.now() - 12 * 60000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: 1,
        name: "Robert Chen",
        age: 52,
        gender: "Male",
        phone: "+1-555-2847",
        medical_record_number: "MR2024001",
        created_at: new Date().toISOString(),
      },
      doctor: {
        id: 1,
        hospital_id: 1,
        department_id: 1,
        name: "Dr. Sarah Johnson",
        specialization: "Emergency Medicine",
        avg_consultation_time: 20,
        is_available: true,
        shift_start: "09:00:00",
        shift_end: "17:00:00",
        created_at: new Date().toISOString(),
      },
      department: {
        id: 1,
        hospital_id: 1,
        name: "Emergency Department",
        type: "emergency",
        capacity: 30,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 2,
      patient_id: 2,
      hospital_id: 1,
      department_id: 2,
      doctor_id: 3,
      priority_level: 3,
      estimated_wait_time: 28,
      status: "waiting",
      symptoms: "Persistent cough and mild fever for 3 days",
      arrival_time: new Date(Date.now() - 18 * 60000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: 2,
        name: "Sarah Williams",
        age: 34,
        gender: "Female",
        phone: "+1-555-3921",
        medical_record_number: "MR2024002",
        created_at: new Date().toISOString(),
      },
      doctor: {
        id: 3,
        hospital_id: 1,
        department_id: 2,
        name: "Dr. Emily Rodriguez",
        specialization: "Internal Medicine",
        avg_consultation_time: 15,
        is_available: true,
        shift_start: "09:00:00",
        shift_end: "17:00:00",
        created_at: new Date().toISOString(),
      },
      department: {
        id: 2,
        hospital_id: 1,
        name: "General Medicine",
        type: "opd",
        capacity: 50,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 3,
      patient_id: 3,
      hospital_id: 1,
      department_id: 3,
      doctor_id: 5,
      priority_level: 2,
      estimated_wait_time: 22,
      status: "waiting",
      symptoms: "Irregular heartbeat and dizziness",
      arrival_time: new Date(Date.now() - 14 * 60000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: 3,
        name: "Michael Davis",
        age: 61,
        gender: "Male",
        phone: "+1-555-7456",
        medical_record_number: "MR2024003",
        created_at: new Date().toISOString(),
      },
      doctor: {
        id: 5,
        hospital_id: 1,
        department_id: 3,
        name: "Dr. Robert Kim",
        specialization: "Cardiology",
        avg_consultation_time: 25,
        is_available: true,
        shift_start: "09:00:00",
        shift_end: "17:00:00",
        created_at: new Date().toISOString(),
      },
      department: {
        id: 3,
        hospital_id: 1,
        name: "Cardiology",
        type: "specialist",
        capacity: 20,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 4,
      patient_id: 4,
      hospital_id: 1,
      department_id: 2,
      doctor_id: 3,
      priority_level: 3,
      estimated_wait_time: 32,
      status: "waiting",
      symptoms: "Follow-up for diabetes management",
      arrival_time: new Date(Date.now() - 8 * 60000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: 4,
        name: "Jennifer Martinez",
        age: 45,
        gender: "Female",
        phone: "+1-555-8234",
        medical_record_number: "MR2024004",
        created_at: new Date().toISOString(),
      },
      doctor: {
        id: 3,
        hospital_id: 1,
        department_id: 2,
        name: "Dr. Emily Rodriguez",
        specialization: "Internal Medicine",
        avg_consultation_time: 15,
        is_available: true,
        shift_start: "09:00:00",
        shift_end: "17:00:00",
        created_at: new Date().toISOString(),
      },
      department: {
        id: 2,
        hospital_id: 1,
        name: "General Medicine",
        type: "opd",
        capacity: 50,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 5,
      patient_id: 5,
      hospital_id: 1,
      department_id: 4,
      doctor_id: 6,
      priority_level: 3,
      estimated_wait_time: 18,
      status: "waiting",
      symptoms: "Child with ear infection symptoms",
      arrival_time: new Date(Date.now() - 6 * 60000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: 5,
        name: "Emma Thompson",
        age: 7,
        gender: "Female",
        phone: "+1-555-9876",
        medical_record_number: "MR2024005",
        created_at: new Date().toISOString(),
      },
      doctor: {
        id: 6,
        hospital_id: 1,
        department_id: 4,
        name: "Dr. Lisa Thompson",
        specialization: "Pediatrics",
        avg_consultation_time: 18,
        is_available: true,
        shift_start: "09:00:00",
        shift_end: "17:00:00",
        created_at: new Date().toISOString(),
      },
      department: {
        id: 4,
        hospital_id: 1,
        name: "Pediatrics",
        type: "opd",
        capacity: 25,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 6,
      patient_id: 6,
      hospital_id: 2,
      department_id: 5,
      doctor_id: 7,
      priority_level: 2,
      estimated_wait_time: 15,
      status: "waiting",
      symptoms: "Severe abdominal pain and nausea",
      arrival_time: new Date(Date.now() - 10 * 60000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: 6,
        name: "David Wilson",
        age: 38,
        gender: "Male",
        phone: "+1-555-4567",
        medical_record_number: "MR2024006",
        created_at: new Date().toISOString(),
      },
      doctor: {
        id: 7,
        hospital_id: 2,
        department_id: 5,
        name: "Dr. David Martinez",
        specialization: "Emergency Medicine",
        avg_consultation_time: 22,
        is_available: true,
        shift_start: "09:00:00",
        shift_end: "17:00:00",
        created_at: new Date().toISOString(),
      },
      department: {
        id: 5,
        hospital_id: 2,
        name: "Emergency Department",
        type: "emergency",
        capacity: 40,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 7,
      patient_id: 7,
      hospital_id: 2,
      department_id: 6,
      doctor_id: 8,
      priority_level: 3,
      estimated_wait_time: 12,
      status: "waiting",
      symptoms: "Minor cut requiring stitches",
      arrival_time: new Date(Date.now() - 4 * 60000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: 7,
        name: "Lisa Anderson",
        age: 29,
        gender: "Female",
        phone: "+1-555-6789",
        medical_record_number: "MR2024007",
        created_at: new Date().toISOString(),
      },
      doctor: {
        id: 8,
        hospital_id: 2,
        department_id: 6,
        name: "Dr. Anna Patel",
        specialization: "Urgent Care",
        avg_consultation_time: 10,
        is_available: true,
        shift_start: "09:00:00",
        shift_end: "17:00:00",
        created_at: new Date().toISOString(),
      },
      department: {
        id: 6,
        hospital_id: 2,
        name: "Urgent Care",
        type: "opd",
        capacity: 35,
        created_at: new Date().toISOString(),
      },
    },
  ]

  private static doctors: Doctor[] = [
    {
      id: 1,
      hospital_id: 1,
      department_id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Emergency Medicine",
      avg_consultation_time: 20,
      is_available: true,
      shift_start: "09:00:00",
      shift_end: "17:00:00",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      hospital_id: 1,
      department_id: 1,
      name: "Dr. Michael Chen",
      specialization: "Emergency Medicine",
      avg_consultation_time: 18,
      is_available: true,
      shift_start: "09:00:00",
      shift_end: "17:00:00",
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      hospital_id: 1,
      department_id: 2,
      name: "Dr. Emily Rodriguez",
      specialization: "Internal Medicine",
      avg_consultation_time: 15,
      is_available: true,
      shift_start: "09:00:00",
      shift_end: "17:00:00",
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      hospital_id: 1,
      department_id: 2,
      name: "Dr. James Wilson",
      specialization: "Family Medicine",
      avg_consultation_time: 12,
      is_available: true,
      shift_start: "09:00:00",
      shift_end: "17:00:00",
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      hospital_id: 1,
      department_id: 3,
      name: "Dr. Robert Kim",
      specialization: "Cardiology",
      avg_consultation_time: 25,
      is_available: true,
      shift_start: "09:00:00",
      shift_end: "17:00:00",
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      hospital_id: 1,
      department_id: 4,
      name: "Dr. Lisa Thompson",
      specialization: "Pediatrics",
      avg_consultation_time: 18,
      is_available: true,
      shift_start: "09:00:00",
      shift_end: "17:00:00",
      created_at: new Date().toISOString(),
    },
    {
      id: 7,
      hospital_id: 2,
      department_id: 5,
      name: "Dr. David Martinez",
      specialization: "Emergency Medicine",
      avg_consultation_time: 22,
      is_available: true,
      shift_start: "09:00:00",
      shift_end: "17:00:00",
      created_at: new Date().toISOString(),
    },
    {
      id: 8,
      hospital_id: 2,
      department_id: 6,
      name: "Dr. Anna Patel",
      specialization: "Urgent Care",
      avg_consultation_time: 10,
      is_available: true,
      shift_start: "09:00:00",
      shift_end: "17:00:00",
      created_at: new Date().toISOString(),
    },
  ]

  static async getQueueEntries(hospitalId?: number, departmentId?: number): Promise<QueueEntry[]> {
    let filtered = [...this.queueEntries]

    if (hospitalId) {
      filtered = filtered.filter((entry) => entry.hospital_id === hospitalId)
    }

    if (departmentId) {
      filtered = filtered.filter((entry) => entry.department_id === departmentId)
    }

    return filtered.filter((entry) => entry.status === "waiting")
  }

  static async getDoctors(hospitalId?: number, departmentId?: number): Promise<Doctor[]> {
    let filtered = [...this.doctors]

    if (hospitalId) {
      filtered = filtered.filter((doctor) => doctor.hospital_id === hospitalId)
    }

    if (departmentId) {
      filtered = filtered.filter((doctor) => doctor.department_id === departmentId)
    }

    return filtered.filter((doctor) => doctor.is_available)
  }

  static async getQueueEntry(id: number): Promise<QueueEntry | null> {
    return this.queueEntries.find((entry) => entry.id === id) || null
  }

  static async updateQueueEntry(id: number, updates: Partial<QueueEntry>): Promise<QueueEntry | null> {
    const index = this.queueEntries.findIndex((entry) => entry.id === id)
    if (index === -1) return null

    this.queueEntries[index] = {
      ...this.queueEntries[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    return this.queueEntries[index]
  }

  static async savePrediction(prediction: Omit<WaitPrediction, "id" | "created_at">): Promise<WaitPrediction> {
    const newPrediction: WaitPrediction = {
      ...prediction,
      id: Date.now(), // Simple ID generation
      created_at: new Date().toISOString(),
    }

    return newPrediction
  }

  static async addPatientToQueue(patientData: {
    name: string
    phone?: string
    age?: number
    symptoms: string
    priority_level: 1 | 2 | 3 | 4
    hospital_id: number
    department_id: number
  }): Promise<QueueEntry> {
    // Create patient
    const patient: Patient = {
      id: Date.now(),
      name: patientData.name,
      phone: patientData.phone,
      age: patientData.age,
      medical_record_number: `MR${Date.now()}`,
      created_at: new Date().toISOString(),
    }

    // Find available doctor
    const availableDoctors = await this.getDoctors(patientData.hospital_id, patientData.department_id)
    const assignedDoctor = availableDoctors[0] // Simple assignment

    // Create queue entry
    const queueEntry: QueueEntry = {
      id: Date.now() + 1,
      patient_id: patient.id,
      hospital_id: patientData.hospital_id,
      department_id: patientData.department_id,
      doctor_id: assignedDoctor?.id || 1,
      priority_level: patientData.priority_level,
      status: "waiting",
      symptoms: patientData.symptoms,
      arrival_time: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient,
      doctor: assignedDoctor,
      department: {
        id: patientData.department_id,
        hospital_id: patientData.hospital_id,
        name: "Department",
        type: "opd",
        capacity: 50,
        created_at: new Date().toISOString(),
      },
    }

    this.queueEntries.push(queueEntry)
    return queueEntry
  }
}

export async function getQueueStatus(hospitalId: number) {
  const queueEntries = await DatabaseService.getQueueEntries(hospitalId)

  return {
    totalPatients: queueEntries.length,
    avgWaitTime:
      Math.round(
        queueEntries.reduce((sum, entry) => sum + (entry.estimated_wait_time || 0), 0) / queueEntries.length,
      ) || 0,
    criticalCount: queueEntries.filter((entry) => entry.priority_level === 1).length,
    urgentCount: queueEntries.filter((entry) => entry.priority_level === 2).length,
    departmentBreakdown: queueEntries.reduce(
      (acc, entry) => {
        const deptName = entry.department?.name || "Unknown"
        acc[deptName] = (acc[deptName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  }
}

export async function getPatientPosition(patientId: number) {
  const queueEntries = await DatabaseService.getQueueEntries()
  const patientEntry = queueEntries.find((entry) => entry.patient_id === patientId)

  if (!patientEntry) return null

  // Calculate position based on priority and arrival time
  const sameOrHigherPriority = queueEntries.filter(
    (entry) =>
      entry.department_id === patientEntry.department_id &&
      entry.priority_level <= patientEntry.priority_level &&
      new Date(entry.arrival_time) <= new Date(patientEntry.arrival_time),
  )

  return sameOrHigherPriority.length
}

export async function getEmergencyCases(hospitalId: number) {
  const queueEntries = await DatabaseService.getQueueEntries(hospitalId)

  return queueEntries
    .filter((entry) => entry.priority_level === 1)
    .map((entry) => ({
      id: entry.id,
      patient_name: entry.patient?.name || "Unknown",
      symptoms: entry.symptoms,
      arrival_time: entry.arrival_time,
      department: entry.department?.name || "Unknown",
      priority: entry.priority_level === 1 ? "critical" : "urgent",
      wait_time: Math.floor((Date.now() - new Date(entry.arrival_time).getTime()) / 60000),
    }))
}
