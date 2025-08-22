import type { QueueEntry, AIWaitTimePrediction } from "./types"

export class AIService {
  /**
   * Get comprehensive wait time prediction for a patient
   */
  static async getPrediction(queueEntryId: number, useAI = true): Promise<AIWaitTimePrediction | null> {
    try {
      const response = await fetch("/api/predict-wait-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queueEntryId, useAI }),
      })

      if (!response.ok) {
        throw new Error("Failed to get prediction")
      }

      const data = await response.json()
      return data.prediction
    } catch (error) {
      console.error("[v0] AI Service prediction error:", error)
      return null
    }
  }

  /**
   * Get optimized doctor-patient allocation
   */
  static async getOptimizedAllocation(hospitalId: number, departmentId?: number) {
    try {
      const response = await fetch("/api/optimize-allocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hospitalId, departmentId }),
      })

      if (!response.ok) {
        throw new Error("Failed to get allocation optimization")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] AI Service allocation error:", error)
      return null
    }
  }

  /**
   * Get current queue status with predictions
   */
  static async getQueueWithPredictions(hospitalId?: number, departmentId?: number) {
    try {
      const params = new URLSearchParams()
      if (hospitalId) params.append("hospitalId", hospitalId.toString())
      if (departmentId) params.append("departmentId", departmentId.toString())

      const response = await fetch(`/api/queue?${params}`)

      if (!response.ok) {
        throw new Error("Failed to get queue data")
      }

      const data = await response.json()

      // Get predictions for each queue entry
      const queueWithPredictions = await Promise.all(
        data.queue.map(async (entry: QueueEntry) => {
          const prediction = await this.getPrediction(entry.id, true)
          return {
            ...entry,
            prediction,
          }
        }),
      )

      return {
        ...data,
        queue: queueWithPredictions,
      }
    } catch (error) {
      console.error("[v0] AI Service queue error:", error)
      return null
    }
  }

  /**
   * Add new patient to queue with immediate prediction
   */
  static async addPatientWithPrediction(patientData: {
    name: string
    phone?: string
    age?: number
    symptoms: string
    priority_level: 1 | 2 | 3 | 4
    hospital_id: number
    department_id: number
  }) {
    try {
      // Add patient to queue
      const response = await fetch("/api/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      })

      if (!response.ok) {
        throw new Error("Failed to add patient")
      }

      const data = await response.json()

      // Get immediate prediction for the new patient
      const prediction = await this.getPrediction(data.queueEntry.id, true)

      return {
        ...data,
        prediction,
      }
    } catch (error) {
      console.error("[v0] AI Service add patient error:", error)
      return null
    }
  }

  /**
   * Get emergency prioritization recommendations
   */
  static async getEmergencyRecommendations(hospitalId: number) {
    try {
      const queueData = await this.getQueueWithPredictions(hospitalId)
      if (!queueData) return null

      // Filter emergency cases
      const emergencyCases = queueData.queue.filter((entry: any) => entry.priority_level === 1)

      // Sort by arrival time and severity
      const prioritizedCases = emergencyCases.sort((a: any, b: any) => {
        // First by arrival time for emergency cases
        return new Date(a.arrival_time).getTime() - new Date(b.arrival_time).getTime()
      })

      return {
        emergencyCases: prioritizedCases,
        totalEmergencies: emergencyCases.length,
        recommendations: prioritizedCases.map((case_: any) => ({
          patientId: case_.patient_id,
          patientName: case_.patient?.name,
          symptoms: case_.symptoms,
          waitTime: case_.prediction?.estimatedWaitTime || 0,
          urgencyLevel: this.calculateUrgencyLevel(case_.symptoms),
          recommendation: this.getEmergencyRecommendation(case_.symptoms),
        })),
      }
    } catch (error) {
      console.error("[v0] AI Service emergency recommendations error:", error)
      return null
    }
  }

  private static calculateUrgencyLevel(symptoms: string): "critical" | "high" | "moderate" {
    const criticalKeywords = ["chest pain", "heart attack", "stroke", "severe bleeding", "unconscious"]
    const highKeywords = ["difficulty breathing", "severe pain", "high fever", "allergic reaction"]

    const lowerSymptoms = symptoms.toLowerCase()

    if (criticalKeywords.some((keyword) => lowerSymptoms.includes(keyword))) {
      return "critical"
    }

    if (highKeywords.some((keyword) => lowerSymptoms.includes(keyword))) {
      return "high"
    }

    return "moderate"
  }

  private static getEmergencyRecommendation(symptoms: string): string {
    const lowerSymptoms = symptoms.toLowerCase()

    if (lowerSymptoms.includes("chest pain")) {
      return "Immediate cardiac evaluation required. Monitor vital signs continuously."
    }

    if (lowerSymptoms.includes("difficulty breathing")) {
      return "Respiratory assessment needed. Ensure oxygen availability."
    }

    if (lowerSymptoms.includes("severe pain")) {
      return "Pain management and underlying cause investigation required."
    }

    return "Standard emergency protocol. Monitor patient condition."
  }
}
