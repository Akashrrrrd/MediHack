"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Clock, Users, Activity } from "lucide-react"

interface AnalyticsDashboardProps {
  hospitalId: number
}

export function AnalyticsDashboard({ hospitalId }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState("today")

  // Mock analytics data
  const waitTimeData = [
    { hour: "8:00", emergency: 15, routine: 45, urgent: 25 },
    { hour: "9:00", emergency: 12, routine: 52, urgent: 30 },
    { hour: "10:00", emergency: 18, routine: 48, urgent: 28 },
    { hour: "11:00", emergency: 22, routine: 55, urgent: 35 },
    { hour: "12:00", emergency: 20, routine: 60, urgent: 40 },
    { hour: "13:00", emergency: 16, routine: 58, urgent: 32 },
    { hour: "14:00", emergency: 25, routine: 65, urgent: 45 },
    { hour: "15:00", emergency: 19, routine: 50, urgent: 38 },
    { hour: "16:00", emergency: 14, routine: 42, urgent: 28 },
    { hour: "17:00", emergency: 17, routine: 38, urgent: 25 },
  ]

  const departmentData = [
    { name: "Emergency", patients: 45, avgWait: 18, color: "#ef4444" },
    { name: "General Medicine", patients: 78, avgWait: 42, color: "#10b981" },
    { name: "Cardiology", patients: 23, avgWait: 35, color: "#6366f1" },
    { name: "Pediatrics", patients: 34, avgWait: 28, color: "#f97316" },
  ]

  const satisfactionData = [
    { name: "Excellent", value: 45, color: "#10b981" },
    { name: "Good", value: 32, color: "#84cc16" },
    { name: "Average", value: 18, color: "#f97316" },
    { name: "Poor", value: 5, color: "#ef4444" },
  ]

  const performanceMetrics = [
    { label: "Average Wait Time", value: "38 min", change: "-12%", trend: "down", icon: Clock },
    { label: "Patient Throughput", value: "180/day", change: "+8%", trend: "up", icon: Users },
    { label: "Emergency Response", value: "4.2 min", change: "-15%", trend: "down", icon: Activity },
    { label: "Satisfaction Score", value: "4.2/5", change: "+5%", trend: "up", icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif">Analytics Dashboard</CardTitle>
              <CardDescription>Comprehensive insights into hospital performance and patient flow</CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div
                className={`text-xs flex items-center gap-1 ${
                  metric.trend === "up" ? "text-primary" : "text-destructive"
                }`}
              >
                <TrendingUp className={`h-3 w-3 ${metric.trend === "down" ? "rotate-180" : ""}`} />
                {metric.change} from last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wait Times by Hour */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Wait Times by Hour</CardTitle>
            <CardDescription>Average wait times throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waitTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="emergency" stroke="#ef4444" strokeWidth={2} name="Emergency" />
                <Line type="monotone" dataKey="urgent" stroke="#f97316" strokeWidth={2} name="Urgent" />
                <Line type="monotone" dataKey="routine" stroke="#10b981" strokeWidth={2} name="Routine" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Department Performance</CardTitle>
            <CardDescription>Patient volume and average wait times</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#10b981" name="Patients" />
                <Bar dataKey="avgWait" fill="#6366f1" name="Avg Wait (min)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Patient Satisfaction</CardTitle>
            <CardDescription>Satisfaction ratings distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">AI Insights</CardTitle>
            <CardDescription>Automated recommendations and trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="text-sm font-medium text-foreground">Peak Hours Identified</div>
                <div className="text-xs text-muted-foreground">
                  Highest patient volume between 11 AM - 2 PM. Consider additional staffing.
                </div>
              </div>

              <div className="p-3 bg-secondary/10 rounded-lg">
                <div className="text-sm font-medium text-foreground">Emergency Response Improved</div>
                <div className="text-xs text-muted-foreground">
                  15% reduction in emergency wait times this week compared to last week.
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium text-foreground">Cardiology Bottleneck</div>
                <div className="text-xs text-muted-foreground">
                  Cardiology department showing longer wait times. Review specialist availability.
                </div>
              </div>

              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="text-sm font-medium text-foreground">Patient Satisfaction Up</div>
                <div className="text-xs text-muted-foreground">
                  5% increase in satisfaction scores since implementing AI wait time predictions.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
