"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import Link from "next/link"
import { 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  Award,
  MapPin,
  Target,
  Activity,
  Edit,
  Star,
  Zap,
  Heart,
  ChevronRight,
  Plus,
  ArrowUpRight,
  BarChart3,
  Loader2
} from "lucide-react"

interface Mission {
  id: string
  title: string
  category: string
  location: string
  date: string
  volunteersNeeded: number
  volunteersAccepted: number
  status: string
  isFeatured: boolean
  _count?: { applications: number }
}

export default function NGODashboard() {
  const { user } = useAuth()
  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"
  const ngoProfile = user?.ngoProfile

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getMyMissions()
        setMissions(response.data || [])
      } catch (error) {
        // Silent — NGO might not have missions yet
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const activeMissions = missions.filter(m => m.status === "ACTIVE")
  const totalVolunteers = missions.reduce((sum, m) => sum + (m.volunteersAccepted || 0), 0)
  const totalApplications = missions.reduce((sum, m) => sum + (m._count?.applications || 0), 0)

  const stats = [
    { label: "Active Missions", value: activeMissions.length.toString(), change: activeMissions.length > 0 ? `${activeMissions.length} active` : "Create your first", icon: Target, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Total Volunteers", value: totalVolunteers.toString(), change: totalVolunteers > 0 ? "Accepted" : "Start recruiting", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Total Missions", value: missions.length.toString(), change: "All time", icon: Clock, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Applications", value: totalApplications.toString(), change: totalApplications > 0 ? "Received" : "Share missions", icon: Award, color: "text-orange-600", bgColor: "bg-orange-50" },
  ]

  return (
    <DashboardLayout userRole="ngo">
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative bg-linear-to-r from-[#6b47c0] via-[#524584] to-[#3a3556] rounded-2xl p-6 md:p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-purple-100 text-sm mb-1">{greeting}</p>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">
                  {ngoProfile?.organizationName || 'Your Organization'}
                </h1>
                <p className="text-purple-100 text-sm md:text-base">
                  {ngoProfile?.description || 'Making a difference, one mission at a time'}
                </p>
                {ngoProfile?.isVerified && (
                  <Badge className="mt-2 bg-green-500/20 text-green-100 border-green-300">✓ Verified</Badge>
                )}
              </div>
              <Link href="/dashboard/ngo/create-mission">
                <Button className="bg-white text-purple-600 hover:bg-purple-50 gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Mission</span>
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-purple-100 text-xs mb-1">Active</p>
                <p className="text-2xl font-bold">{activeMissions.length}</p>
                <p className="text-xs text-purple-100">missions</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-purple-100 text-xs mb-1">Applications</p>
                <p className="text-2xl font-bold">{totalApplications}</p>
                <p className="text-xs text-purple-100">received</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-purple-100 text-xs mb-1">Volunteers</p>
                <p className="text-2xl font-bold">{totalVolunteers}</p>
                <p className="text-xs text-purple-100">accepted</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-purple-100 text-xs mb-1">Total</p>
                <p className="text-2xl font-bold">{missions.length}</p>
                <p className="text-xs text-purple-100">missions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="relative overflow-hidden hover:shadow-lg transition-smooth">
                <CardContent className="pt-6">
                  <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} rounded-bl-full opacity-50`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <ArrowUpRight className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">{stat.change}</span>
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-sm text-foreground-light">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Missions Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Your Missions
                    </CardTitle>
                    <CardDescription>Overview of your active missions</CardDescription>
                  </div>
                  <Link href="/dashboard/ngo/missions">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : missions.length > 0 ? (
                  <div className="space-y-4">
                    {missions.slice(0, 5).map((mission) => {
                      const percentage = mission.volunteersNeeded > 0
                        ? Math.round((mission.volunteersAccepted / mission.volunteersNeeded) * 100)
                        : 0
                      return (
                        <div key={mission.id} className="p-4 rounded-xl border border-border hover:bg-accent/50 transition-smooth">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{mission.title}</h3>
                                {mission.isFeatured && (
                                  <Badge variant="default" className="gap-1">
                                    <Star className="h-3 w-3" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-3 text-xs text-foreground-light mb-2">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(mission.date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{mission.location}</span>
                                <Badge variant="secondary" className="text-xs">{mission.category}</Badge>
                              </div>
                            </div>
                            <Link href={`/dashboard/ngo/applicants?missionId=${mission.id}`}>
                              <Button size="sm" variant="ghost">
                                <Users className="h-4 w-4 mr-1" />
                                {mission._count?.applications || 0}
                              </Button>
                            </Link>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-foreground-light">Progress</span>
                              <span className="font-semibold text-foreground">{mission.volunteersAccepted}/{mission.volunteersNeeded} volunteers</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-foreground-light mx-auto mb-3" />
                    <p className="text-foreground-light mb-4">No missions yet. Create your first mission to start recruiting volunteers!</p>
                    <Link href="/dashboard/ngo/create-mission">
                      <Button>Create Mission</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-sm border-2 border-purple-100 bg-linear-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard/ngo/create-mission" className="block">
                  <Button className="w-full justify-start gap-2 bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4" />
                    Create New Mission
                  </Button>
                </Link>
                <Link href="/dashboard/ngo/applicants" className="block">
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <Users className="h-4 w-4" />
                    Review Applicants
                    {totalApplications > 0 && <Badge className="ml-auto">{totalApplications}</Badge>}
                  </Button>
                </Link>
                <Link href="/dashboard/ngo/missions" className="block">
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <Target className="h-4 w-4" />
                    Manage Missions
                  </Button>
                </Link>
                <Link href="/dashboard/ngo/profile" className="block">
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Impact Summary */}
            <Card className="shadow-sm bg-linear-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Impact Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-light">Total Volunteers</span>
                  <span className="text-2xl font-bold text-green-600">{totalVolunteers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-light">Missions Created</span>
                  <span className="text-2xl font-bold text-green-600">{missions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-light">Active Now</span>
                  <span className="text-2xl font-bold text-green-600">{activeMissions.length}</span>
                </div>
                {missions.length === 0 && (
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-xs text-foreground-light">
                      <span className="font-semibold text-green-700">Get started!</span> Create your first mission to begin making an impact.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
