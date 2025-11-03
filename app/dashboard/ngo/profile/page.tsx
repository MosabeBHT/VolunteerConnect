"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NGOProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: "Green Earth Initiative",
    email: "contact@greenearthinitiative.com",
    phone: "+1 (555) 123-4567",
    website: "https://greenearthinitiative.com",
    location: "San Francisco, CA",
    description:
      "We are dedicated to environmental conservation and community engagement through sustainable volunteering initiatives.",
    registrationNumber: "NGO-2020-12345",
  })

  return (
    <DashboardLayout userRole="ngo">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Organization Profile</h1>
            <p className="text-foreground-light">Manage your organization information</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancel" : "Edit Profile"}</Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                <span className="text-4xl font-bold text-primary">GE</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-1">{formData.organizationName}</h2>
                <p className="text-foreground-light mb-4">{formData.email}</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-foreground-light">📍 {formData.location}</span>
                  <span className="text-foreground-light">📞 {formData.phone}</span>
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-6">
                {/* Organization Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Organization Name</label>
                  <Input
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  />
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

                {/* Website & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Website</label>
                    <Input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                  />
                </div>

                {/* Registration Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Registration Number</label>
                  <Input
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  />
                </div>

                <Button className="w-full" size="lg">
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">About</h3>
                  <p className="text-foreground-light">{formData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground-light mb-1">Website</p>
                    <a href={formData.website} className="text-primary hover:underline">
                      {formData.website}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-light mb-1">Registration Number</p>
                    <p className="font-medium text-foreground">{formData.registrationNumber}</p>
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
