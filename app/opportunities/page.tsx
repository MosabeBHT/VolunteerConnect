"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const opportunities = [
    {
      id: 1,
      title: "Community Garden Cleanup",
      organization: "Green Earth Initiative",
      category: "Environment",
      location: "Downtown Park",
      date: "Oct 25, 2025",
      duration: "4 hours",
      volunteers: 12,
      description: "Help us clean and maintain our community garden",
      image: "",
    },
    {
      id: 2,
      title: "Tutoring Session",
      organization: "Education for All",
      category: "Education",
      location: "Community Center",
      date: "Oct 28, 2025",
      duration: "2 hours",
      volunteers: 5,
      description: "Teach math to high school students",
      image: "",
    },
    {
      id: 3,
      title: "Animal Shelter Support",
      organization: "Paws & Love",
      category: "Animals",
      location: "Animal Shelter",
      date: "Nov 1, 2025",
      duration: "3 hours",
      volunteers: 8,
      description: "Help care for animals and clean facilities",
      image: "",
    },
    {
      id: 4,
      title: "Food Bank Sorting",
      organization: "Community Care",
      category: "Community",
      location: "Food Bank",
      date: "Nov 5, 2025",
      duration: "3 hours",
      volunteers: 20,
      description: "Sort and organize food donations",
      image: "",
    },
    {
      id: 5,
      title: "Beach Cleanup Drive",
      organization: "Ocean Care",
      category: "Environment",
      location: "Sandy Beach",
      date: "Nov 8, 2025",
      duration: "5 hours",
      volunteers: 15,
      description: "Join us for a beach cleanup initiative",
      image: "",
    },
    {
      id: 6,
      title: "Senior Care Companion",
      organization: "Golden Hearts",
      category: "Healthcare",
      location: "Senior Center",
      date: "Nov 10, 2025",
      duration: "2 hours",
      volunteers: 3,
      description: "Spend time with seniors and provide companionship",
      image: "",
    },
  ]

  const categories = ["Environment", "Education", "Animals", "Community", "Healthcare", "Arts"]

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || opp.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-light via-background to-background py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Find Your Next Opportunity
              </h1>
              <p className="text-xl text-foreground-light max-w-2xl mx-auto mb-8 text-balance">
                Discover volunteering opportunities that match your interests and make a real difference in your
                community.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-12 bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <Input
                placeholder="Search opportunities or organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-base"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                    selectedCategory === null
                      ? "bg-primary text-white"
                      : "bg-primary-light text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  All Categories
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
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Opportunities Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opp) => (
                <Card key={opp.id} className="hover:shadow-lg transition-smooth">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{opp.image}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground mb-1">{opp.title}</h3>
                        <p className="text-sm text-foreground-light">{opp.organization}</p>
                      </div>
                    </div>

                    <p className="text-sm text-foreground-light mb-4">{opp.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground-light"> {opp.location}</span>
                        <Badge variant="secondary">{opp.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground-light"> {opp.date}</span>
                        <span className="text-foreground-light"> {opp.duration}</span>
                      </div>
                      <div className="text-sm text-foreground-light"> {opp.volunteers} volunteers interested</div>
                    </div>

                    <Button className="w-full" asChild>
                      <Link href="/login">Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOpportunities.length === 0 && (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-foreground-light mb-4">No opportunities found matching your criteria</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory(null)
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary-light to-primary/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Make a Difference?</h2>
            <p className="text-lg text-foreground-light mb-8 text-balance">
              Sign up today to start volunteering and create positive change in your community.
            </p>
            <Button size="lg" asChild>
              <Link href="/register?role=volunteer">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
