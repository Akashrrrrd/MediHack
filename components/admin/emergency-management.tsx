"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Clock, User, Stethoscope, Phone } from "lucide-react"

interface EmergencyManagementProps {
  hospitalId: number
}

export function EmergencyManagement({ hospitalId }: EmergencyManagementProps) {
  const [emergencyCases, setEmergencyCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock emergency data - in real app, fetch from API
    const mockEmergencies = [
      {
        id: 1,
        patientName: "Robert Chen",
        age: 52,
        symptoms: "Severe chest pain, difficulty breathing",
        arrivalTime: new Date(Date.now() - 12 * 60000).toISOString(),
        waitTime: 12,
        priority: 1,
        triageScore: 95,
        department: "Emergency Department",
        assignedDoctor: "Dr. Sarah Johnson",
        vitalSigns: {
          heartRate: 110,
          bloodPressure: "160/95",
          temperature: 98.6,
          oxygenSat: 94
        },
        status: "waiting"
      }
    ]
    
    setEmergencyCases(mockEmergencies)
    setLoading(false)
  }, [hospitalId])

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return "destructive"
      case 2: return "secondary"
      default: return "outline"
    }
  }

  const getTriageColor = (score: number) => {
    if (score >= 90) return "text-red-600"
    if (score >= 70) return "text-orange-600"
    return "text-yellow-600"
  }

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading emergency cases...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Emergency Alert */}
      {emergencyCases.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{emergencyCases.length} critical emergency case(s)</strong> require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Emergency Case Management
          </CardTitle>
          <CardDescription>Monitor and manage critical emergency cases</CardDescription>
        </CardHeader>
        <CardContent>
          {emergencyCases.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Emergency Cases</h3>
              <p className="text-muted-foreground">All emergency cases have been resolved.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emergencyCases.map((case_) => (
                <Card key={case_.id} className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Patient Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-800">{case_.patientName}</h4>
                            <p className="text-sm text-red-600">Age: {case_.age} • {case_.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">Critical</Badge>
                          <p className="text-sm text-red-600 mt-1">
                            Triage Score: <span className={`font-bold ${getTriageColor(case_.triageScore)}`}>
                              {case_.triageScore}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Symptoms */}
                      <div>
                        <label className="text-sm font-medium text-red-700">Presenting Symptoms</label>
                        <p className="text-red-800">{case_.symptoms}</p>
                      </div>

                      {/* Vital Signs */}
                      <div>
                        <label className="text-sm font-medium text-red-700">Vital Signs</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                          <div className="bg-white/50 p-2 rounded">
                            <div className="text-xs text-red-600">Heart Rate</div>
                            <div className="font-semibold text-red-800">{case_.vitalSigns.heartRate} bpm</div>
                          </div>
                          <div className="bg-white/50 p-2 rounded">
                            <div className="text-xs text-red-600">Blood Pressure</div>
                            <div className="font-semibold text-red-800">{case_.vitalSigns.bloodPressure}</div>
                          </div>
                          <div className="bg-white/50 p-2 rounded">
                            <div className="text-xs text-red-600">Temperature</div>
                            <div className="font-semibold text-red-800">{case_.vitalSigns.temperature}°F</div>
                          </div>
                          <div className="bg-white/50 p-2 rounded">
                            <div className="text-xs text-red-600">O2 Saturation</div>
                            <div className="font-semibold text-red-800">{case_.vitalSigns.oxygenSat}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-red-200">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-red-600" />
                            <span className="text-red-700">Waiting: {formatWaitTime(case_.waitTime)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Stethoscope className="w-4 h-4 text-red-600" />
                            <span className="text-red-700">{case_.assignedDoctor}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                            <Phone className="w-3 h-3 mr-1" />
                            Call Doctor
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                            Escalate Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Protocols */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Emergency Protocols</CardTitle>
          <CardDescription>Quick access to emergency procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start h-auto p-3">
              <div className="text-left">
                <div className="font-medium">Code Blue</div>
                <div className="text-xs text-muted-foreground">Cardiac/Respiratory Arrest</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-3">
              <div className="text-left">
                <div className="font-medium">Code Red</div>
                <div className="text-xs text-muted-foreground">Fire Emergency</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-3">
              <div className="text-left">
                <div className="font-medium">Code Silver</div>
                <div className="text-xs text-muted-foreground">Weapon/Hostage</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-3">
              <div className="text-left">
                <div className="font-medium">Trauma Alert</div>
                <div className="text-xs text-muted-foreground">Major Trauma Incoming</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-3">
              <div className="text-left">
                <div className="font-medium">Mass Casualty</div>
                <div className="text-xs text-muted-foreground">Multiple Patients</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-3">
              <div className="text-left">
                <div className="font-medium">Stroke Alert</div>
                <div className="text-xs text-muted-foreground">Acute Stroke Protocol</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}