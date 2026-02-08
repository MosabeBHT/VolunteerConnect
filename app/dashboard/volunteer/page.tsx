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
  Clock, 
  CheckCircle, 
  FileText, 
  Award, 
  Calendar,
  MapPin,
  Building,
  Heart,
  Target,
  Star,
  ChevronRight,
  Search,
  Zap,
  ArrowUpRight,
  Activity,
  Loader2
} from "lucide-react"

interface Application {
  id: string
  status: string
  appliedAt: string
  mission: {
    id: string
    title: string
    description: string
    category: string
    location: string
    date: string
    duration: number
    creator: {
      ngoProfile: {
        organizationName: string
      }
    }
  }
}

export default function VolunteerDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"

  const volunteerProfile = user?.volunteerProfile
  const totalHours = volunteerProfile?.totalHours || 0

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getMyApplications()
        setApplications(response.data || [])
      } catch (error) {
        // Silently handle - user may not have applied yet
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const pendingCount = applications.filter(a => a.status === "PENDING").length
  const acceptedCount = applications.filter(a => a.status === "ACCEPTED").length

  const stats = [
    { 
      label: "Hours Volunteered", 
      value: totalHours.toString(), 
      change: totalHours > 0 ? `${totalHours}h total` : "Start volunteering",
      icon: Clock,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Missions Accepted", 
      value: acceptedCount.toString(), 
      change: acceptedCount > 0 ? `${acceptedCount} active` : "Apply to missions",
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Pending Applications", 
      value: pendingCount.toString(), 
      change: pendingCount > 0 ? "Awaiting review" : "Browse opportunities",
      icon: FileText,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      label: "Total Applications", 
      value: applications.length.toString(), 
      change: applications.length > 0 ? "All time" : "Get started",
      icon: Award,
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    },
  ]

  const recentApplications = applications.slice(0, 5)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <DashboardLayout userRole="volunteer">
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative bg-linear-to-r from-[#6b47c0] via-[#524584] to-[#3a3556] rounded-2xl p-6 md:p-8 text-white overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-purple-100 text-sm mb-1">{greeting} 👋</p>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">
                  Welcome back, {volunteerProfile?.firstName || 'Volunteer'}!
                </h1>
                <p className="text-purple-100 text-sm md:text-base">
                  {volunteerProfile?.location ? `Making a difference in ${volunteerProfile.location}` : 'Continue making a difference in your community'}
                </p>
              </div>
              <Link href="/opportunities">
                <Button className="bg-white text-purple-600 hover:bg-purple-50 gap-2">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Find Missions</span>
                </Button>
              </Link>
            </div>
            
            {/* Quick Stats in Header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-purple-100 text-xs mb-1">Hours</p>
                <p className="text-2xl font-bold">{totalHours}</p>
                <p className="text-xs text-purple-100">volunteered</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-purple-100 text-xs mb-1">Accepted</p>
                <p className="text-2xl font-bold">{acceptedCount}</p>
                <p className="text-xs text-purple-100">missions</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-purple-100 text-xs mb-1">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-xs text-purple-100">applications</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-purple-100 text-xs mb-1">Total</p>
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-xs text-purple-100">applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="relative overflow-hidden hover:shadow-lg transition-smooth border-2 border-white">
                <CardContent className="pt-6">
                  <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} rounded-bl-full opacity-50`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-md`}>
                        <Icon className="h-5 w-5 text-white" />
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

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recent Applications */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-600" />
                      Recent Applications
                    </CardTitle>
                    <CardDescription>Your latest mission applications</CardDescription>
                  </div>
                  <Link href="/dashboard/volunteer/applications">
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
                ) : recentApplications.length > 0 ? (
                  <div className="space-y-3">
                    {recentApplications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-start gap-4 p-4 rounded-xl border border-border hover:bg-accent/50 hover:border-purple-200 transition-smooth group"
                      >
                        <div className={`p-3 rounded-lg ${
                          app.status === "ACCEPTED" ? "bg-gradient-to-br from-green-500 to-emerald-500" :
                          app.status === "REJECTED" ? "bg-gradient-to-br from-red-500 to-red-600" :
                          "bg-gradient-to-br from-yellow-500 to-orange-500"
                        } shadow-md`}>
                          {app.status === "ACCEPTED" ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : app.status === "REJECTED" ? (
                            <FileText className="h-5 w-5 text-white" />
                          ) : (
                            <Clock className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{app.mission.title}</h3>
                            <Badge variant={app.status === "ACCEPTED" ? "default" : "secondary"} className={
                              app.status === "ACCEPTED" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0" :
                              app.status === "REJECTED" ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-0" : ""
                            }>
                              {app.status === "ACCEPTED" ? "Accepted" : app.status === "REJECTED" ? "Rejected" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground-light mb-2">
                            {app.mission.creator?.ngoProfile?.organizationName || 'Organization'}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-light">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(app.mission.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {app.mission.duration}h
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {app.mission.location}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {app.mission.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-foreground-light mx-auto mb-3" />
                    <p className="text-foreground-light mb-4">No applications yet. Start by browsing available missions!</p>
                    <Link href="/opportunities">
                      <Button variant="outline">Browse Opportunities</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/opportunities" className="block">
                  <Button className="w-full justify-start gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                    <Search className="h-4 w-4" />
                    Find Missions
                  </Button>
                </Link>
                <Link href="/dashboard/volunteer/applications" className="block">
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    View Applications
                    {pendingCount > 0 && (
                      <Badge className="ml-auto">{pendingCount}</Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/dashboard/volunteer/profile" className="block">
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <Award className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Your Impact */}
            <Card className="shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-orange-600" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-light">Total Hours</span>
                  <span className="text-2xl font-bold text-orange-600">{totalHours}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-light">Missions Accepted</span>
                  <span className="text-2xl font-bold text-orange-600">{acceptedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-light">Applications</span>
                  <span className="text-2xl font-bold text-orange-600">{applications.length}</span>
                </div>
                {applications.length === 0 && (
                  <div className="pt-3 border-t border-orange-200">
                    <p className="text-xs text-foreground-light">
                      <span className="font-semibold text-orange-700">Get started!</span> Apply to your first mission to begin tracking your impact.
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
