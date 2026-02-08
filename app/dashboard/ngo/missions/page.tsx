"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Calendar, Clock, Users, Eye, Edit, Trash2 } from "lucide-react"

interface Mission {
  id: string
  title: string
  description: string
  category: string
  location: string
  date: string
  duration: number
  volunteersNeeded: number
  volunteersAccepted: number
  status: string
  isFeatured: boolean
  isUrgent: boolean
  imageUrl?: string
  creator: {
    ngoProfile: {
      organizationName: string
      isVerified: boolean
    }
  }
  _count?: {
    applications: number
  }
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await api.getMyMissions()
        // Backend returns { success, message, data: [missions] }
        setMissions(response.data || [])
      } catch (error) {
        // Error fetching missions
      } finally {
        setIsLoading(false)
      }
    }

    fetchMissions()
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout userRole="ngo">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading missions...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="ngo">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Missions</h1>
            <p className="text-foreground-light">Manage all your volunteering missions</p>
          </div>
          <Link href="/dashboard/ngo/create-mission">
            <Button>Create Mission</Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground-light mb-1">Total Missions</p>
              <p className="text-3xl font-bold text-foreground">{missions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground-light mb-1">Active Missions</p>
              <p className="text-3xl font-bold text-primary">{missions.filter(m => m.status === "ACTIVE").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground-light mb-1">Total Volunteers</p>
              <p className="text-3xl font-bold text-foreground">{missions.reduce((sum, m) => sum + (m.volunteersAccepted || 0), 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground-light mb-1">Pending Applicants</p>
              <p className="text-3xl font-bold text-orange-600">{missions.reduce((sum, m) => sum + (m._count?.applications || 0), 0)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          {missions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-foreground-light">No missions yet. Create your first mission to get started!</p>
                <Link href="/dashboard/ngo/create-mission">
                  <Button className="mt-4">Create Mission</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            missions.map((mission) => (
            <Card key={mission.id} className={mission.isFeatured ? "border-2 border-primary/20" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-lg text-foreground">{mission.title}</h3>
                      <Badge
                        className={
                          mission.status === "ACTIVE" 
                            ? "bg-green-500 text-white" 
                            : mission.status === "DRAFT" 
                              ? "bg-gray-400 text-white" 
                              : "bg-blue-500 text-white"
                        }
                      >
                        {mission.status.charAt(0) + mission.status.slice(1).toLowerCase()}
                      </Badge>
                      {mission.isFeatured && (
                        <Badge className="bg-yellow-500 text-white">⭐ Featured</Badge>
                      )}
                      {mission.isUrgent && (
                        <Badge className="bg-red-500 text-white animate-pulse">Urgent</Badge>
                      )}
                      {mission.creator?.ngoProfile?.isVerified && (
                        <Badge className="bg-blue-500 text-white">✓ Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground-light mb-3">{mission.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-foreground-light text-xs">Location</p>
                      <p className="font-medium text-foreground">{mission.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-foreground-light text-xs">Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(mission.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-foreground-light text-xs">Duration</p>
                      <p className="font-medium text-foreground">{mission.duration}h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-foreground-light text-xs">Category</p>
                      <p className="font-medium text-foreground">{mission.category}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 bg-surface rounded-lg">
                  <div>
                    <p className="text-foreground-light text-xs mb-1">Volunteers Accepted</p>
                    <p className="font-bold text-foreground text-lg">{mission.volunteersAccepted}</p>
                  </div>
                  <div>
                    <p className="text-foreground-light text-xs mb-1">Total Applications</p>
                    <p className="font-bold text-orange-600 text-lg">{mission._count?.applications || 0}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-foreground-light text-xs mb-1">Capacity Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(mission.volunteersAccepted / mission.volunteersNeeded) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground whitespace-nowrap">
                        {mission.volunteersAccepted}/{mission.volunteersNeeded}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/opportunities/${mission.id}`} className="flex-1 sm:flex-none">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/dashboard/ngo/applicants?missionId=${mission.id}`} className="flex-1 sm:flex-none">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Users className="w-4 h-4 mr-2" />
                      Applicants ({mission._count?.applications || 0})
                    </Button>
                  </Link>
                  <Link href={`/dashboard/ngo/missions/edit/${mission.id}`} className="flex-1 sm:flex-none">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex-1 sm:flex-none text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )))}
        </div>
      </div>
    </DashboardLayout>
  )
}
