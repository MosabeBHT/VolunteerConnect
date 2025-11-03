"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VolunteerDashboard() {
  const stats = [
    { label: "Hours Volunteered", value: "24", icon: "⏱️" },
    { label: "Missions Completed", value: "3", icon: "✅" },
    { label: "Active Applications", value: "2", icon: "📋" },
    { label: "Impact Score", value: "850", icon: "⭐" },
  ]

  const recentMissions = [
    {
      id: 1,
      title: "Community Garden Cleanup",
      organization: "Green Earth Initiative",
      date: "Oct 25, 2025",
      status: "completed",
      hours: 4,
    },
    {
      id: 2,
      title: "Tutoring Session",
      organization: "Education for All",
      date: "Oct 28, 2025",
      status: "upcoming",
      hours: 2,
    },
  ]

  return (
    <DashboardLayout userRole="volunteer">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
          <p className="text-foreground-light">Here's your volunteering overview</p>
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest missions and applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-primary-light/20 transition-smooth"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{mission.title}</h3>
                        <p className="text-sm text-foreground-light mb-2">{mission.organization}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={mission.status === "completed" ? "success" : "default"}>
                            {mission.status === "completed" ? "Completed" : "Upcoming"}
                          </Badge>
                          <span className="text-xs text-foreground-light">{mission.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{mission.hours}h</p>
                        <p className="text-xs text-foreground-light">hours</p>
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
                  <Link href="/dashboard/volunteer/missions">Find Missions</Link>
                </Button>
                <Button variant="secondary" asChild className="w-full">
                  <Link href="/dashboard/volunteer/applications">View Applications</Link>
                </Button>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/dashboard/volunteer/profile">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
