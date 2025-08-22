import type { QueueEntry, Doctor, Patient, WaitPrediction } from "./types"

// Mock database functions (in a real app, these would connect to your actual database)
export class DatabaseService {
  // Mock data storage
  private static queueEntries: QueueEntry[] = [
    {
      id: 1,
      patient_id: 1,
      hospital_id: 1,
      department_id: 1,
      doctor_id: 1,
      priority_level: 1,
      estimated_wait_time: 25,
      status: "waiting",
      symptoms: "Chest pain, shortness of breath",
      arrival_time: new Date(Date.now() - 45 * 60000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: 1,
        name: "John Smith",
        age: 45,
        gender: "Male",
        phone: "+1-555-1001",
        medical_record_number: "MR001",
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
      estimated_wait_time: 45,
      status: "waiting",
      symptoms: "Annual checkup",
      arrival_time: new Date(Date.now() - 30 * 60000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: 2,
        name: "Maria Garcia",
        age: 32,
        gender: "Female",
        phone: "+1-555-1002",
        medical_record_number: "MR002",
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
      estimated_wait_time: 35,
      status: "waiting",
      symptoms: "Heart palpitations",
      arrival_time: new Date(Date.now() - 20 * 60000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: 3,
        name: "William Johnson",
        age: 67,
        gender: "Male",
        phone: "+1-555-1003",
        medical_record_number: "MR003",
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
