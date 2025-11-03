"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ApplicantsPage() {
  const [selectedMission, setSelectedMission] = useState("all")

  const missions = ["all", "Community Garden Cleanup", "Tutoring Session", "Beach Cleanup Drive"]

  const applicants = [
    {
      id: 1,
      name: "Sarah Johnson",
      mission: "Community Garden Cleanup",
      appliedDate: "Oct 23, 2025",
      status: "pending",
      interests: ["Environment", "Community"],
      skills: ["Gardening", "Leadership"],
    },
    {
      id: 2,
      name: "Mike Chen",
      mission: "Community Garden Cleanup",
      appliedDate: "Oct 22, 2025",
      status: "accepted",
      interests: ["Environment"],
      skills: ["Gardening"],
    },
    {
      id: 3,
      name: "Emma Davis",
      mission: "Tutoring Session",
      appliedDate: "Oct 21, 2025",
      status: "pending",
      interests: ["Education"],
      skills: ["Teaching"],
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      mission: "Beach Cleanup Drive",
      appliedDate: "Oct 20, 2025",
      status: "rejected",
      interests: ["Environment"],
      skills: ["Leadership"],
    },
  ]

  const filteredApplicants =
    selectedMission === "all" ? applicants : applicants.filter((a) => a.mission === selectedMission)

  return (
    <DashboardLayout userRole="ngo">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Applicants</h1>
          <p className="text-foreground-light">Review and manage volunteer applications</p>
        </div>

        {/* Mission Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {missions.map((mission) => (
                <button
                  key={mission}
                  onClick={() => setSelectedMission(mission)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                    selectedMission === mission
                      ? "bg-primary text-white"
                      : "bg-primary-light text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {mission === "all" ? "All Missions" : mission}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Applicants List */}
        <div className="space-y-4">
          {filteredApplicants.map((applicant) => (
            <Card key={applicant.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-1">{applicant.name}</h3>
                    <p className="text-sm text-foreground-light mb-3">{applicant.mission}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {applicant.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-1 rounded-full bg-primary-light text-primary text-xs font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 rounded-full bg-accent text-surface-dark text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        applicant.status === "accepted"
                          ? "success"
                          : applicant.status === "pending"
                            ? "default"
                            : "error"
                      }
                      className="mb-3"
                    >
                      {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                    </Badge>
                    <p className="text-xs text-foreground-light">Applied {applicant.appliedDate}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {applicant.status === "pending" && (
                    <>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Reject
                      </Button>
                      <Button className="flex-1">Accept</Button>
                    </>
                  )}
                  {applicant.status === "accepted" && (
                    <>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        View Profile
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Remove
                      </Button>
                    </>
                  )}
                  {applicant.status === "rejected" && (
                    <Button variant="outline" className="w-full bg-transparent">
                      View Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplicants.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-foreground-light">No applicants for this mission yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
