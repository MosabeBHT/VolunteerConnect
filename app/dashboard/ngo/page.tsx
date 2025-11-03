"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NGODashboard() {
  const stats = [
    { label: "Active Missions", value: "5", icon: "📝" },
    { label: "Total Volunteers", value: "48", icon: "👥" },
    { label: "Hours Contributed", value: "320", icon: "⏱️" },
    { label: "Missions Completed", value: "12", icon: "✅" },
  ]

  const recentApplications = [
    {
      id: 1,
      volunteerName: "Sarah Johnson",
      mission: "Community Garden Cleanup",
      appliedDate: "Oct 23, 2025",
      status: "pending",
    },
    {
      id: 2,
      volunteerName: "Mike Chen",
      mission: "Community Garden Cleanup",
      appliedDate: "Oct 22, 2025",
      status: "accepted",
    },
    {
      id: 3,
      volunteerName: "Emma Davis",
      mission: "Tutoring Session",
      appliedDate: "Oct 21, 2025",
      status: "pending",
    },
  ]

  const activeMissions = [
    {
      id: 1,
      title: "Community Garden Cleanup",
      date: "Oct 25, 2025",
      volunteers: 8,
      status: "active",
    },
    {
      id: 2,
      title: "Tutoring Session",
      date: "Oct 28, 2025",
      volunteers: 3,
      status: "active",
    },
    {
      id: 3,
      title: "Beach Cleanup Drive",
      date: "Nov 5, 2025",
      volunteers: 0,
      status: "draft",
    },
  ]

  return (
    <DashboardLayout userRole="ngo">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Green Earth Initiative!</h1>
          <p className="text-foreground-light">Here's your mission management overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground-light mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest volunteer applications for your missions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-primary-light/20 transition-smooth"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{app.volunteerName}</h3>
                        <p className="text-sm text-foreground-light mb-2">{app.mission}</p>
                        <p className="text-xs text-foreground-light">Applied {app.appliedDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={app.status === "accepted" ? "success" : "default"}>
                          {app.status === "accepted" ? "Accepted" : "Pending"}
                        </Badge>
                        <Button size="sm" variant="outline" className="bg-transparent">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/dashboard/ngo/create-mission">Create Mission</Link>
                </Button>
                <Button variant="secondary" asChild className="w-full">
                  <Link href="/dashboard/ngo/missions">View All Missions</Link>
                </Button>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/dashboard/ngo/applicants">View Applicants</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Missions */}
        <Card>
          <CardHeader>
            <CardTitle>Your Missions</CardTitle>
            <CardDescription>Manage and track your active missions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-primary-light/20 transition-smooth"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{mission.title}</h3>
                    <p className="text-sm text-foreground-light">
                      📅 {mission.date} • 👥 {mission.volunteers} volunteers
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={mission.status === "active" ? "success" : "default"}>
                      {mission.status === "active" ? "Active" : "Draft"}
                    </Badge>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
