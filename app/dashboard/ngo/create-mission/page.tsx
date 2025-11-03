"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CreateMissionPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Environment",
    description: "",
    location: "",
    date: "",
    time: "",
    duration: "2",
    capacity: "10",
    requirements: "",
    image: "",
  })

  const categories = ["Environment", "Education", "Healthcare", "Community", "Animals", "Arts"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Mission created:", formData)
  }

  return (
    <DashboardLayout userRole="ngo">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Mission</h1>
          <p className="text-foreground-light">Post a new volunteering opportunity</p>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mission Title</label>
                <Input
                  placeholder="e.g., Community Garden Cleanup"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Duration (hours)</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  placeholder="Describe the mission, what volunteers will do, and why it matters..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary min-h-32"
                  required
                />
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <Input
                    placeholder="e.g., Downtown Park"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Time & Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Start Time</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Volunteer Capacity</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Requirements (optional)</label>
                <textarea
                  placeholder="Any specific skills, age requirements, or other prerequisites..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1 bg-transparent">
                  Save as Draft
                </Button>
                <Button type="submit" className="flex-1">
                  Publish Mission
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
