"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

export default function CreateMissionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "Environment",
    description: "",
    fullDescription: "",
    location: "",
    date: "",
    time: "",
    duration: "2",
    capacity: "10",
    requirements: "",
    whatVolunteersDo: "",
    whoCanApply: "",
    whatToBring: "",
    contactName: "",
    contactRole: "",
    contactEmail: "",
    contactPhone: "",
    image: "",
    featured: false,
    urgent: false,
    verified: true,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData({ ...formData, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const categories = ["Environment", "Education", "Healthcare", "Community", "Animals", "Arts"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Format data for the backend
      const missionData = {
        title: formData.title,
        description: formData.description,
        fullDescription: formData.fullDescription || undefined,
        category: formData.category,
        location: formData.location,
        date: new Date(formData.date).toISOString(),
        startTime: formData.time || undefined,
        duration: parseInt(formData.duration),
        volunteersNeeded: parseInt(formData.capacity),
        requirements: formData.requirements || undefined,
        whatVolunteersDo: formData.whatVolunteersDo || undefined,
        whoCanApply: formData.whoCanApply || undefined,
        whatToBring: formData.whatToBring || undefined,
        contactInfo: formData.contactName ? {
          name: formData.contactName,
          role: formData.contactRole,
          email: formData.contactEmail,
          phone: formData.contactPhone,
        } : undefined,
        imageUrl: formData.image || undefined,
        isFeatured: formData.featured,
        isUrgent: formData.urgent,
        tags: [],
      }

      const response = await api.createMission(missionData)
      
      toast({
        title: "Success!",
        description: "Mission created successfully",
      })

      // Redirect to missions list
      router.push('/dashboard/ngo/missions')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create mission",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = () => {
    alert("Draft functionality coming soon!")
  }

  return (
    <DashboardLayout userRole="ngo">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Mission</h1>
          <p className="text-foreground-light">Post a new volunteering opportunity and attract passionate volunteers</p>
        </div>

        {/* Info Alert */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Complete all fields for better visibility</p>
                <p className="text-sm text-blue-700">
                  Missions with complete information get 3x more applications. Be detailed and clear about what volunteers will do.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Basic Information</h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Mission Title *</label>
                  <Input
                    placeholder="e.g., Community Garden Cleanup, Beach Cleanup Drive"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <p className="text-xs text-foreground-light">Make it clear and engaging</p>
                </div>

                {/* Category & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category *</label>
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
                    <label className="text-sm font-medium text-foreground">Duration (hours) *</label>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Short Description *</label>
                  <textarea
                    placeholder="A brief summary (1-2 sentences) that will appear in listings..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
                    required
                  />
                  <p className="text-xs text-foreground-light">Keep it concise - this appears on the opportunity card</p>
                </div>

                {/* Mission Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Mission Image</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-64 mx-auto rounded-lg object-cover"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setImagePreview(null)
                            setFormData({ ...formData, image: "" })
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-5xl">📸</div>
                        <div>
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <span className="text-primary hover:text-primary-dark font-medium">Click to upload</span>
                            <span className="text-foreground-light"> or drag and drop</span>
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </div>
                        <p className="text-xs text-foreground-light">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-foreground-light">This image will appear on the opportunity card and detail page</p>
                </div>

                {/* Full Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Description *</label>
                  <textarea
                    placeholder="Provide a detailed description of the mission, its impact, and what makes it special..."
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary min-h-32"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Schedule */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Location & Schedule</h2>
              
              <div className="space-y-6">
                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location *</label>
                  <Input
                    placeholder="e.g., Downtown Park, 123 Park Avenue, City Center"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                  <p className="text-xs text-foreground-light">Include full address for better discoverability</p>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Date *</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Start Time *</label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Volunteer Capacity *</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                  />
                  <p className="text-xs text-foreground-light">Maximum number of volunteers you can accommodate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Detailed Information</h2>
              
              <div className="space-y-6">
                {/* What Volunteers Will Do */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">What Volunteers Will Do *</label>
                  <textarea
                    placeholder="List the tasks and activities (one per line):&#10;- Weed garden beds and pathways&#10;- Plant seasonal flowers&#10;- Organize compost area"
                    value={formData.whatVolunteersDo}
                    onChange={(e) => setFormData({ ...formData, whatVolunteersDo: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary min-h-32"
                    required
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Requirements *</label>
                  <textarea
                    placeholder="List requirements (one per line):&#10;- Must be at least 16 years old&#10;- Ability to perform light physical work&#10;- No prior experience required"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary min-h-28"
                    required
                  />
                </div>

                {/* Who Can Apply */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Who Can Apply</label>
                  <textarea
                    placeholder="List who is welcome (one per line):&#10;- Individuals aged 16 and above&#10;- Groups and families welcome&#10;- Students seeking community service hours"
                    value={formData.whoCanApply}
                    onChange={(e) => setFormData({ ...formData, whoCanApply: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary min-h-28"
                  />
                </div>

                {/* What to Bring */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">What to Bring</label>
                  <textarea
                    placeholder="List what volunteers should bring (one per line):&#10;- Comfortable clothes&#10;- Closed-toe shoes&#10;- Water bottle&#10;- Sunscreen"
                    value={formData.whatToBring}
                    onChange={(e) => setFormData({ ...formData, whatToBring: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary min-h-28"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Contact Person Name *</label>
                    <Input
                      placeholder="e.g., Sarah Johnson"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Role *</label>
                    <Input
                      placeholder="e.g., Volunteer Coordinator"
                      value={formData.contactRole}
                      onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email *</label>
                    <Input
                      type="email"
                      placeholder="contact@organization.org"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone *</label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Additional Options</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-foreground cursor-pointer">
                    Mark as Featured (appears at top of listings)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={formData.urgent}
                    onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <label htmlFor="urgent" className="text-sm font-medium text-foreground cursor-pointer">
                    Mark as Urgent (shows urgent badge and alerts)
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                >
                  Save as Draft
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isLoading ? "Publishing..." : "Publish Mission"}
                </Button>
              </div>
              <p className="text-xs text-center text-foreground-light mt-4">
                Draft missions won't be visible to volunteers until published
              </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}
