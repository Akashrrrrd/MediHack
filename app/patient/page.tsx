"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, MapPin, Phone, Heart, Activity, ArrowLeft } from "lucide-react"
import { useAIPredictions } from "@/hooks/use-ai-predictions"
import { PatientRegistrationForm } from "@/components/patient-registration-form"
import { EmergencyAlert } from "@/components/emergency-alert"
import { RealtimeQueueStatus } from "@/components/realtime-queue-status"
import { LiveNotifications } from "@/components/live-notifications"
import LocationHospitalFinder from "@/components/location-hospital-finder"
import { Header } from "@/components/header"
import { PatientAnalytics } from "@/components/patient-analytics"
import { useSession } from "@/hooks/use-session"

export default function PatientDashboard() {
  const { session, updateSession, isLoading } = useSession()
  const [patientId, setPatientId] = useState<number | null>(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null)
  const [selectedHospital, setSelectedHospital] = useState<any>(null)
  const [showHospitalSelector, setShowHospitalSelector] = useState(true)

  useEffect(() => {
    if (!isLoading && session) {
      setSelectedHospitalId(Number.parseInt(session.hospitalId))
      setSelectedHospital({
        name: session.hospitalName,
        address: session.hospitalAddress,
        phone: session.hospitalPhone,
      })
      setShowHospitalSelector(false)
      if (session.patientId) {
        setPatientId(Number.parseInt(session.patientId))
      }
    }
  }, [session, isLoading])

  const { queue, loading, stats, lastUpdated } = useAIPredictions({
    hospitalId: selectedHospitalId || 1,
    refreshInterval: 5000,
  })

  const currentPatient = patientId ? queue.find((entry) => entry.patient_id === patientId) : null

  const patientStats = {
    totalWaiting:
      queue.filter((entry) => entry.department_id === currentPatient?.department_id).length || stats.totalWaiting,
    averageWaitTime: stats.averageWaitTime,
    emergencyCases:
      queue.filter((entry) => entry.priority_level === 1 && entry.department_id === currentPatient?.department_id)
        .length || Math.min(stats.emergencyCases, 3),
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "destructive"
      case 2:
        return "secondary"
      case 3:
        return "outline"
      case 4:
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return "Emergency"
      case 2:
        return "Urgent"
      case 3:
        return "Routine"
      case 4:
        return "Follow-up"
      default:
        return "Unknown"
    }
  }

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const calculateProgress = () => {
    if (!currentPatient) return 0
    const totalEstimated = currentPatient.prediction?.estimatedWaitTime || 60
    const elapsed = Math.floor((Date.now() - new Date(currentPatient.arrival_time).getTime()) / 60000)
    return Math.min(100, (elapsed / totalEstimated) * 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPage="patient" />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading your session...</p>
          </div>
        </main>
      </div>
    )
  }

  if (showHospitalSelector && !selectedHospitalId) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPage="patient" />

        <main className="max-w-6xl mx-auto px-4 py-8">
          <LocationHospitalFinder
            onHospitalSelect={(hospitalId, hospitalData) => {
              setSelectedHospitalId(hospitalId)
              setSelectedHospital(hospitalData)
              setShowHospitalSelector(false)
              updateSession({
                hospitalId: hospitalId.toString(),
                hospitalName: hospitalData.name,
                hospitalAddress: hospitalData.address,
                hospitalPhone: hospitalData.phone,
              })
            }}
          />
        </main>
      </div>
    )
  }

  if (showRegistration) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPage="patient" />
        <PatientRegistrationForm
          hospitalId={selectedHospitalId || 1}
          onSuccess={(patient) => {
            setPatientId(patient.queueEntry.patient_id)
            setShowRegistration(false)
            updateSession({
              patientId: patient.queueEntry.patient_id.toString(),
              queuePosition: patient.queueEntry.queue_position,
              waitTime: patient.queueEntry.prediction?.estimatedWaitTime,
            })
          }}
          onCancel={() => setShowRegistration(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <LiveNotifications hospitalId={selectedHospitalId?.toString() || "1"} patientId={patientId?.toString()} />

      <Header currentPage="patient" />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowHospitalSelector(true)
              setSelectedHospitalId(null)
              setPatientId(null)
              updateSession({
                hospitalId: "",
                hospitalName: "",
                hospitalAddress: "",
                hospitalPhone: "",
                patientId: "",
                queuePosition: 0,
                waitTime: 0,
              })
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Hospital
          </Button>
          <EmergencyAlert />
        </div>

        <RealtimeQueueStatus hospitalId={selectedHospitalId?.toString() || "1"} patientId={patientId?.toString()} />

        {currentPatient && (
          <PatientAnalytics
            hospitalName={selectedHospital?.name || session?.hospitalName || "Your Selected Hospital"}
            currentWaitTime={currentPatient.prediction?.estimatedWaitTime || 0}
            queuePosition={
              queue.filter(
                (entry) =>
                  entry.department_id === currentPatient.department_id &&
                  entry.priority_level <= currentPatient.priority_level &&
                  new Date(entry.arrival_time) < new Date(currentPatient.arrival_time),
              ).length + 1
            }
            estimatedTime={
              currentPatient.prediction?.estimatedWaitTime
                ? new Date(Date.now() + currentPatient.prediction.estimatedWaitTime * 60000).toLocaleTimeString()
                : "Calculating..."
            }
          />
        )}

        {!currentPatient ? (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-foreground">
                Welcome to {selectedHospital?.name || session?.hospitalName || "Your Selected Hospital"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get real-time wait time estimates and stay informed about your visit. Our AI-powered system helps
                optimize your healthcare experience with predictive analytics and smart queue management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {formatWaitTime(patientStats.averageWaitTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Wait</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Activity className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">AI</div>
                  <div className="text-sm text-muted-foreground">Powered Predictions</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">24/7</div>
                  <div className="text-sm text-muted-foreground">Care Available</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-foreground mb-2">🤖 AI-Powered Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div>✓ Real-time wait predictions</div>
                  <div>✓ Emergency triage scoring</div>
                  <div>✓ Smart queue optimization</div>
                  <div>✓ Symptom-based prioritization</div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setShowRegistration(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
              >
                Join Queue & Get AI Wait Time Prediction
              </Button>
              <p className="text-sm text-muted-foreground">
                Register to receive personalized AI-powered wait time estimates and real-time updates
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-serif">Your Visit Status</CardTitle>
                    <CardDescription>Welcome back, {currentPatient.patient?.name}</CardDescription>
                  </div>
                  <Badge variant={getPriorityColor(currentPatient.priority_level)}>
                    {getPriorityLabel(currentPatient.priority_level)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">
                      {currentPatient.prediction?.estimatedWaitTime
                        ? formatWaitTime(currentPatient.prediction.estimatedWaitTime)
                        : "Calculating..."}
                    </div>
                    <div className="text-muted-foreground">Estimated wait time</div>
                  </div>

                  <div className="space-y-2">
                    <Progress value={calculateProgress()} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      You've been waiting for{" "}
                      {Math.floor((Date.now() - new Date(currentPatient.arrival_time).getTime()) / 60000)} minutes
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {queue.filter(
                        (entry) =>
                          entry.department_id === currentPatient.department_id &&
                          entry.priority_level <= currentPatient.priority_level &&
                          new Date(entry.arrival_time) < new Date(currentPatient.arrival_time),
                      ).length + 1}
                    </div>
                    <div className="text-sm text-muted-foreground">Position in Queue</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {currentPatient.department?.name || "Department"}
                    </div>
                    <div className="text-sm text-muted-foreground">Department</div>
                  </div>
                </div>

                {currentPatient.prediction?.factors?.aiInsights && (
                  <Alert>
                    <Activity className="h-4 w-4" />
                    <AlertDescription>
                      <strong>AI Recommendation:</strong> {currentPatient.prediction.factors.aiInsights.patientAdvice}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Visit Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Symptoms</label>
                    <p className="text-foreground">{currentPatient.symptoms}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Assigned Doctor</label>
                    <p className="text-foreground">{currentPatient.doctor?.name || "To be assigned"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Arrival Time</label>
                    <p className="text-foreground">{new Date(currentPatient.arrival_time).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Confidence Level</label>
                    <p className="text-foreground">
                      {currentPatient.prediction?.confidence
                        ? `${Math.round(currentPatient.prediction.confidence * 100)}%`
                        : "Calculating..."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">While You Wait</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Facilities Available</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Cafeteria (Level 1)</li>
                      <li>• Pharmacy (Level 1)</li>
                      <li>• Restrooms (All levels)</li>
                      <li>• Free WiFi: HospitalGuest</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Important Reminders</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Stay hydrated</li>
                      <li>• Keep your phone charged</li>
                      <li>• Inform staff of any changes</li>
                      <li>• Emergency button available</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>
                {selectedHospital?.address || session?.hospitalAddress || "123 Healthcare Ave, Medical District"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{selectedHospital?.phone || session?.hospitalPhone || "+1-555-0123"}</span>
            </div>
          </div>
          {lastUpdated && <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
          <p className="text-xs text-muted-foreground/70 mt-4">
            🏥 MediHack - AI-Powered Healthcare Solutions | Built with Next.js, OpenAI & Real-time Analytics
          </p>
        </div>
      </main>
    </div>
  )
}
