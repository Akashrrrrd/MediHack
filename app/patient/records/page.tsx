"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Heart,
  Activity,
  AlertTriangle,
  ArrowLeft
} from "lucide-react"
import { Header } from "@/components/header"
import { useSession } from "@/hooks/use-session"
import Link from "next/link"

export default function PatientRecordsPage() {
  const { session } = useSession()
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    // Mock patient records based on session
    if (session?.patientId) {
      setRecords([
        {
          id: 1,
          date: new Date().toISOString(),
          hospital: session.hospitalName,
          department: "Emergency Department",
          symptoms: "Chest pain, shortness of breath",
          diagnosis: "Anxiety-related chest pain",
          doctor: "Dr. Sarah Johnson",
          waitTime: 25,
          status: "completed",
          priority: 1
        },
        {
          id: 2,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          hospital: "Metro Emergency Center",
          department: "General Medicine",
          symptoms: "Annual checkup",
          diagnosis: "Routine physical examination - normal",
          doctor: "Dr. Emily Rodriguez",
          waitTime: 35,
          status: "completed",
          priority: 3
        }
      ])
    }
  }, [session])

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return "destructive"
      case 2: return "secondary"
      case 3: return "outline"
      default: return "outline"
    }
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return "Emergency"
      case 2: return "Urgent"
      case 3: return "Routine"
      default: return "Unknown"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!session?.patientId) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPage="records" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please join a hospital queue first to access your patient records.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link href="/patient">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Patient Portal
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="records" />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Patient Records</h1>
            <p className="text-muted-foreground">Your medical visit history and records</p>
          </div>
          <Link href="/patient">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portal
            </Button>
          </Link>
        </div>

        {/* Patient Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Patient ID</label>
                <p className="text-foreground">#{session.patientId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Hospital</label>
                <p className="text-foreground">{session.hospitalName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Visit</label>
                <p className="text-foreground">
                  {records.length > 0 ? formatDate(records[0].date) : "No visits recorded"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Visits</label>
                <p className="text-foreground">{records.length} visits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visit History */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-foreground">Visit History</h2>
          
          {records.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Records Found</h3>
                <p className="text-muted-foreground">
                  Your visit history will appear here after you complete medical appointments.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Heart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{record.hospital}</CardTitle>
                          <CardDescription>{record.department}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getPriorityColor(record.priority)}>
                          {getPriorityLabel(record.priority)}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(record.date)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Symptoms</label>
                        <p className="text-foreground">{record.symptoms}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Diagnosis</label>
                        <p className="text-foreground">{record.diagnosis}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Attending Doctor</label>
                        <p className="text-foreground">{record.doctor}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Wait Time</label>
                        <p className="text-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {record.waitTime} minutes
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Visit Completed</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Health Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Health Summary
            </CardTitle>
            <CardDescription>Overview of your recent medical activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{records.length}</div>
                <div className="text-sm text-muted-foreground">Total Visits</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {records.length > 0 ? Math.round(records.reduce((sum, r) => sum + r.waitTime, 0) / records.length) : 0}m
                </div>
                <div className="text-sm text-muted-foreground">Avg Wait Time</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {records.filter(r => r.priority === 1).length}
                </div>
                <div className="text-sm text-muted-foreground">Emergency Visits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}