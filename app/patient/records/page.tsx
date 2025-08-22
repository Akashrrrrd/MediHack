"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, MapPin, User, FileText, Activity, Download, RefreshCw } from "lucide-react"
import { Header } from "@/components/header"
import { useSession } from "@/hooks/use-session"
import { useRouter } from "next/navigation"

export default function PatientRecordsPage() {
  const { session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push("/patient")
    }
  }, [session, router])

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPage="records" />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>Please join a hospital queue first to access your patient records.</AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "secondary"
      case "in-progress":
        return "default"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  // Mock patient history data
  const patientHistory = [
    {
      id: 1,
      date: "2024-01-15",
      hospital: session.hospitalName,
      department: "Emergency",
      symptoms: "Chest pain, shortness of breath",
      waitTime: 45,
      status: "completed",
      diagnosis: "Anxiety attack, discharged with medication",
    },
    {
      id: 2,
      date: "2024-01-10",
      hospital: "Metro Emergency Center",
      department: "General Medicine",
      symptoms: "Fever, headache",
      waitTime: 30,
      status: "completed",
      diagnosis: "Viral infection, prescribed rest and fluids",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="records" />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Patient Records</h1>
            <p className="text-muted-foreground">Your medical history and current queue status</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLoading(!loading)} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Current Queue Status */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Current Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Hospital</span>
                </div>
                <p className="text-sm text-muted-foreground">{session.hospitalName}</p>
              </div>

              <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-secondary" />
                  <span className="font-medium text-foreground">Patient</span>
                </div>
                <p className="text-sm text-muted-foreground">{session.patientName}</p>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-foreground">Wait Time</span>
                </div>
                <p className="text-sm text-muted-foreground">{formatTime(session.estimatedWaitTime || 0)}</p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-foreground">Queue Position</span>
                </div>
                <p className="text-sm text-muted-foreground">#{session.queuePosition || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Visit</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Current Visit Details</CardTitle>
                <CardDescription>Information about your current hospital visit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Patient Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{session.patientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age:</span>
                          <span className="font-medium">{session.age} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">{session.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">Visit Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-in Time:</span>
                          <span className="font-medium">{new Date(session.joinedAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Priority Level:</span>
                          <Badge variant={session.priorityLevel === 1 ? "destructive" : "secondary"}>
                            {session.priorityLevel === 1 ? "Emergency" : "Regular"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Symptoms</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {session.symptoms || "No symptoms recorded"}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">Queue Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Waiting in queue</span>
                        </div>
                        <p className="text-xs text-muted-foreground ml-5">
                          Estimated wait time updates every 30 seconds
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold">Medical History</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Records
              </Button>
            </div>

            <div className="space-y-4">
              {patientHistory.map((visit) => (
                <Card key={visit.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-base font-serif">{visit.hospital}</CardTitle>
                          <CardDescription>
                            {new Date(visit.date).toLocaleDateString()} • {visit.department}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(visit.status)}>{visit.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-foreground mb-2">Symptoms</h5>
                        <p className="text-sm text-muted-foreground">{visit.symptoms}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground mb-2">Outcome</h5>
                        <p className="text-sm text-muted-foreground">{visit.diagnosis}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Wait time: {formatTime(visit.waitTime)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
