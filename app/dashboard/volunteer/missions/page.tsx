"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import Link from "next/link"
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart,
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
  status: string
  isFeatured: boolean
  imageUrl?: string
  tags: string[]
  creator: {
    id: string
    ngoProfile: {
      organizationName: string
      isVerified: boolean
      profileImage?: string
    }
  }
  _count: {
    applications: number
  }
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchMissions()
  }, [])

  const fetchMissions = async () => {
    try {
      const response = await api.getMissions()
      setMissions(response.data?.missions || [])
    } catch (error) {
      // Silent fail
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ["Environment", "Education", "Animals", "Community", "Healthcare", "Arts"]

  const categoryIcons: { [key: string]: string } = {
    Environment: "🌱", Education: "📚", Animals: "🐾",
    Community: "🤝", Healthcare: "⚕️", Arts: "🎨"
  }

  const categoryColors: { [key: string]: string } = {
    Environment: "from-green-400 to-green-600", Education: "from-blue-400 to-blue-600",
    Animals: "from-orange-400 to-orange-600", Community: "from-purple-400 to-purple-600",
    Healthcare: "from-red-400 to-red-600", Arts: "from-pink-400 to-pink-600"
  }

  const filteredMissions = missions.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.creator?.ngoProfile?.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || m.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Missions</h1>
          <p className="text-foreground-light">Discover volunteering opportunities that match your interests</p>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-light" />
                <Input
                  placeholder="Search by title, organization, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-base"
                />
              </div>
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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-primary-light text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    {categoryIcons[category]} {category}
                  </button>
                ))}
              </div>
              <p className="text-sm text-foreground-light">
                Showing <span className="font-semibold text-foreground">{filteredMissions.length}</span> {filteredMissions.length === 1 ? 'opportunity' : 'opportunities'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => {
            const spotsLeft = mission.volunteersNeeded - mission.volunteersAccepted
            const isFull = spotsLeft <= 0
            return (
              <Card key={mission.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className={`h-40 bg-gradient-to-br ${categoryColors[mission.category] || 'from-gray-400 to-gray-600'} flex items-center justify-center relative`}>
                  {mission.imageUrl ? (
                    <img src={mission.imageUrl} alt={mission.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">{categoryIcons[mission.category] || "📋"}</span>
                  )}
                  {mission.isFeatured && (
                    <Badge className="absolute top-3 right-3 bg-yellow-500 text-white border-0">⭐ Featured</Badge>
                  )}
                  {spotsLeft <= 3 && spotsLeft > 0 && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 animate-pulse">{spotsLeft} spots left!</Badge>
                  )}
                </div>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{mission.title}</h3>
                    <p className="text-sm text-foreground-light flex items-center gap-1">
                      {mission.creator?.ngoProfile?.organizationName || 'Organization'}
                      {mission.creator?.ngoProfile?.isVerified && (
                        <CheckCircle className="w-3 h-3 text-blue-500" />
                      )}
                    </p>
                  </div>
                  <p className="text-sm text-foreground-light line-clamp-2">{mission.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-foreground-light">
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{mission.location}</div>
                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(mission.date)}</div>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{mission.duration}h</div>
                    <div className="flex items-center gap-1"><Users className="w-3 h-3" />{mission.volunteersAccepted}/{mission.volunteersNeeded}</div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/opportunities/${mission.id}`} className="flex-1">
                      <Button className="w-full" disabled={isFull}>
                        {isFull ? 'Full' : 'View & Apply'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredMissions.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-semibold text-foreground mb-2">No opportunities found</p>
              <p className="text-foreground-light mb-6">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
