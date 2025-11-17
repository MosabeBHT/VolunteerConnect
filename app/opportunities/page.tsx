"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  Search
} from "lucide-react"

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("newest")

  const opportunities = [
    {
      id: 1,
      title: "Community Garden Cleanup",
      organization: "Green Earth Initiative",
      category: "Environment",
      location: "Downtown Park",
      date: "Nov 25, 2025",
      duration: "4 hours",
      volunteers: 12,
      description: "Join our team to clean and maintain the downtown community garden. Tasks include weeding, planting seasonal flowers, and organizing the compost area.",
      image: "/opportunities/garden.jpg",
      verified: true,
      featured: true,
      spotsLeft: 5,
      urgent: false,
    },
    {
      id: 2,
      title: "Tutoring Session",
      organization: "Education for All",
      category: "Education",
      location: "Community Center",
      date: "Nov 20, 2025",
      duration: "2 hours",
      volunteers: 5,
      description: "Help high school students excel in mathematics. Share your knowledge and make a lasting impact on young minds.",
      image: "/opportunities/tutoring.jpg",
      verified: true,
      featured: false,
      spotsLeft: 2,
      urgent: true,
    },
    {
      id: 3,
      title: "Animal Shelter Support",
      organization: "Paws & Love",
      category: "Animals",
      location: "Animal Shelter",
      date: "Dec 1, 2025",
      duration: "3 hours",
      volunteers: 8,
      description: "Help care for rescued animals, assist with feeding, cleaning, and socializing with our furry friends.",
      image: "/opportunities/animals.jpg",
      verified: true,
      featured: false,
      spotsLeft: 10,
      urgent: false,
    },
    {
      id: 4,
      title: "Food Bank Sorting",
      organization: "Community Care",
      category: "Community",
      location: "Food Bank",
      date: "Nov 22, 2025",
      duration: "3 hours",
      volunteers: 20,
      description: "Sort and organize food donations to help feed families in need. Light physical work in a friendly team environment.",
      image: "/opportunities/foodbank.jpg",
      verified: true,
      featured: true,
      spotsLeft: 8,
      urgent: false,
    },
    {
      id: 5,
      title: "Beach Cleanup Drive",
      organization: "Ocean Care",
      category: "Environment",
      location: "Sandy Beach",
      date: "Nov 28, 2025",
      duration: "5 hours",
      volunteers: 15,
      description: "Join us for a beach cleanup initiative to protect marine life and keep our coastlines beautiful.",
      image: "/opportunities/beach.jpg",
      verified: true,
      featured: false,
      spotsLeft: 12,
      urgent: false,
    },
    {
      id: 6,
      title: "Senior Care Companion",
      organization: "Golden Hearts",
      category: "Healthcare",
      location: "Senior Center",
      date: "Nov 18, 2025",
      duration: "2 hours",
      volunteers: 3,
      description: "Spend quality time with seniors, engage in conversations, play games, and bring joy to their day.",
      image: "/opportunities/seniors.jpg",
      verified: true,
      featured: false,
      spotsLeft: 1,
      urgent: true,
    },
  ]

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

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || opp.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort opportunities
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (sortBy) {
      case "soonest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "popular":
        return b.volunteers - a.volunteers
      case "newest":
      default:
        return b.id - a.id
    }
  })

  // Separate featured opportunities
  const featuredOpportunities = sortedOpportunities.filter(opp => opp.featured)
  const regularOpportunities = sortedOpportunities.filter(opp => !opp.featured)

  // Count by category
  const getCategoryCount = (category: string) => {
    return opportunities.filter(opp => opp.category === category).length
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
                    All ({opportunities.length})
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
                      {categoryIcons[category]} {category} ({getCategoryCount(category)})
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground-light whitespace-nowrap">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="newest">Newest First</option>
                    <option value="soonest">Soonest Date</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <p className="text-sm text-foreground-light">
                Showing <span className="font-semibold text-foreground">{sortedOpportunities.length}</span> {sortedOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Opportunities */}
        {featuredOpportunities.length > 0 && !selectedCategory && !searchTerm && (
          <section className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold text-foreground">Featured This Week</h2>
                <Badge className="bg-primary">o</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredOpportunities.slice(0, 2).map((opp) => (
                  <Card key={opp.id} className="overflow-hidden hover:shadow-xl transition-all border-2 border-primary/20">
                    <OpportunityCard opportunity={opp} featured={true} categoryColors={categoryColors} />
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Opportunities Grid */}
        <section className="py-12 md:py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!selectedCategory && !searchTerm && featuredOpportunities.length > 0 && (
              <h2 className="text-2xl font-bold text-foreground mb-6">All Opportunities</h2>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularOpportunities.map((opp) => (
                <Card key={opp.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <OpportunityCard opportunity={opp} featured={false} categoryColors={categoryColors} />
                </Card>
              ))}
            </div>

            {sortedOpportunities.length === 0 && (
              <Card className="mt-8">
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-lg font-semibold text-foreground mb-2">No opportunities found</p>
                  <p className="text-foreground-light mb-6">Try adjusting your search or filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory(null)
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
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
              <Link href="/register?role=volunteer">
                <Button size="lg">Get Started Now</Button>
              </Link>
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

// Opportunity Card Component
function OpportunityCard({ 
  opportunity, 
  featured,
  categoryColors
}: { 
  opportunity: any
  featured: boolean
  categoryColors: { [key: string]: string }
}) {
  return (
    <>
      {/* Image/Header */}
      <div className="relative h-48 bg-linear-to-br overflow-hidden">
        {opportunity.image && opportunity.image.startsWith('/opportunities/') ? (
          <Image
            src={opportunity.image}
            alt={opportunity.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-linear-to-br ${categoryColors[opportunity.category]} flex items-center justify-center`}>
            <span className="text-6xl">{opportunity.category === "Environment" ? "🌱" : 
                                       opportunity.category === "Education" ? "📚" :
                                       opportunity.category === "Animals" ? "🐾" :
                                       opportunity.category === "Community" ? "🤝" :
                                       opportunity.category === "Healthcare" ? "⚕️" : "🎨"}</span>
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {featured && (
            <Badge className="bg-yellow-500 text-white border-0">⭐ Featured</Badge>
          )}
          {opportunity.urgent && (
            <Badge className="bg-red-500 text-white border-0 animate-pulse">
              <AlertCircle className="w-3 h-3 mr-1" />
              Urgent
            </Badge>
          )}
        </div>

        {opportunity.verified && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-blue-500 text-white border-0">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-5">
        {/* Title & Organization */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-2 hover:text-primary transition-colors">
            {opportunity.title}
          </h3>
          <p className="text-sm text-foreground-light">{opportunity.organization}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground-light mb-4 line-clamp-2">
          {opportunity.description}
        </p>

        {/* Details Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground-light">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground-light">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>{opportunity.date}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-foreground-light">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span>{opportunity.duration}</span>
            </div>
            <Badge variant="secondary">{opportunity.category}</Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1 text-sm text-foreground-light">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{opportunity.volunteers}</span> interested
          </div>
          {opportunity.spotsLeft && opportunity.spotsLeft <= 5 && (
            <span className="text-xs font-semibold text-orange-600">
              Only {opportunity.spotsLeft} spot{opportunity.spotsLeft !== 1 ? 's' : ''} left!
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/opportunities/${opportunity.id}`} className="flex-1">
            <Button className="w-full">
              View Details
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="shrink-0">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </>
  )
}
