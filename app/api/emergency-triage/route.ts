import { type NextRequest, NextResponse } from "next/server"
import { EmergencyTriageSystem } from "@/lib/emergency-triage"
import { DatabaseService } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { patientId, vitalSigns, painLevel, consciousness } = await request.json()

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    // Get patient data
    const queueEntry = await DatabaseService.getQueueEntry(patientId)
    if (!queueEntry) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    const waitTime = Math.floor((Date.now() - new Date(queueEntry.arrival_time).getTime()) / 60000)

    // Calculate triage score
    const triageScore = EmergencyTriageSystem.calculateTriageScore(
      queueEntry.symptoms || "",
      queueEntry.patient?.age || 0,
      vitalSigns,
      painLevel,
      consciousness,
      waitTime,
    )

    // Check for immediate escalation
    const escalation = EmergencyTriageSystem.requiresImmediateEscalation(
      queueEntry.symptoms || "",
      waitTime,
      vitalSigns,
    )

    // Get applicable protocols
    const protocols = EmergencyTriageSystem.getApplicableProtocols(queueEntry.symptoms || "")

    // Update priority level based on triage score
    let newPriorityLevel: 1 | 2 | 3 | 4
    switch (triageScore.category) {
      case "resuscitation":
      case "emergent":
        newPriorityLevel = 1
        break
      case "urgent":
        newPriorityLevel = 2
        break
      case "less-urgent":
        newPriorityLevel = 3
        break
      default:
        newPriorityLevel = 4
    }

    // Update queue entry if priority changed
    if (newPriorityLevel !== queueEntry.priority_level) {
      await DatabaseService.updateQueueEntry(patientId, {
        priority_level: newPriorityLevel,
      })
    }

    return NextResponse.json({
      success: true,
      triageScore,
      escalation,
      protocols,
      priorityUpdated: newPriorityLevel !== queueEntry.priority_level,
      newPriorityLevel,
    })
  } catch (error) {
    console.error("[v0] Emergency triage API error:", error)
    return NextResponse.json({ error: "Failed to process triage assessment" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hospitalId = searchParams.get("hospitalId")

    if (!hospitalId) {
      return NextResponse.json({ error: "Hospital ID is required" }, { status: 400 })
    }

    // Get all emergency cases
    const allPatients = await DatabaseService.getQueueEntries(Number.parseInt(hospitalId))
    const emergencyPatients = allPatients.filter((patient) => patient.priority_level <= 2)

    // Calculate triage scores for all emergency patients
    const prioritizedPatients = EmergencyTriageSystem.prioritizePatients(
      emergencyPatients.map((patient) => ({
        id: patient.id,
        symptoms: patient.symptoms || "",
        age: patient.patient?.age || 0,
        arrivalTime: patient.arrival_time,
      })),
    )

    // Check for escalations
    const escalations = prioritizedPatients
      .map(({ patient, triageScore }) => {
        const waitTime = Math.floor((Date.now() - new Date(patient.arrivalTime).getTime()) / 60000)
        const escalation = EmergencyTriageSystem.requiresImmediateEscalation(patient.symptoms, waitTime)
        return escalation.required ? { patient, escalation, triageScore } : null
      })
      .filter(Boolean)

    return NextResponse.json({
      success: true,
      totalEmergencies: emergencyPatients.length,
      prioritizedPatients,
      escalations,
      criticalCount: prioritizedPatients.filter((p) => p.triageScore.category === "resuscitation").length,
      emergentCount: prioritizedPatients.filter((p) => p.triageScore.category === "emergent").length,
    })
  } catch (error) {
    console.error("[v0] Emergency triage list API error:", error)
    return NextResponse.json({ error: "Failed to fetch emergency triage data" }, { status: 500 })
  }
}
