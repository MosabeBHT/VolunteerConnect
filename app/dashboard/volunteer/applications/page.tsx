"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { 
  Calendar, 
  Building, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  Eye,
  MessageSquare,
  Loader2
} from "lucide-react"

interface Application {
  id: string
  missionId: string
  status: string
  message?: string
  feedback?: string
  appliedAt: string
  reviewedAt?: string
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
        profileImage?: string
      }
    }
  }
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await api.getMyApplications()
      setApplications(response.data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load applications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = async (applicationId: string) => {
    try {
      setWithdrawingId(applicationId)
      await api.withdrawApplication(applicationId)
      toast({
        title: "Withdrawn",
        description: "Your application has been withdrawn successfully.",
      })
      fetchApplications()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to withdraw application",
        variant: "destructive",
      })
    } finally {
      setWithdrawingId(null)
    }
  }

  const stats = {
    total: applications.length,
    accepted: applications.filter(a => a.status === "ACCEPTED").length,
    pending: applications.filter(a => a.status === "PENDING").length,
    rejected: applications.filter(a => a.status === "REJECTED").length,
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return { bgClass: "bg-gradient-to-br from-green-50 to-emerald-50", borderClass: "border-green-200", icon: CheckCircle, iconClass: "from-green-500 to-emerald-500", label: "Accepted" }
      case "PENDING":
        return { bgClass: "bg-gradient-to-br from-yellow-50 to-orange-50", borderClass: "border-yellow-200", icon: AlertCircle, iconClass: "from-yellow-500 to-orange-500", label: "Pending Review" }
      case "REJECTED":
        return { bgClass: "bg-gradient-to-br from-red-50 to-red-50", borderClass: "border-red-200", icon: XCircle, iconClass: "from-red-500 to-red-600", label: "Not Selected" }
      case "WITHDRAWN":
        return { bgClass: "bg-gradient-to-br from-gray-50 to-gray-50", borderClass: "border-gray-200", icon: FileText, iconClass: "from-gray-500 to-gray-600", label: "Withdrawn" }
      default:
        return { bgClass: "bg-gray-50", borderClass: "border-gray-200", icon: FileText, iconClass: "from-gray-500 to-gray-600", label: status }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (isLoading) {
    return (
      <DashboardLayout userRole="volunteer">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="volunteer">
      <div className="space-y-6">
        {/* Header */}
        <div className="relative bg-linear-to-r from-[#6b47c0] via-[#524584] to-[#3a3556] rounded-2xl p-6 md:p-8 text-white overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Applications</h1>
            <p className="text-purple-100">Track the status of your mission applications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-sm text-foreground-light">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                  <p className="text-sm text-foreground-light">Accepted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-sm text-foreground-light">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-2 border-red-100 bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  <p className="text-sm text-foreground-light">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((app) => {
            const config = getStatusConfig(app.status)
            const StatusIcon = config.icon
            return (
              <Card key={app.id} className={`shadow-lg ${config.bgClass} border-2 ${config.borderClass} hover:shadow-xl transition-smooth`}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${config.iconClass} shadow-md`}>
                      <StatusIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-xl text-foreground mb-1">{app.mission.title}</h3>
                          <p className="text-sm text-foreground-light flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {app.mission.creator?.ngoProfile?.organizationName || 'Organization'}
                          </p>
                        </div>
                        <Badge className={
                          app.status === "ACCEPTED" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md" :
                          app.status === "PENDING" ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-md" :
                          app.status === "REJECTED" ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-md" :
                          "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-md"
                        }>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground-light mb-4">{app.mission.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-foreground-light" />
                          <div>
                            <p className="text-xs text-foreground-light">Applied</p>
                            <p className="text-sm font-medium text-foreground">{formatDate(app.appliedAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-foreground-light" />
                          <div>
                            <p className="text-xs text-foreground-light">Mission Date</p>
                            <p className="text-sm font-medium text-foreground">{formatDate(app.mission.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-foreground-light" />
                          <div>
                            <p className="text-xs text-foreground-light">Duration</p>
                            <p className="text-sm font-medium text-foreground">{app.mission.duration} hours</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-foreground-light" />
                          <div>
                            <p className="text-xs text-foreground-light">Location</p>
                            <p className="text-sm font-medium text-foreground">{app.mission.location}</p>
                          </div>
                        </div>
                      </div>
                      {app.status === "REJECTED" && app.feedback && (
                        <div className="mb-4 p-3 rounded-lg bg-white border border-red-200">
                          <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Feedback from Organization
                          </p>
                          <p className="text-sm text-foreground-light">{app.feedback}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/opportunities/${app.mission.id}`}>
                          <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                            <Eye className="h-4 w-4 mr-2" />
                            View Mission
                          </Button>
                        </Link>
                        {app.status === "PENDING" && (
                          <Button variant="outline" onClick={() => handleWithdraw(app.id)} disabled={withdrawingId === app.id}>
                            {withdrawingId === app.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                            Withdraw
                          </Button>
                        )}
                        <Badge variant="secondary" className="ml-auto">{app.mission.category}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {applications.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="pt-16 pb-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No Applications Yet</h3>
              <p className="text-foreground-light mb-6 max-w-md mx-auto">Start making a difference by applying to missions that match your interests.</p>
              <Link href="/opportunities">
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">Browse Missions</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
