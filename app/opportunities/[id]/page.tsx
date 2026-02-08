"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Mail,
  Backpack,
  Target,
  Info,
  Loader2,
  Building2
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Mission {
  id: string
  title: string
  description: string
  category: string
  location: string
  address: string
  date: string
  startTime: string
  endTime: string
  duration: number
  volunteersNeeded: number
  volunteersAccepted: number
  status: string
  requirements: string
  benefits: string
  imageUrl?: string
  isFeatured: boolean
  tags: string[]
  creator: {
    id: string
    email: string
    ngoProfile: {
      organizationName: string
      email: string
      location: string
      description: string
      isVerified: boolean
      profileImage?: string
    }
  }
  _count: {
    applications: number
  }
}

export default function OpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [mission, setMission] = useState<Mission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [applying, setApplying] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState("")
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null)
  const [checkingApplication, setCheckingApplication] = useState(false)

  useEffect(() => {
    fetchMission()
    if (user?.role === 'VOLUNTEER') {
      checkExistingApplication()
    }
    
    // Auto-refresh mission data every 30 seconds to show updated counts
    const interval = setInterval(() => {
      fetchMission()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [params.id, user])

  const checkExistingApplication = async () => {
    if (!user || user.role !== 'VOLUNTEER') return
    
    try {
      setCheckingApplication(true)
      const response = await api.getMyApplications()
      const applications = response.data || []
      const existingApp = applications.find((app: any) => app.missionId === params.id)
      
      if (existingApp) {
        setHasApplied(true)
        setApplicationStatus(existingApp.status)
      }
    } catch (err) {
      // Error checking applications - not critical
    } finally {
      setCheckingApplication(false)
    }
  }

  const fetchMission = async () => {
    try {
      setLoading(true)
      const response = await api.getMissionById(params.id as string)
      setMission(response.data.mission)
      setError("")
    } catch (err: any) {
      // Error fetching mission
      setError(err.message || 'Failed to load mission details')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!user) {
      router.push(`/login?redirect=/opportunities/${params.id}`)
      return
    }

    if (user.role !== 'VOLUNTEER') {
      toast({
        title: "Not Authorized",
        description: "Only volunteers can apply to missions.",
        variant: "destructive"
      })
      return
    }

    try {
      setApplying(true)
      await api.createApplication(params.id as string, applicationMessage)
      
      toast({
        title: "Application Submitted!",
        description: "Your application has been sent successfully. The NGO will review it soon.",
      })
      
      setShowApplicationForm(false)
      setApplicationMessage("")
      
      // Update local state
      setHasApplied(true)
      setApplicationStatus('PENDING')
      
      // Refresh mission data to update counts
      fetchMission()
    } catch (err: any) {
      toast({
        title: "Application Failed",
        description: err.message || 'Failed to submit application',
        variant: "destructive"
      })
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    )
  }

  if (error || !mission) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-foreground-light mb-4">{error || 'Mission not found'}</p>
          <Link href="/opportunities">
            <Button>Back to Opportunities</Button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const spotsLeft = mission.volunteersNeeded - mission.volunteersAccepted
  const isUrgent = spotsLeft <= 3 && spotsLeft > 0
  const isFull = spotsLeft <= 0
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const categoryColors: { [key: string]: string } = {
    Environment: "from-green-400 to-green-600",
    Education: "from-blue-400 to-blue-600",
    Animals: "from-orange-400 to-orange-600",
    Community: "from-purple-400 to-purple-600",
    Healthcare: "from-red-400 to-red-600",
    Arts: "from-pink-400 to-pink-600"
  }

  const categoryIcons: { [key: string]: string } = {
    Environment: "🌱",
    Education: "📚",
    Animals: "🐾",
    Community: "🤝",
    Healthcare: "⚕️",
    Arts: "🎨"
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">
        {/* Hero Section */}
        <section className="relative h-80 overflow-hidden">
          {mission.imageUrl ? (
            <img 
              src={mission.imageUrl} 
              alt={mission.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${categoryColors[mission.category] || 'from-gray-400 to-gray-600'} flex items-center justify-center`}>
              <span className="text-9xl">{categoryIcons[mission.category] || "📋"}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <Link href="/opportunities" className="inline-flex items-center gap-2 text-white mb-4 hover:underline">
                <ArrowLeft className="w-4 h-4" />
                Back to Opportunities
              </Link>
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-white/20 text-white border-0">{mission.category}</Badge>
                    {mission.isFeatured && (
                      <Badge className="bg-yellow-500 text-white border-0">⭐ Featured</Badge>
                    )}
                    {mission.creator.ngoProfile.isVerified && (
                      <Badge className="bg-blue-500 text-white border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified NGO
                      </Badge>
                    )}
                    {isUrgent && (
                      <Badge className="bg-red-500 text-white border-0 animate-pulse">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {spotsLeft} spots left!
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-2">{mission.title}</h1>
                  <p className="text-white/90 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {mission.creator.ngoProfile.organizationName}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="bg-white/20 border-white/40 text-white hover:bg-white/30">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-white/20 border-white/40 text-white hover:bg-white/30">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Key Details Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-foreground-light">Date</p>
                          <p className="text-sm font-semibold">{formatDate(mission.date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-foreground-light">Time</p>
                          <p className="text-sm font-semibold">{mission.startTime} - {mission.endTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-foreground-light">Duration</p>
                          <p className="text-sm font-semibold">{mission.duration} hours</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-foreground-light">Volunteers</p>
                          <p className="text-sm font-semibold">{mission.volunteersAccepted}/{mission.volunteersNeeded}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-foreground-light">Volunteer Progress</span>
                        <span className={`font-semibold ${isFull ? 'text-red-500' : spotsLeft <= 5 ? 'text-orange-500' : 'text-green-500'}`}>
                          {isFull ? 'Full' : `${spotsLeft} spots remaining`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-primary'}`}
                          style={{ width: `${(mission.volunteersAccepted / mission.volunteersNeeded) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      About This Opportunity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed text-lg mb-4">{mission.description}</p>
                    
                    {/* Tags */}
                    {mission.tags.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="text-sm font-semibold mb-3 text-foreground">Related Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {mission.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {mission.requirements?.split('\n').filter(r => r.trim()).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <span className="text-foreground-light">{req}</span>
                        </li>
                      )) || <li className="text-foreground-light">No specific requirements listed</li>}
                    </ul>
                  </CardContent>
                </Card>

                {/* Benefits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Backpack className="w-5 h-5 text-primary" />
                      What You'll Gain
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {mission.benefits?.split('\n').filter(b => b.trim()).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                          <span className="text-foreground-light">{benefit}</span>
                        </li>
                      )) || <li className="text-foreground-light">Benefits information coming soon</li>}
                    </ul>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold text-foreground text-lg mb-1">{mission.location}</p>
                      <p className="text-foreground-light">{mission.address}</p>
                    </div>
                    
                    {/* Map Placeholder */}
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-border">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Map integration coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Action Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Apply Card */}
                  <Card>
                    <CardContent className="pt-6">
                      {hasApplied ? (
                        <>
                          {/* Already Applied State */}
                          <div className="text-center py-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                              <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-bold text-lg text-foreground mb-2">Application Submitted</h3>
                            <p className="text-sm text-foreground-light mb-3">
                              You've already applied to this opportunity
                            </p>
                            <Badge 
                              className={
                                applicationStatus === 'PENDING' 
                                  ? "bg-orange-500 text-white" 
                                  : applicationStatus === 'ACCEPTED' 
                                    ? "bg-green-500 text-white" 
                                    : "bg-gray-500 text-white"
                              }
                            >
                              Status: {applicationStatus}
                            </Badge>
                          </div>
                          
                          <Link href="/dashboard/volunteer/applications">
                            <Button variant="outline" className="w-full mb-4">
                              View My Applications
                            </Button>
                          </Link>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" size="sm">
                              <Heart className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button variant="outline" className="flex-1" size="sm">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </>
                      ) : !showApplicationForm ? (
                        <>
                          <Button 
                            onClick={() => {
                              if (!user) {
                                router.push(`/login?redirect=/opportunities/${params.id}`)
                                return
                              }
                              if (user.role !== 'VOLUNTEER') {
                                toast({
                                  title: "Not Authorized",
                                  description: "Only volunteers can apply to missions.",
                                  variant: "destructive"
                                })
                                return
                              }
                              setShowApplicationForm(true)
                            }}
                            className="w-full mb-4" 
                            size="lg"
                            disabled={isFull || checkingApplication}
                          >
                            {checkingApplication ? 'Loading...' : isFull ? 'Opportunity Full' : user?.role === 'VOLUNTEER' ? 'Apply Now' : user ? 'NGOs Cannot Apply' : 'Login to Apply'}
                          </Button>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" size="sm">
                              <Heart className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button variant="outline" className="flex-1" size="sm">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="font-semibold">Apply for this Opportunity</h3>
                          <p className="text-sm text-foreground-light">
                            Tell the organization why you're interested and what you can contribute.
                          </p>
                          <Textarea
                            placeholder="Write your application message here..."
                            value={applicationMessage}
                            onChange={(e) => setApplicationMessage(e.target.value)}
                            rows={6}
                            className="resize-none"
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleApply} 
                              className="flex-1"
                              disabled={applying || !applicationMessage.trim()}
                            >
                              {applying ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                'Submit Application'
                              )}
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => setShowApplicationForm(false)}
                              disabled={applying}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Organization Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">About the Organization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{mission.creator.ngoProfile.organizationName}</p>
                          {mission.creator.ngoProfile.isVerified && (
                            <Badge variant="secondary" className="mt-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified NGO
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-foreground-light leading-relaxed">
                        {mission.creator.ngoProfile.description}
                      </p>
                      
                      <div className="space-y-3 pt-3 border-t border-border">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm text-foreground-light">{mission.creator.ngoProfile.location}</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <a href={`mailto:${mission.creator.ngoProfile.email}`} className="text-sm text-primary hover:underline">
                            {mission.creator.ngoProfile.email}
                          </a>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full" size="sm">
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Stats Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground-light">Category</span>
                        <Badge variant="secondary">{mission.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground-light">Status</span>
                        <Badge className="bg-green-500">{mission.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground-light">Applications</span>
                        <span className="text-sm font-semibold">{mission._count.applications}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground-light">Spots Remaining</span>
                        <span className={`text-sm font-semibold ${spotsLeft <= 5 ? 'text-orange-500' : 'text-green-500'}`}>
                          {spotsLeft}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
