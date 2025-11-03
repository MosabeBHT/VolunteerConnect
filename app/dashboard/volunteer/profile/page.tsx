"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate about environmental conservation and community service.",
    interests: ["Environment", "Community", "Education"],
    skills: ["Teaching", "Gardening", "Leadership"],
  })

  const interests = ["Education", "Environment", "Healthcare", "Community", "Animals", "Arts"]
  const skills = ["Teaching", "Gardening", "Leadership", "Cooking", "Writing", "Design"]

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  return (
    <DashboardLayout userRole="volunteer">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-foreground-light">Manage your volunteer profile</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancel" : "Edit Profile"}</Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                <span className="text-4xl font-bold text-primary">JD</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-foreground-light mb-4">{formData.email}</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-foreground-light">📍 {formData.location}</span>
                  <span className="text-foreground-light">📞 {formData.phone}</span>
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">First Name</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Last Name</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Location & Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                  />
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Areas of Interest</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`p-2 rounded-lg border-2 transition-smooth text-sm font-medium ${
                          formData.interests.includes(interest)
                            ? "border-primary bg-primary-light text-primary"
                            : "border-border bg-surface text-foreground-light hover:border-primary"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Skills</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`p-2 rounded-lg border-2 transition-smooth text-sm font-medium ${
                          formData.skills.includes(skill)
                            ? "border-primary bg-primary-light text-primary"
                            : "border-border bg-surface text-foreground-light hover:border-primary"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Bio</h3>
                  <p className="text-foreground-light">{formData.bio}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Areas of Interest</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 rounded-full bg-primary-light text-primary text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-accent text-surface-dark text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
