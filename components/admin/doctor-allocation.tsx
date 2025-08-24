"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Stethoscope, Users, Clock, CheckCircle } from "lucide-react"

interface DoctorAllocationProps {
  hospitalId: number
}

export function DoctorAllocation({ hospitalId }: DoctorAllocationProps) {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock doctor data - in real app, fetch from API
    const mockDoctors = [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialization: "Emergency Medicine",
        department: "Emergency Department",
        currentPatients: 2,
        maxCapacity: 4,
        avgConsultationTime: 20,
        isAvailable: true,
        nextAvailable: null
      },
      {
        id: 2,
        name: "Dr. Emily Rodriguez", 
        specialization: "Internal Medicine",
        department: "General Medicine",
        currentPatients: 1,
        maxCapacity: 3,
        avgConsultationTime: 15,
        isAvailable: true,
        nextAvailable: null
      },
      {
        id: 3,
        name: "Dr. Robert Kim",
        specialization: "Cardiology", 
        department: "Cardiology",
        currentPatients: 1,
        maxCapacity: 2,
        avgConsultationTime: 25,
        isAvailable: true,
        nextAvailable: null
      },
      {
        id: 4,
        name: "Dr. Lisa Thompson",
        specialization: "Pediatrics",
        department: "Pediatrics", 
        currentPatients: 1,
        maxCapacity: 3,
        avgConsultationTime: 18,
        isAvailable: true,
        nextAvailable: null
      }
    ]
    
    setDoctors(mockDoctors)
    setLoading(false)
  }, [hospitalId])

  const getUtilizationColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 90) return "destructive"
    if (percentage >= 70) return "secondary" 
    return "outline"
  }

  const getUtilizationPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading doctor allocation...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Doctor Allocation</CardTitle>
          <CardDescription>Monitor doctor workload and optimize patient assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-primary" />
                        <div>
                          <h4 className="font-medium text-sm">{doctor.name}</h4>
                          <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                        </div>
                      </div>
                      {doctor.isAvailable ? (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Busy</Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium">{doctor.department}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current Load:</span>
                        <Badge variant={getUtilizationColor(doctor.currentPatients, doctor.maxCapacity)}>
                          {doctor.currentPatients}/{doctor.maxCapacity} ({getUtilizationPercentage(doctor.currentPatients, doctor.maxCapacity)}%)
                        </Badge>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg Time:</span>
                        <span className="font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {doctor.avgConsultationTime}m
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          getUtilizationPercentage(doctor.currentPatients, doctor.maxCapacity) >= 90 
                            ? 'bg-destructive' 
                            : getUtilizationPercentage(doctor.currentPatients, doctor.maxCapacity) >= 70
                            ? 'bg-secondary'
                            : 'bg-primary'
                        }`}
                        style={{ 
                          width: `${getUtilizationPercentage(doctor.currentPatients, doctor.maxCapacity)}%` 
                        }}
                      />
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      disabled={!doctor.isAvailable}
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Assign Patient
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Allocation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{doctors.length}</div>
              <div className="text-sm text-muted-foreground">Total Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {doctors.filter(d => d.isAvailable).length}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {doctors.reduce((sum, d) => sum + d.currentPatients, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Active Patients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(doctors.reduce((sum, d) => sum + d.avgConsultationTime, 0) / doctors.length)}m
              </div>
              <div className="text-sm text-muted-foreground">Avg Consultation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}