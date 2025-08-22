import type { QueueEntry, Doctor, AIWaitTimePrediction } from "./types"

export class WaitTimePredictor {
  /**
   * Predicts wait time for a patient based on current queue and doctor availability
   */
  static async predictWaitTime(
    queueEntry: QueueEntry,
    currentQueue: QueueEntry[],
    availableDoctors: Doctor[],
  ): Promise<AIWaitTimePrediction> {
    // Filter queue for same department and higher/equal priority
    const relevantQueue = currentQueue.filter(
      (entry) =>
        entry.department_id === queueEntry.department_id &&
        entry.priority_level <= queueEntry.priority_level &&
        entry.status === "waiting",
    )

    // Get doctors for this department
    const departmentDoctors = availableDoctors.filter(
      (doctor) => doctor.department_id === queueEntry.department_id && doctor.is_available,
    )

    if (departmentDoctors.length === 0) {
      return {
        patientId: queueEntry.patient_id,
        estimatedWaitTime: 120, // Default 2 hours if no doctors available
        confidence: 0.3,
        factors: {
          queueLength: relevantQueue.length,
          doctorAvailability: 0,
          priorityLevel: queueEntry.priority_level,
          avgConsultationTime: 20,
          timeOfDay: new Date().toTimeString().slice(0, 5),
        },
      }
    }

    // Calculate average consultation time for department
    const avgConsultationTime =
      departmentDoctors.reduce((sum, doctor) => sum + doctor.avg_consultation_time, 0) / departmentDoctors.length

    // Priority multiplier (emergency cases get seen faster)
    const priorityMultiplier = this.getPriorityMultiplier(queueEntry.priority_level)

    // Time of day factor (busier during certain hours)
    const timeOfDayFactor = this.getTimeOfDayFactor()

    // Queue position (considering priority)
    const queuePosition = this.calculateQueuePosition(queueEntry, relevantQueue)

    // Base calculation: (queue position * avg consultation time) / number of doctors
    let estimatedWaitTime = (queuePosition * avgConsultationTime) / departmentDoctors.length

    // Apply factors
    estimatedWaitTime *= priorityMultiplier
    estimatedWaitTime *= timeOfDayFactor

    // Add buffer for transitions between patients (5 minutes per patient ahead)
    estimatedWaitTime += queuePosition * 5

    // Confidence calculation based on data quality
    const confidence = this.calculateConfidence(
      relevantQueue.length,
      departmentDoctors.length,
      queueEntry.priority_level,
    )

    return {
      patientId: queueEntry.patient_id,
      estimatedWaitTime: Math.round(estimatedWaitTime),
      confidence: Math.round(confidence * 100) / 100,
      factors: {
        queueLength: relevantQueue.length,
        doctorAvailability: departmentDoctors.length,
        priorityLevel: queueEntry.priority_level,
        avgConsultationTime: Math.round(avgConsultationTime),
        timeOfDay: new Date().toTimeString().slice(0, 5),
      },
    }
  }

  /**
   * Optimizes doctor-patient allocation for better load balancing
   */
  static optimizeAllocation(
    queueEntries: QueueEntry[],
    doctors: Doctor[],
  ): { doctorId: number; patientIds: number[] }[] {
    const allocation: { doctorId: number; patientIds: number[] }[] = []

    // Group patients by department and priority
    const departmentQueues = new Map<number, QueueEntry[]>()

    queueEntries.forEach((entry) => {
      if (!departmentQueues.has(entry.department_id)) {
        departmentQueues.set(entry.department_id, [])
      }
      departmentQueues.get(entry.department_id)!.push(entry)
    })

    // Sort each department queue by priority and arrival time
    departmentQueues.forEach((queue) => {
      queue.sort((a, b) => {
        if (a.priority_level !== b.priority_level) {
          return a.priority_level - b.priority_level // Lower number = higher priority
        }
        return new Date(a.arrival_time).getTime() - new Date(b.arrival_time).getTime()
      })
    })

    // Allocate patients to doctors
    doctors.forEach((doctor) => {
      if (!doctor.is_available) return

      const departmentQueue = departmentQueues.get(doctor.department_id) || []
      const doctorAllocation = {
        doctorId: doctor.id,
        patientIds: [] as number[],
      }

      // Assign patients based on doctor's capacity and consultation time
      const maxPatients = Math.floor(480 / doctor.avg_consultation_time) // 8-hour shift
      const assignedPatients = departmentQueue.splice(0, Math.min(maxPatients, departmentQueue.length))

      doctorAllocation.patientIds = assignedPatients.map((entry) => entry.patient_id)
      allocation.push(doctorAllocation)
    })

    return allocation
  }

  private static getPriorityMultiplier(priority: number): number {
    switch (priority) {
      case 1:
        return 0.2 // Emergency - seen immediately
      case 2:
        return 0.5 // Urgent - reduced wait
      case 3:
        return 1.0 // Routine - normal wait
      case 4:
        return 1.2 // Follow-up - slightly longer
      default:
        return 1.0
    }
  }

  private static getTimeOfDayFactor(): number {
    const hour = new Date().getHours()

    // Peak hours: 9-11 AM and 2-4 PM
    if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16)) {
      return 1.3 // 30% longer during peak
    }

    // Off-peak hours: early morning and late evening
    if (hour < 8 || hour > 18) {
      return 0.8 // 20% faster during off-peak
    }

    return 1.0 // Normal hours
  }

  private static calculateQueuePosition(targetEntry: QueueEntry, queue: QueueEntry[]): number {
    // Sort by priority first, then by arrival time
    const sortedQueue = [...queue].sort((a, b) => {
      if (a.priority_level !== b.priority_level) {
        return a.priority_level - b.priority_level
      }
      return new Date(a.arrival_time).getTime() - new Date(b.arrival_time).getTime()
    })

    const position = sortedQueue.findIndex((entry) => entry.id === targetEntry.id)
    return position >= 0 ? position + 1 : queue.length + 1
  }

  private static calculateConfidence(queueLength: number, doctorCount: number, priority: number): number {
    let confidence = 0.8 // Base confidence

    // Reduce confidence for longer queues
    if (queueLength > 10) confidence -= 0.1
    if (queueLength > 20) confidence -= 0.1

    // Increase confidence with more doctors
    if (doctorCount > 3) confidence += 0.1

    // Emergency cases have higher prediction accuracy
    if (priority === 1) confidence += 0.1

    return Math.max(0.3, Math.min(0.95, confidence))
  }
}
