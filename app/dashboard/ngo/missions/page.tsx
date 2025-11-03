"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MissionsPage() {
  const missions = [
    {
      id: 1,
      title: "Community Garden Cleanup",
      category: "Environment",
      date: "Oct 25, 2025",
      volunteers: 8,
      capacity: 15,
      status: "active",
      description: "Help us clean and maintain our community garden",
    },
    {
      id: 2,
      title: "Tutoring Session",
      category: "Education",
      date: "Oct 28, 2025",
      volunteers: 3,
      capacity: 5,
      status: "active",
      description: "Teach math to high school students",
    },
    {
      id: 3,
      title: "Beach Cleanup Drive",
      category: "Environment",
      date: "Nov 5, 2025",
      volunteers: 0,
      capacity: 20,
      status: "draft",
      description: "Join us for a beach cleanup initiative",
    },
    {
      id: 4,
      title: "Food Bank Sorting",
      category: "Community",
      date: "Oct 20, 2025",
      volunteers: 12,
      capacity: 12,
      status: "completed",
      description: "Sort and organize food donations",
    },
  ]

  return (
    <DashboardLayout userRole="ngo">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Missions</h1>
            <p className="text-foreground-light">Manage all your volunteering missions</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/ngo/create-mission">Create Mission</Link>
          </Button>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          {missions.map((mission) => (
            <Card key={mission.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-foreground">{mission.title}</h3>
                      <Badge
                        variant={
                          mission.status === "active" ? "success" : mission.status === "draft" ? "default" : "secondary"
                        }
                      >
                        {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground-light mb-3">{mission.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-foreground-light mb-1">Category</p>
                    <p className="font-medium text-foreground">{mission.category}</p>
                  </div>
                  <div>
                    <p className="text-foreground-light mb-1">Date</p>
                    <p className="font-medium text-foreground">{mission.date}</p>
                  </div>
                  <div>
                    <p className="text-foreground-light mb-1">Volunteers</p>
                    <p className="font-medium text-foreground">
                      {mission.volunteers}/{mission.capacity}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground-light mb-1">Capacity</p>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(mission.volunteers / mission.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Edit
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
