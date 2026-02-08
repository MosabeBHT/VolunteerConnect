"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Search,
  Loader2
} from "lucide-react"

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
  imageUrl?: string
  isFeatured: boolean
  tags: string[]
  creator: {
    ngoProfile: {
      organizationName: string
      profileImage?: string
    }
  }
  _count: {
    applications: number
  }
}

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    fetchMissions()
  }, [selectedCategory, searchTerm])

  const fetchMissions = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (selectedCategory) params.category = selectedCategory
      if (searchTerm) params.search = searchTerm
      
      const response = await api.getMissions(params)
      setMissions(response.data.missions)
      setError("")
    } catch (err: any) {
      // Handle different error formats
      let errorMessage = 'Failed to load missions'
      
      if (err && typeof err === 'object') {
        if (err.message) {
          errorMessage = err.message
        } else if (err.error) {
          errorMessage = err.error
        } else if (typeof err.toString === 'function' && err.toString() !== '[object Object]') {
          errorMessage = err.toString()
        }
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const categories = ["Environment", "Education", "Animals", "Community", "Healthcare", "Arts"]

  // Category icons mapping
  const categoryIcons: { [key: string]: string } = {
    Environment: "🌱",
    Education: "📚",
    Animals: "🐾",
    Community: "🤝",
    Healthcare: "⚕️",
    Arts: "🎨"
  }

  // Category colors
  const categoryColors: { [key: string]: string } = {
    Environment: "from-green-400 to-green-600",
    Education: "from-blue-400 to-blue-600",
    Animals: "from-orange-400 to-orange-600",
    Community: "from-purple-400 to-purple-600",
    Healthcare: "from-red-400 to-red-600",
    Arts: "from-pink-400 to-pink-600"
  }



  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary-light via-background to-background py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Find Your Next Opportunity
              </h1>
              <p className="text-lg text-foreground-light max-w-2xl mx-auto mb-6 text-balance">
                Discover volunteering opportunities that match your interests and make a real difference in your
                community.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-8 bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-light" />
                <Input
                  placeholder="Search by title, organization, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-base"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                      selectedCategory === null
                        ? "bg-primary text-white"
                        : "bg-primary-light text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    All ({missions.length})
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth flex items-center gap-1 ${
                        selectedCategory === category
                          ? "bg-primary text-white"
                          : "bg-primary-light text-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      <span>{categoryIcons[category]}</span>
                      <span>{category}</span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-sm text-foreground-light">
                Showing <span className="font-semibold text-foreground">{missions.length}</span> {missions.length === 1 ? 'opportunity' : 'opportunities'}
              </p>
            </div>
          </div>
        </section>

        {/* All Opportunities Grid */}
        <section className="py-12 md:py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-foreground-light">Loading opportunities...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-foreground-light">{error}</p>
                <Button onClick={fetchMissions} className="mt-4">Try Again</Button>
              </div>
            ) : missions.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-foreground-light mx-auto mb-4" />
                <p className="text-foreground-light">No opportunities found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                {/* Featured Missions */}
                {missions.filter(m => m.isFeatured).length > 0 && !selectedCategory && !searchTerm && (
                  <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                      <h2 className="text-2xl font-bold text-foreground">Featured This Week</h2>
                      <Badge className="bg-primary">★</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {missions.filter(m => m.isFeatured).slice(0, 2).map((mission) => (
                        <Card key={mission.id} className="overflow-hidden hover:shadow-xl transition-all border-2 border-primary/20">
                          <MissionCard mission={mission} />
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Missions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {missions.map((mission) => (
                    <Card key={mission.id} className="overflow-hidden hover:shadow-lg transition-all">
                      <MissionCard mission={mission} />
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-linear-to-br from-primary-light to-primary/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Make a Difference?</h2>
            <p className="text-lg text-foreground-light mb-8 text-balance">
              Join thousands of volunteers creating positive change. Sign up today and start making an impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <Link href="/register?role=volunteer">
                  <Button size="lg">Get Started Now</Button>
                </Link>
              )}
              <Link href="/about">
                <Button size="lg" variant="outline">Learn More About Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

// Mission Card Component
function MissionCard({ 
  mission
}: { 
  mission: Mission
}) {
  const { user } = useAuth()
  const spotsLeft = mission.volunteersNeeded - mission.volunteersAccepted
  const isUrgent = spotsLeft <= 3 && spotsLeft > 0
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
      {/* Image/Header */}
      <div className="relative h-48 overflow-hidden">
        {mission.imageUrl ? (
          <img 
            src={mission.imageUrl} 
            alt={mission.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${categoryColors[mission.category] || 'from-gray-400 to-gray-600'} flex items-center justify-center`}>
            <span className="text-6xl">{categoryIcons[mission.category] || "📋"}</span>
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {mission.isFeatured && (
            <Badge className="bg-yellow-500 text-white border-0">⭐ Featured</Badge>
          )}
          {isUrgent && (
            <Badge className="bg-red-500 text-white border-0 animate-pulse">
              <AlertCircle className="w-3 h-3 mr-1" />
              {spotsLeft} spots left!
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <Badge className="bg-blue-500 text-white border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5">
        {/* Title & Organization */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-2 hover:text-primary transition-colors">
            {mission.title}
          </h3>
          <p className="text-sm text-foreground-light">
            {mission.creator.ngoProfile.organizationName}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground-light mb-4 line-clamp-2">
          {mission.description}
        </p>

        {/* Details Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground-light">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>{mission.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground-light">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>{formatDate(mission.date)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-foreground-light">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span>{mission.duration} hours</span>
            </div>
            <Badge variant="secondary">{mission.category}</Badge>
          </div>
        </div>

        {/* Volunteers Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-foreground-light flex items-center gap-1">
              <Users className="w-4 h-4" />
              {mission.volunteersAccepted} / {mission.volunteersNeeded} volunteers
            </span>
            <span className={`font-semibold ${spotsLeft <= 5 ? 'text-red-500' : 'text-green-500'}`}>
              {spotsLeft} spots left
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(mission.volunteersAccepted / mission.volunteersNeeded) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/opportunities/${mission.id}`} className="flex-1">
            <Button className="w-full" size="sm">
              View Details
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </>
  )
}
