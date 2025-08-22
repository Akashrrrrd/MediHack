"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, Stethoscope, Search, MoreHorizontal } from "lucide-react"
import type { QueueEntry } from "@/lib/types"

interface QueueManagementProps {
  queue: QueueEntry[]
  onRefresh: () => void
}

export function QueueManagement({ queue, onRefresh }: QueueManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState<QueueEntry | null>(null)

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
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getElapsedTime = (arrivalTime: string) => {
    const elapsed = Math.floor((Date.now() - new Date(arrivalTime).getTime()) / 60000)
    return formatWaitTime(elapsed)
  }

  // Filter queue based on search and filters
  const filteredQueue = queue.filter((entry) => {
    const matchesSearch =
      !searchTerm ||
      entry.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.symptoms?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = filterDepartment === "all" || entry.department_id.toString() === filterDepartment

    const matchesPriority = filterPriority === "all" || entry.priority_level.toString() === filterPriority

    return matchesSearch && matchesDepartment && matchesPriority
  })

  // Get unique departments for filter
  const departments = Array.from(
    new Set(
      queue.map((entry) => ({
        id: entry.department_id,
        name: entry.department?.name || "Unknown",
      })),
    ),
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Queue Management</CardTitle>
          <CardDescription>Monitor and manage patient queue across all departments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="1">Emergency</SelectItem>
                <SelectItem value="2">Urgent</SelectItem>
                <SelectItem value="3">Routine</SelectItem>
                <SelectItem value="4">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Queue Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead>Estimated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueue.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No patients found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQueue.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{entry.patient?.name}</div>
                          <div className="text-sm text-muted-foreground">Age: {entry.patient?.age || "N/A"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{entry.department?.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(entry.priority_level)}>
                          {getPriorityLabel(entry.priority_level)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{entry.doctor?.name || "Unassigned"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{getElapsedTime(entry.arrival_time)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {entry.prediction?.estimatedWaitTime
                            ? formatWaitTime(entry.prediction.estimatedWaitTime)
                            : "Calculating..."}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(entry)}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Patient Details</DialogTitle>
                              <DialogDescription>Detailed information for {entry.patient?.name}</DialogDescription>
                            </DialogHeader>
                            {selectedPatient && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                                    <p className="text-foreground">{selectedPatient.patient?.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Age</label>
                                    <p className="text-foreground">{selectedPatient.patient?.age || "N/A"}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                    <p className="text-foreground">{selectedPatient.patient?.phone || "N/A"}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Priority</label>
                                    <Badge variant={getPriorityColor(selectedPatient.priority_level)}>
                                      {getPriorityLabel(selectedPatient.priority_level)}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Symptoms</label>
                                  <p className="text-foreground">{selectedPatient.symptoms}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">AI Prediction</label>
                                  <p className="text-foreground">
                                    {selectedPatient.prediction?.estimatedWaitTime
                                      ? `${formatWaitTime(selectedPatient.prediction.estimatedWaitTime)} (${Math.round((selectedPatient.prediction.confidence || 0) * 100)}% confidence)`
                                      : "Calculating..."}
                                  </p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Showing {filteredQueue.length} of {queue.length} patients
            </span>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
