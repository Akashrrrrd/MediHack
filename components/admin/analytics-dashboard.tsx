"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Clock, Heart, Activity } from "lucide-react"

interface AnalyticsDashboardProps {
  hospitalId: number
}

export function AnalyticsDashboard({ hospitalId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock analytics data - in real app, fetch from API
    const mockAnalytics = {
      todayStats: {
        totalPatients: 47,
        avgWaitTime: 22,
        patientSatisfaction: 4.2,
        emergencyCases: 3,
        completedConsultations: 42,
        peakHour: "2:00 PM"
      },
      trends: {
        patientsChange: 12,
        waitTimeChange: -8,
        satisfactionChange: 0.3,
        emergencyChange: -1
      },
      departmentPerformance: [
        { name: "Emergency Department", patients: 8, avgWait: 15, satisfaction: 4.1 },
        { name: "General Medicine", patients: 18, avgWait: 28, satisfaction: 4.3 },
        { name: "Cardiology", patients: 12, avgWait: 25, satisfaction: 4.4 },
        { name: "Pediatrics", patients: 9, avgWait: 18, satisfaction: 4.5 }
      ],
      hourlyData: [
        { hour: "8 AM", patients: 3 },
        { hour: "9 AM", patients: 5 },
        { hour: "10 AM", patients: 8 },
        { hour: "11 AM", patients: 12 },
        { hour: "12 PM", patients: 15 },
        { hour: "1 PM", patients: 18 },
        { hour: "2 PM", patients: 22 },
        { hour: "3 PM", patients: 19 },
        { hour: "4 PM", patients: 16 },
        { hour: "5 PM", patients: 12 }
      ]
    }
    
    setAnalytics(mockAnalytics)
    setLoading(false)
  }, [hospitalId])

  const formatTrend = (value: number, type: "number" | "time" | "rating" = "number") => {
    const isPositive = value > 0
    const icon = isPositive ? TrendingUp : TrendingDown
    const color = type === "time" ? (isPositive ? "text-red-600" : "text-green-600") : 
                  (isPositive ? "text-green-600" : "text-red-600")
    
    let displayValue = Math.abs(value).toString()
    if (type === "time") displayValue += "m"
    if (type === "rating") displayValue = displayValue.slice(0, 3)
    
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {React.createElement(icon, { className: "w-3 h-3" })}
        <span className="text-xs">{isPositive ? "+" : "-"}{displayValue}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading analytics...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{analytics.todayStats.totalPatients}</p>
              </div>
              <div className="flex flex-col items-end">
                <Users className="w-4 h-4 text-muted-foreground mb-1" />
                {formatTrend(analytics.trends.patientsChange)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                <p className="text-2xl font-bold">{analytics.todayStats.avgWaitTime}m</p>
              </div>
              <div className="flex flex-col items-end">
                <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                {formatTrend(analytics.trends.waitTimeChange, "time")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Patient Satisfaction</p>
                <p className="text-2xl font-bold">{analytics.todayStats.patientSatisfaction}/5</p>
              </div>
              <div className="flex flex-col items-end">
                <Heart className="w-4 h-4 text-muted-foreground mb-1" />
                {formatTrend(analytics.trends.satisfactionChange, "rating")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emergency Cases</p>
                <p className="text-2xl font-bold">{analytics.todayStats.emergencyCases}</p>
              </div>
              <div className="flex flex-col items-end">
                <Activity className="w-4 h-4 text-muted-foreground mb-1" />
                {formatTrend(analytics.trends.emergencyChange)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Department Performance</CardTitle>
          <CardDescription>Today's performance metrics by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.departmentPerformance.map((dept: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{dept.name}</h4>
                  <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{dept.patients} patients</span>
                    <span>{dept.avgWait}m avg wait</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="font-medium">{dept.satisfaction}/5</span>
                  </div>
                  <Badge variant={dept.satisfaction >= 4.0 ? "outline" : "secondary"} className="mt-1">
                    {dept.satisfaction >= 4.5 ? "Excellent" : 
                     dept.satisfaction >= 4.0 ? "Good" : 
                     dept.satisfaction >= 3.5 ? "Fair" : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hourly Patient Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Patient Flow Today</CardTitle>
          <CardDescription>Hourly patient arrivals and peak times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Peak hour: <span className="font-medium text-foreground">{analytics.todayStats.peakHour}</span>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {analytics.hourlyData.map((data: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{data.hour}</div>
                  <div 
                    className="bg-primary/20 rounded-sm flex items-end justify-center text-xs font-medium"
                    style={{ height: `${Math.max(20, (data.patients / 22) * 60)}px` }}
                  >
                    {data.patients}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Today's Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Wait times improved by 8 minutes</p>
                <p className="text-sm text-green-700">AI optimization reduced average wait time compared to yesterday</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Patient satisfaction increased</p>
                <p className="text-sm text-blue-700">Satisfaction score improved by 0.3 points with better queue management</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-800">Peak efficiency at 2 PM</p>
                <p className="text-sm text-purple-700">Highest patient throughput with minimal wait times during afternoon shift</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}