"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Mail, MapPin, Calendar, Clock, User, Briefcase, Award, Loader2, Users, CheckCircle, XCircle } from "lucide-react"

interface VolunteerProfile {
  firstName: string
  lastName: string
  phone: string
  location: string
  bio: string
  profileImage: string | null
  interests: string[]
  skills: string[]
  experience: string
  totalHours: number
  rating: number
}

interface Application {
  id: string
  status: string
  motivation: string
  appliedAt: string
  feedback: string | null
  volunteer: {
    id: string
    email: string
    volunteerProfile: VolunteerProfile | null
  }
}

interface Mission {
  id: string
  title: string
}

function ApplicantsPageContent() {
  const searchParams = useSearchParams()
  const missionIdParam = searchParams.get("missionId")

  const [missions, setMissions] = useState<Mission[]>([])
  const [selectedMissionId, setSelectedMissionId] = useState<string>(missionIdParam || "")
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoadingMissions, setIsLoadingMissions] = useState(true)
  const [isLoadingApplications, setIsLoadingApplications] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Fetch NGO missions for filter dropdown
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await api.getMyMissions()
        const missionList = response.data || []
        setMissions(missionList)

        // If missionId from URL, use it; otherwise use first mission
        if (missionIdParam && missionList.some((m: Mission) => m.id === missionIdParam)) {
          setSelectedMissionId(missionIdParam)
        } else if (missionList.length > 0 && !missionIdParam) {
          setSelectedMissionId(missionList[0].id)
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load missions", variant: "destructive" })
      } finally {
        setIsLoadingMissions(false)
      }
    }
    fetchMissions()
  }, [missionIdParam])

  // Fetch applications when selected mission changes
  useEffect(() => {
    if (!selectedMissionId) return
    const fetchApplications = async () => {
      setIsLoadingApplications(true)
      try {
        const response = await api.getMissionApplications(selectedMissionId)
        setApplications(response.data || [])
      } catch (error) {
        toast({ title: "Error", description: "Failed to load applications", variant: "destructive" })
      } finally {
        setIsLoadingApplications(false)
      }
    }
    fetchApplications()
  }, [selectedMissionId])

  const handleStatusUpdate = async (applicationId: string, status: "ACCEPTED" | "REJECTED") => {
    setUpdatingId(applicationId)
    try {
      await api.updateApplicationStatus(applicationId, status)
      // Update local state
      setApplications(prev =>
        prev.map(app => app.id === applicationId ? { ...app, status } : app)
      )
      toast({
        title: "Success",
        description: `Application ${status.toLowerCase()} successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${status.toLowerCase()} application`,
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const pendingCount = applications.filter(a => a.status === "PENDING").length
  const acceptedCount = applications.filter(a => a.status === "ACCEPTED").length
  const rejectedCount = applications.filter(a => a.status === "REJECTED").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "bg-green-500 text-white"
      case "REJECTED": return "bg-red-500 text-white"
      case "WITHDRAWN": return "bg-gray-500 text-white"
      default: return "bg-orange-500 text-white"
    }
  }

  const selectedMissionTitle = missions.find(m => m.id === selectedMissionId)?.title || "Select a mission"

  if (isLoadingMissions) {
    return (
      <DashboardLayout userRole="ngo">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="ngo">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Applicants</h1>
          <p className="text-foreground-light">Review and manage volunteer applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground-light mb-1">Total Applicants</p>
              <p className="text-3xl font-bold text-foreground">{applications.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground-light mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground-light mb-1">Accepted</p>
              <p className="text-3xl font-bold text-green-600">{acceptedCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground-light mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Filter */}
        {missions.length > 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-foreground mb-3">Filter by Mission</p>
              <div className="flex flex-wrap gap-2">
                {missions.map((mission) => (
                  <button
                    key={mission.id}
                    onClick={() => setSelectedMissionId(mission.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                      selectedMissionId === mission.id
                        ? "bg-primary text-white"
                        : "bg-primary-light text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    {mission.title}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-lg font-semibold text-foreground mb-2">No missions yet</p>
              <p className="text-foreground-light">Create your first mission to start receiving applications.</p>
            </CardContent>
          </Card>
        )}

        {/* Applicants List */}
        {isLoadingApplications ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => {
              const vp = application.volunteer?.volunteerProfile
              const fullName = vp ? `${vp.firstName} ${vp.lastName}` : application.volunteer?.email || "Unknown"
              const isUpdating = updatingId === application.id

              return (
                <Card key={application.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                      <div className="flex-1 min-w-[250px]">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-xl text-foreground">{fullName}</h3>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-primary mb-3">{selectedMissionTitle}</p>

                        {/* Contact Information */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-foreground-light">
                            <Mail className="w-4 h-4 shrink-0" />
                            <span>{application.volunteer?.email}</span>
                          </div>
                          {vp?.phone && (
                            <div className="flex items-center gap-2 text-sm text-foreground-light">
                              <User className="w-4 h-4 shrink-0" />
                              <span>{vp.phone}</span>
                            </div>
                          )}
                          {vp?.location && (
                            <div className="flex items-center gap-2 text-sm text-foreground-light">
                              <MapPin className="w-4 h-4 shrink-0" />
                              <span>{vp.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-foreground-light">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
                          </div>
                          {vp?.totalHours != null && vp.totalHours > 0 && (
                            <div className="flex items-center gap-2 text-sm text-foreground-light">
                              <Clock className="w-4 h-4 shrink-0" />
                              <span>{vp.totalHours} hours volunteered</span>
                            </div>
                          )}
                        </div>

                        {/* Bio */}
                        {vp?.bio && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-primary" />
                              <p className="text-sm font-semibold text-foreground">About</p>
                            </div>
                            <p className="text-sm text-foreground-light ml-6">{vp.bio}</p>
                          </div>
                        )}

                        {/* Experience */}
                        {vp?.experience && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Briefcase className="w-4 h-4 text-primary" />
                              <p className="text-sm font-semibold text-foreground">Experience</p>
                            </div>
                            <p className="text-sm text-foreground-light ml-6">{vp.experience}</p>
                          </div>
                        )}

                        {/* Motivation */}
                        {application.motivation && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="w-4 h-4 text-primary" />
                              <p className="text-sm font-semibold text-foreground">Why they want to volunteer</p>
                            </div>
                            <p className="text-sm text-foreground-light ml-6 italic">&quot;{application.motivation}&quot;</p>
                          </div>
                        )}

                        {/* Interests */}
                        {vp?.interests && vp.interests.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-foreground mb-2">Interests</p>
                            <div className="flex flex-wrap gap-2">
                              {vp.interests.map((interest: string) => (
                                <span key={interest} className="px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-medium">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {vp?.skills && vp.skills.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-2">Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {vp.skills.map((skill: string) => (
                                <span key={skill} className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Feedback (if already reviewed) */}
                        {application.feedback && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                            <p className="text-xs font-semibold text-foreground mb-1">Your Feedback</p>
                            <p className="text-sm text-foreground-light">{application.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                      {application.status === "PENDING" && (
                        <>
                          <Button
                            variant="outline"
                            className="flex-1 sm:flex-none text-red-600 hover:text-red-700"
                            onClick={() => handleStatusUpdate(application.id, "REJECTED")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                            Reject
                          </Button>
                          <Button
                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusUpdate(application.id, "ACCEPTED")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                            Accept
                          </Button>
                        </>
                      )}
                      {application.status === "ACCEPTED" && (
                        <Badge className="bg-green-100 text-green-700 text-sm px-4 py-2">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Volunteer Accepted
                        </Badge>
                      )}
                      {application.status === "REJECTED" && (
                        <Badge className="bg-red-100 text-red-700 text-sm px-4 py-2">
                          <XCircle className="w-4 h-4 mr-2" />
                          Application Rejected
                        </Badge>
                      )}
                      {application.status === "WITHDRAWN" && (
                        <Badge className="bg-gray-100 text-gray-700 text-sm px-4 py-2">
                          Withdrawn by Volunteer
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : selectedMissionId ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-5xl mb-4">👥</div>
              <p className="text-lg font-semibold text-foreground mb-2">No applicants yet</p>
              <p className="text-foreground-light">No volunteers have applied to this mission yet. Share your mission to attract volunteers!</p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </DashboardLayout>
  )
}

export default function ApplicantsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <ApplicantsPageContent />
    </Suspense>
  )
}
