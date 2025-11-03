"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ApplicationsPage() {
  const applications = [
    {
      id: 1,
      missionTitle: "Community Garden Cleanup",
      organization: "Green Earth Initiative",
      appliedDate: "Oct 20, 2025",
      status: "accepted",
      missionDate: "Oct 25, 2025",
    },
    {
      id: 2,
      missionTitle: "Tutoring Session",
      organization: "Education for All",
      appliedDate: "Oct 22, 2025",
      status: "pending",
      missionDate: "Oct 28, 2025",
    },
    {
      id: 3,
      missionTitle: "Beach Cleanup Drive",
      organization: "Ocean Care",
      appliedDate: "Oct 15, 2025",
      status: "rejected",
      missionDate: "Oct 20, 2025",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "success"
      case "pending":
        return "default"
      case "rejected":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <DashboardLayout userRole="volunteer">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
          <p className="text-foreground-light">Track the status of your mission applications</p>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{app.missionTitle}</h3>
                    <p className="text-sm text-foreground-light">{app.organization}</p>
                  </div>
                  <Badge variant={getStatusColor(app.status)}>{getStatusLabel(app.status)}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-foreground-light mb-1">Applied</p>
                    <p className="font-medium text-foreground">{app.appliedDate}</p>
                  </div>
                  <div>
                    <p className="text-foreground-light mb-1">Mission Date</p>
                    <p className="font-medium text-foreground">{app.missionDate}</p>
                  </div>
                  <div>
                    <p className="text-foreground-light mb-1">Status</p>
                    <p className="font-medium text-foreground capitalize">{app.status}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {app.status === "accepted" && (
                    <>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      <Button className="flex-1">Mark as Complete</Button>
                    </>
                  )}
                  {app.status === "pending" && (
                    <>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Cancel Application
                      </Button>
                      <Button className="flex-1">View Details</Button>
                    </>
                  )}
                  {app.status === "rejected" && (
                    <Button variant="outline" className="w-full bg-transparent">
                      View Feedback
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
