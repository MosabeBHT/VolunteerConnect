"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

export default function EditMissionPage() {
  const router = useRouter();
  const params = useParams();
  const missionId = params.id as string;
  
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
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  // Fetch mission data on mount
  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await api.getMissionById(missionId)
        const mission = response.data.mission
        
        // Parse contact info if it's JSON string
        let contactInfo = mission.contactInfo
        if (typeof contactInfo === 'string') {
          try {
            contactInfo = JSON.parse(contactInfo)
          } catch (e) {
            contactInfo = {}
          }
        }
        
        // Format date for input
        const missionDate = new Date(mission.date)
        const dateString = missionDate.toISOString().split('T')[0]
        
        setFormData({
          title: mission.title || "",
          category: mission.category || "Environment",
          description: mission.description || "",
          fullDescription: mission.fullDescription || "",
          location: mission.location || "",
          date: dateString,
          time: mission.startTime || "",
          duration: mission.duration?.toString() || "2",
          capacity: mission.volunteersNeeded?.toString() || "10",
          requirements: mission.requirements || "",
          whatVolunteersDo: mission.whatVolunteersDo || "",
          whoCanApply: mission.whoCanApply || "",
          whatToBring: mission.whatToBring || "",
          contactName: contactInfo?.name || "",
          contactRole: contactInfo?.role || "",
          contactEmail: contactInfo?.email || "",
          contactPhone: contactInfo?.phone || "",
          image: mission.imageUrl || "",
          featured: mission.isFeatured || false,
          urgent: mission.isUrgent || false,
        })
        
        if (mission.imageUrl) {
          setImagePreview(mission.imageUrl)
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load mission",
          variant: "destructive",
        })
        router.push('/dashboard/ngo/missions')
      } finally {
        setIsFetching(false)
      }
    }

    fetchMission()
  }, [missionId, router])

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
      }

      await api.updateMission(missionId, missionData)
      
      toast({
        title: "Success!",
        description: "Mission updated successfully",
      })

      // Redirect to missions list
      router.push('/dashboard/ngo/missions')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update mission",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <DashboardLayout userRole="ngo">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading mission...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="ngo">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Mission</h1>
          <p className="text-foreground-light">Update your mission details</p>
        </div>

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
                    placeholder="List the tasks and activities..."
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
                    placeholder="List requirements..."
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
                    placeholder="List who is welcome..."
                    value={formData.whoCanApply}
                    onChange={(e) => setFormData({ ...formData, whoCanApply: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary min-h-28"
                  />
                </div>

                {/* What to Bring */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">What to Bring</label>
                  <textarea
                    placeholder="List what volunteers should bring..."
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
                  onClick={() => router.push('/dashboard/ngo/missions')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}
