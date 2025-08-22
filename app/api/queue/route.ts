import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hospitalId = searchParams.get("hospitalId")
    const departmentId = searchParams.get("departmentId")

    const queueEntries = await DatabaseService.getQueueEntries(
      hospitalId ? Number.parseInt(hospitalId) : undefined,
      departmentId ? Number.parseInt(departmentId) : undefined,
    )

    return NextResponse.json({
      success: true,
      queue: queueEntries,
      totalWaiting: queueEntries.length,
    })
  } catch (error) {
    console.error("[v0] Queue API error:", error)
    return NextResponse.json({ error: "Failed to fetch queue data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const patientData = await request.json()

    // Validate required fields
    if (!patientData.name || !patientData.symptoms || !patientData.hospital_id || !patientData.department_id) {
      return NextResponse.json(
        { error: "Missing required fields: name, symptoms, hospital_id, department_id" },
        { status: 400 },
      )
    }

    // Add patient to queue
    const queueEntry = await DatabaseService.addPatientToQueue(patientData)

    return NextResponse.json({
      success: true,
      queueEntry,
      message: "Patient added to queue successfully",
    })
  } catch (error) {
    console.error("[v0] Add patient API error:", error)
    return NextResponse.json({ error: "Failed to add patient to queue" }, { status: 500 })
  }
}
