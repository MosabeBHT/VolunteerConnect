"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const missions = [
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
      image: "🌱",
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
      image: "📚",
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
      image: "🐾",
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
      image: "🍎",
    },
  ]

  const categories = ["Environment", "Education", "Animals", "Community", "Healthcare", "Arts"]

  const filteredMissions = missions.filter((mission) => {
    const matchesSearch =
      mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || mission.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <DashboardLayout userRole="volunteer">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Missions</h1>
          <p className="text-foreground-light">Discover volunteering opportunities that match your interests</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Input
                placeholder="Search missions or organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          </CardContent>
        </Card>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMissions.map((mission) => (
            <Card key={mission.id} className="hover:shadow-lg transition-smooth">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{mission.image}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-1">{mission.title}</h3>
                    <p className="text-sm text-foreground-light">{mission.organization}</p>
                  </div>
                </div>

                <p className="text-sm text-foreground-light mb-4">{mission.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-light">📍 {mission.location}</span>
                    <Badge variant="secondary">{mission.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-light">📅 {mission.date}</span>
                    <span className="text-foreground-light">⏱️ {mission.duration}</span>
                  </div>
                  <div className="text-sm text-foreground-light">👥 {mission.volunteers} volunteers interested</div>
                </div>

                <Button className="w-full">Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMissions.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-foreground-light mb-4">No missions found matching your criteria</p>
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
    </DashboardLayout>
  )
}
