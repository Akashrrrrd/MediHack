"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Users, TrendingUp, Calendar } from "lucide-react"

interface PatientAnalyticsProps {
  hospitalName: string
  currentWaitTime: number
  queuePosition: number
  estimatedTime: string
}

export function PatientAnalytics({
  hospitalName,
  currentWaitTime,
  queuePosition,
  estimatedTime,
}: PatientAnalyticsProps) {
  // Generate realistic patient-focused analytics
  const avgWaitTime = Math.floor(currentWaitTime * 1.2) // Slightly higher than current
  const patientsAhead = queuePosition - 1
  const completionRate = Math.max(20, 100 - currentWaitTime / 3) // Higher completion rate for shorter waits

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Wait Time</CardTitle>
          <Clock className="h-4 w-4 text-healthcare-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-healthcare-primary">{currentWaitTime} min</div>
          <p className="text-xs text-muted-foreground">Estimated completion: {estimatedTime}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Queue Position</CardTitle>
          <Users className="h-4 w-4 text-healthcare-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-healthcare-secondary">#{queuePosition}</div>
          <p className="text-xs text-muted-foreground">{patientsAhead} patients ahead of you</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-healthcare-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-healthcare-accent">{avgWaitTime} min</div>
          <p className="text-xs text-muted-foreground">At {hospitalName}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Service Rate</CardTitle>
          <Calendar className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{Math.round(completionRate)}%</div>
          <Progress value={completionRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">On-time completion rate</p>
        </CardContent>
      </Card>
    </div>
  )
}
