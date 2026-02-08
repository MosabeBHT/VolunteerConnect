"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  Users, 
  Award, 
  Building, 
  CheckCircle, 
  Edit,
  Camera,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Target
} from "lucide-react"

export default function NGOProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [missionStats, setMissionStats] = useState({ active: 0, totalVolunteers: 0, totalMissions: 0 })
  const [isVerified, setIsVerified] = useState(false)
  
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    address: "",
    description: "",
    mission: "",
    vision: "",
    registrationNumber: "",
    foundedYear: "",
    teamSize: "",
    volunteersServed: "",
    focusAreas: [] as string[],
    achievements: [] as string[],
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: ""
    }
  })

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getMyProfile()
        const profile = response.data.ngoProfile
        const userData = response.data
        
        if (profile) {
          setFormData({
            organizationName: profile.organizationName || "",
            email: userData.email || profile.email || "",
            phone: profile.phone || "",
            website: profile.website || "",
            location: profile.location || "",
            address: profile.address || "",
            description: profile.description || "",
            mission: profile.mission || "",
            vision: profile.vision || "",
            registrationNumber: profile.registrationNumber || "",
            foundedYear: profile.foundedYear || "",
            teamSize: profile.teamSize || "",
            volunteersServed: profile.volunteersServed || "",
            focusAreas: profile.focusAreas || [],
            achievements: profile.achievements || [],
            socialMedia: {
              facebook: "",
              twitter: "",
              instagram: "",
              linkedin: ""
            }
          })
          
          if (profile.bannerImage) setBannerImage(profile.bannerImage)
          if (profile.profileImage) setProfileImage(profile.profileImage)
          setIsVerified(!!profile.isVerified)
        }
      } catch (error) {
        // Error fetching profile
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Fetch mission stats
  useEffect(() => {
    const fetchMissionStats = async () => {
      try {
        const response = await api.getMyMissions()
        const missions = response.data || []
        setMissionStats({
          active: missions.filter((m: any) => m.status === "ACTIVE").length,
          totalVolunteers: missions.reduce((sum: number, m: any) => sum + (m.volunteersAccepted || 0), 0),
          totalMissions: missions.length,
        })
      } catch {
        // Silent — stats will show 0
      }
    }
    fetchMissionStats()
  }, [])

  const stats = [
    { label: "Active Missions", value: missionStats.active.toString(), icon: Users },
    { label: "Total Volunteers", value: missionStats.totalVolunteers.toString(), icon: Users },
    { label: "Total Missions", value: missionStats.totalMissions.toString(), icon: Calendar },
    { label: "Founded", value: formData.foundedYear || "N/A", icon: Award },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await api.updateNGOProfile({
        ...formData,
        profileImage: profileImage || undefined,
        bannerImage: bannerImage || undefined,
      })

      toast({
        title: "Success!",
        description: "Profile updated successfully",
      })

      setIsEditing(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout userRole="ngo">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="ngo">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Organization Profile</h1>
            <p className="text-foreground-light">Manage your organization information and public profile</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {!isEditing ? (
          <>
            {/* Profile Header Card */}
            <Card className="overflow-hidden">
              <div className="relative h-48 bg-linear-to-br from-primary-light to-primary/20 group cursor-pointer">
                {bannerImage && (
                  <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                )}
                <label htmlFor="banner-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="text-center text-white">
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Change Banner</p>
                  </div>
                </label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </div>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="relative group shrink-0 -mt-20">
                    <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl font-bold text-primary">GE</span>
                      )}
                    </div>
                    <label htmlFor="profile-upload" className="absolute bottom-2 right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer">
                      <Camera className="w-4 h-4" />
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-foreground">{formData.organizationName}</h2>
                      {isVerified && (
                        <Badge className="bg-blue-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-foreground-light mb-4 max-w-3xl">{formData.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-foreground-light">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{formData.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground-light">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Founded in {formData.foundedYear}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground-light">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{formData.teamSize} Team Members</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground-light">
                        <Award className="w-4 h-4 text-primary" />
                        <span>{formData.volunteersServed} Volunteers Served</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-foreground-light">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* About & Contact Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* About Section - Takes 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Mission & Vision */}
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Our Mission
                      </h3>
                      <p className="text-foreground-light leading-relaxed">{formData.mission}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Our Vision
                      </h3>
                      <p className="text-foreground-light leading-relaxed">{formData.vision}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Focus Areas */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Focus Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.focusAreas.map((area) => (
                        <Badge key={area} className="bg-primary-light text-primary text-sm px-4 py-2">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Key Achievements
                    </h3>
                    <ul className="space-y-3">
                      {formData.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-foreground-light">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Sidebar - Takes 1 column */}
              <div className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-foreground-light mb-1">Email</p>
                          <a href={`mailto:${formData.email}`} className="text-sm text-primary hover:underline break-all">
                            {formData.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-foreground-light mb-1">Phone</p>
                          <a href={`tel:${formData.phone}`} className="text-sm text-foreground hover:text-primary">
                            {formData.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-foreground-light mb-1">Website</p>
                          <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                            {formData.website}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-foreground-light mb-1">Address</p>
                          <p className="text-sm text-foreground">{formData.address}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Registration Details */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Organization Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-foreground-light mb-1">Registration Number</p>
                        <p className="text-sm font-medium text-foreground">{formData.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground-light mb-1">Year Founded</p>
                        <p className="text-sm font-medium text-foreground">{formData.foundedYear}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground-light mb-1">Status</p>
                        <Badge className={isVerified ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                          {isVerified ? (
                            <><CheckCircle className="w-3 h-3 mr-1" />Active & Verified</>
                          ) : (
                            "Pending Verification"
                          )}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Social Media</h3>
                    <div className="space-y-3">
                      <a href={formData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground-light hover:text-primary transition-colors">
                        <Facebook className="w-5 h-5" />
                        <span className="text-sm">Facebook</span>
                      </a>
                      <a href={formData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground-light hover:text-primary transition-colors">
                        <Twitter className="w-5 h-5" />
                        <span className="text-sm">Twitter</span>
                      </a>
                      <a href={formData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground-light hover:text-primary transition-colors">
                        <Instagram className="w-5 h-5" />
                        <span className="text-sm">Instagram</span>
                      </a>
                      <a href={formData.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground-light hover:text-primary transition-colors">
                        <Linkedin className="w-5 h-5" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          /* Edit Mode */
          <Card>
            <CardContent className="pt-6">

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Edit Organization Profile</h2>
                
                {/* Banner Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Banner Image</label>
                  <div className="border-2 border-dashed border-border rounded-lg overflow-hidden">
                    {bannerImage ? (
                      <div className="relative h-48 group">
                        <img src={bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="space-x-2">
                            <label htmlFor="banner-edit-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white text-foreground rounded-lg hover:bg-gray-100 transition-colors">
                              <Camera className="w-4 h-4" />
                              Change
                            </label>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => setBannerImage(null)}
                              className="bg-white hover:bg-gray-100"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="banner-edit-upload" className="flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-surface transition-colors">
                        <Camera className="w-12 h-12 text-foreground-light mb-2" />
                        <span className="text-sm text-primary font-medium">Click to upload banner image</span>
                        <span className="text-xs text-foreground-light mt-1">Recommended size: 1200x320px</span>
                      </label>
                    )}
                    <input
                      id="banner-edit-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Profile Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Profile Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center overflow-hidden border-4 border-border">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-bold text-primary">GE</span>
                        )}
                      </div>
                      <label htmlFor="profile-edit-upload" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity flex items-center justify-center cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                      </label>
                      <input
                        id="profile-edit-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground mb-2">Upload your organization logo</p>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('profile-edit-upload')?.click()}>
                          Choose Image
                        </Button>
                        {profileImage && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => setProfileImage(null)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-foreground-light mt-1">Square image recommended (e.g., 400x400px)</p>
                    </div>
                  </div>
                </div>

                {/* Organization Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Organization Name *</label>
                  <Input
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Short Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                    placeholder="Brief description of your organization"
                  />
                </div>

                {/* Mission */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Mission Statement *</label>
                  <textarea
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-28"
                    placeholder="Your organization's mission"
                  />
                </div>

                {/* Vision */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Vision Statement *</label>
                  <textarea
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-28"
                    placeholder="Your organization's vision"
                  />
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone *</label>
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
                    <label className="text-sm font-medium text-foreground">City, State *</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                </div>

                {/* Full Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Address *</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address, suite, city, state, zip"
                  />
                </div>

                {/* Organization Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Registration Number</label>
                    <div className="px-4 py-2 rounded-lg border border-border bg-surface/50 text-foreground-light">
                      {formData.registrationNumber}
                    </div>
                    <p className="text-xs text-foreground-light">Registration number cannot be edited</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Founded Year *</label>
                    <Input
                      value={formData.foundedYear}
                      onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                      placeholder="e.g., 2020"
                    />
                  </div>
                </div>

                {/* Team Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Team Size *</label>
                  <Input
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    placeholder="e.g., 25"
                  />
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Facebook</label>
                      <Input
                        value={formData.socialMedia.facebook}
                        onChange={(e) => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, facebook: e.target.value }})}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Twitter</label>
                      <Input
                        value={formData.socialMedia.twitter}
                        onChange={(e) => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, twitter: e.target.value }})}
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Instagram</label>
                      <Input
                        value={formData.socialMedia.instagram}
                        onChange={(e) => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, instagram: e.target.value }})}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">LinkedIn</label>
                      <Input
                        value={formData.socialMedia.linkedin}
                        onChange={(e) => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, linkedin: e.target.value }})}
                        placeholder="https://linkedin.com/company/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1" 
                    size="lg" 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
