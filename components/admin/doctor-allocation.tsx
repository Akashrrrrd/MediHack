"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { UserCheck, Clock, Users, TrendingUp, RefreshCw, Lightbulb } from "lucide-react"
import { AIService } from "@/lib/ai-service"

interface DoctorAllocationProps {
  hospitalId: number
}

interface AllocationData {
  allocation: Array<{
    doctorId: number
    patientIds: number[]
    reasoning?: string
  }>
  totalPatients: number
  availableDoctors: number
  optimizationTimestamp: string
}

export function DoctorAllocation({ hospitalId }: DoctorAllocationProps) {
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mockDoctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "Emergency Medicine", department: "Emergency", avgTime: 20 },
    { id: 2, name: "Dr. Michael Chen", specialization: "Emergency Medicine", department: "Emergency", avgTime: 18 },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialization: "Internal Medicine",
      department: "General Medicine",
      avgTime: 15,
    },
    { id: 5, name: "Dr. Robert Kim", specialization: "Cardiology", department: "Cardiology", avgTime: 25 },
  ]

  const fetchAllocation = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await AIService.getOptimizedAllocation(hospitalId)
      if (result) {
        setAllocationData(result)
      } else {
        setError("Failed to fetch allocation data")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllocation()
  }, [hospitalId])

  const getDoctorInfo = (doctorId: number) => {
    return (
      mockDoctors.find((doc) => doc.id === doctorId) || {
        id: doctorId,
        name: `Doctor ${doctorId}`,
        specialization: "General",
        department: "Unknown",
        avgTime: 20,
      }
    )
  }

  const calculateWorkload = (patientCount: number, avgTime: number) => {
    const totalMinutes = patientCount * avgTime
    const workloadPercentage = Math.min(100, (totalMinutes / 480) * 100) // 8-hour shift
    return workloadPercentage
  }

  const getWorkloadColor = (percentage: number) => {
    if (percentage < 60) return "text-primary"
    if (percentage < 80) return "text-secondary"
    return "text-destructive"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif">AI-Powered Doctor Allocation</CardTitle>
              <CardDescription>Optimize patient-doctor assignments for maximum efficiency</CardDescription>
            </div>
            <Button onClick={fetchAllocation} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Optimizing..." : "Optimize Allocation"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {allocationData && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{allocationData.totalPatients}</div>
                  <div className="text-sm text-muted-foreground">Total Patients</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{allocationData.availableDoctors}</div>
                  <div className="text-sm text-muted-foreground">Available Doctors</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {allocationData.totalPatients > 0
                      ? Math.round(allocationData.totalPatients / allocationData.availableDoctors)
                      : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Patients/Doctor</div>
                </div>
              </div>

              {/* Doctor Allocation Cards */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Current Allocation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allocationData.allocation.map((allocation) => {
                    const doctor = getDoctorInfo(allocation.doctorId)
                    const workloadPercentage = calculateWorkload(allocation.patientIds.length, doctor.avgTime)

                    return (
                      <Card key={allocation.doctorId} className="border-border/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base font-medium">{doctor.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {doctor.specialization} • {doctor.department}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="gap-1">
                              <Users className="w-3 h-3" />
                              {allocation.patientIds.length}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Workload Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Workload</span>
                              <span className={`font-medium ${getWorkloadColor(workloadPercentage)}`}>
                                {Math.round(workloadPercentage)}%
                              </span>
                            </div>
                            <Progress value={workloadPercentage} className="h-2" />
                          </div>

                          {/* Estimated Time */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Est. Time:</span>
                            </div>
                            <span className="font-medium">
                              {Math.round(((allocation.patientIds.length * doctor.avgTime) / 60) * 10) / 10}h
                            </span>
                          </div>

                          {/* AI Reasoning */}
                          {allocation.reasoning && (
                            <Alert>
                              <Lightbulb className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                <strong>AI Insight:</strong> {allocation.reasoning}
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Optimization Insights */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Optimization Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    • Load balancing optimized across {allocationData.availableDoctors} doctors
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Emergency cases prioritized for immediate attention
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Specialization matching considered for better outcomes
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Last optimized: {new Date(allocationData.optimizationTimestamp).toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!allocationData && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Click "Optimize Allocation" to get AI-powered doctor assignments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
