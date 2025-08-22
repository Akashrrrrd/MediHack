"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Clock, AlertTriangle, TrendingUp, UserCheck, BarChart3, RefreshCw, Bell } from "lucide-react"
import { useAIPredictions } from "@/hooks/use-ai-predictions"
import { QueueManagement } from "@/components/admin/queue-management"
import { DoctorAllocation } from "@/components/admin/doctor-allocation"
import { EmergencyManagement } from "@/components/admin/emergency-management"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { RealtimeQueueStatus } from "@/components/realtime-queue-status"
import { LiveNotifications } from "@/components/live-notifications"
import { Header } from "@/components/header"

export default function AdminDashboard() {
  const [selectedHospital, setSelectedHospital] = useState(1)
  const [selectedHospitalName, setSelectedHospitalName] = useState("City General Hospital")
  const [notifications, setNotifications] = useState<string[]>([])
  const { queue, loading, stats, lastUpdated, refetch } = useAIPredictions({
    hospitalId: selectedHospital,
    refreshInterval: 10000, // 10 seconds for admin dashboard
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const hospitalParam = urlParams.get("hospital")
    const storedHospital = localStorage.getItem("selectedHospital")

    if (hospitalParam) {
      try {
        const hospitalData = JSON.parse(decodeURIComponent(hospitalParam))
        setSelectedHospital(hospitalData.id || 1)
        setSelectedHospitalName(hospitalData.name || "City General Hospital")
      } catch (e) {
        console.error("Error parsing hospital param:", e)
      }
    } else if (storedHospital) {
      try {
        const hospitalData = JSON.parse(storedHospital)
        setSelectedHospital(hospitalData.id || 1)
        setSelectedHospitalName(hospitalData.name || "City General Hospital")
      } catch (e) {
        console.error("Error parsing stored hospital:", e)
      }
    }
  }, [])

  // Calculate department-wise stats
  const departmentStats = queue.reduce(
    (acc, entry) => {
      const deptId = entry.department_id
      if (!acc[deptId]) {
        acc[deptId] = {
          name: entry.department?.name || "Unknown",
          waiting: 0,
          emergency: 0,
          avgWait: 0,
          totalWait: 0,
        }
      }
      acc[deptId].waiting++
      if (entry.priority_level === 1) acc[deptId].emergency++
      acc[deptId].totalWait += entry.prediction?.estimatedWaitTime || 0
      acc[deptId].avgWait = Math.round(acc[deptId].totalWait / acc[deptId].waiting)
      return acc
    },
    {} as Record<number, any>,
  )

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getStatusColor = (count: number, threshold: number) => {
    if (count === 0) return "text-muted-foreground"
    if (count <= threshold) return "text-primary"
    if (count <= threshold * 2) return "text-secondary"
    return "text-destructive"
  }

  const updateNotifications = useCallback(() => {
    const newNotifications: string[] = []

    if (stats.emergencyCases > 0) {
      newNotifications.push(`${stats.emergencyCases} emergency cases require immediate attention`)
    }

    if (stats.longestWait > 120) {
      newNotifications.push(`Patient waiting over ${formatTime(stats.longestWait)} - review priority`)
    }

    setNotifications(newNotifications)
  }, [stats.emergencyCases, stats.longestWait])

  useEffect(() => {
    updateNotifications()
  }, [updateNotifications])

  return (
    <div className="min-h-screen bg-background">
      <LiveNotifications hospitalId={selectedHospital.toString()} isAdmin={true} />

      <Header currentPage="admin" />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-foreground">{selectedHospitalName}</h2>
            <p className="text-muted-foreground">Real-time Operations Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            {notifications.length > 0 && (
              <div className="relative">
                <Bell className="w-5 h-5 text-destructive" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs"></span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated?.toLocaleTimeString() || "Never"}
            </div>
          </div>
        </div>

        <RealtimeQueueStatus hospitalId={selectedHospital.toString()} />

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{notification}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Waiting</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(stats.totalWaiting, 20)}`}>{stats.totalWaiting}</div>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${stats.emergencyCases > 0 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {stats.emergencyCases}
              </div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Wait</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(stats.averageWaitTime, 30)}`}>
                {formatTime(stats.averageWaitTime)}
              </div>
              <p className="text-xs text-muted-foreground">System-wide average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Department Status</CardTitle>
              <CardDescription>Real-time overview of all departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(departmentStats).map((dept: any, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{dept.name}</h4>
                      {dept.emergency > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {dept.emergency} Emergency
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Waiting:</span>
                        <span className="font-medium">{dept.waiting}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg Wait:</span>
                        <span className="font-medium">{formatTime(dept.avgWait)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Longest Wait</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(stats.longestWait, 60)}`}>
                {formatTime(stats.longestWait)}
              </div>
              <p className="text-xs text-muted-foreground">Needs attention if over 2h</p>
            </CardContent>
          </Card>
        </div>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Department Status</CardTitle>
            <CardDescription>Real-time overview of all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(departmentStats).map((dept: any, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{dept.name}</h4>
                    {dept.emergency > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {dept.emergency} Emergency
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Waiting:</span>
                      <span className="font-medium">{dept.waiting}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Wait:</span>
                      <span className="font-medium">{formatTime(dept.avgWait)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="queue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
            <TabsTrigger value="queue" className="gap-2 text-xs md:text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Queue Management</span>
              <span className="sm:hidden">Queue</span>
            </TabsTrigger>
            <TabsTrigger value="allocation" className="gap-2 text-xs md:text-sm">
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Doctor Allocation</span>
              <span className="sm:hidden">Doctors</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="gap-2 text-xs md:text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency Cases</span>
              <span className="sm:hidden">Emergency</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 text-xs md:text-sm">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-6">
            <QueueManagement queue={queue} onRefresh={refetch} />
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <DoctorAllocation hospitalId={selectedHospital} />
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <EmergencyManagement hospitalId={selectedHospital} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard hospitalId={selectedHospital} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
