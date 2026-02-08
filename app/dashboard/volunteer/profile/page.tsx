"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Award, 
  Clock, 
  CheckCircle,
  Target,
  Heart,
  Star,
  TrendingUp,
  Calendar,
  Edit,
  Loader2
} from "lucide-react"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    interests: [] as string[],
    skills: [] as string[],
    availability: "",
    experience: ""
  })

  const interests = ["Education", "Environment", "Healthcare", "Community", "Animals", "Arts", "Technology", "Sports"]
  const skillsList = ["Teaching", "Gardening", "Leadership", "Cooking", "Writing", "Design", "Public Speaking", "First Aid"]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getMyProfile()
        const profile = response.data?.volunteerProfile
        if (profile) {
          setFormData({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            email: response.data.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            bio: profile.bio || "",
            interests: profile.interests || [],
            skills: profile.skills || [],
            availability: profile.availability || "",
            experience: profile.experience || ""
          })
          if (profile.profileImage) setProfileImage(profile.profileImage)
          if (profile.bannerImage) setBannerImage(profile.bannerImage)
        } else {
          // Fallback to auth context data
          setFormData(prev => ({
            ...prev,
            firstName: user?.volunteerProfile?.firstName || "",
            lastName: user?.volunteerProfile?.lastName || "",
            email: user?.email || "",
            location: user?.volunteerProfile?.location || "",
            skills: user?.volunteerProfile?.skills || [],
            interests: user?.volunteerProfile?.interests || [],
          }))
        }
      } catch (error) {
        // Fallback to user data from auth
        setFormData(prev => ({
          ...prev,
          firstName: user?.volunteerProfile?.firstName || "",
          lastName: user?.volunteerProfile?.lastName || "",
          email: user?.email || "",
        }))
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { email, ...profileData } = formData
      await api.updateVolunteerProfile({
        ...profileData,
        profileImage: profileImage || undefined,
        bannerImage: bannerImage || undefined,
      })
      
      // Update auth context
      if (user) {
        const meResponse = await api.getMe()
        updateUser(meResponse.data)
      }

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

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setProfileImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setBannerImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

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

  const totalHours = user?.volunteerProfile?.totalHours || 0
  const initials = ((formData.firstName?.[0] || '') + (formData.lastName?.[0] || '')).toUpperCase() || 'V'

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
      <div className="space-y-6">
        {/* Header */}
        <div className="relative bg-linear-to-r from-[#6b47c0] via-[#524584] to-[#3a3556] rounded-2xl p-6 md:p-8 text-white overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
              <p className="text-purple-100">Manage your volunteer profile and preferences</p>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)} className="bg-white text-purple-600 hover:bg-purple-50">
              {isEditing ? "Cancel" : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>

        {!isEditing ? (
          <>
            {/* Profile Header Card */}
            <Card className="overflow-hidden shadow-lg border-2 border-purple-100">
              <div className="relative h-56 bg-linear-to-br from-purple-500 via-purple-400 to-pink-400 group cursor-pointer">
                {bannerImage && (
                  <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                )}
              </div>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="relative shrink-0 -mt-20">
                    <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl font-bold bg-gradient-to-br from-purple-500 to-purple-600 bg-clip-text text-transparent">{initials}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      {formData.firstName} {formData.lastName}
                    </h2>
                    <p className="text-foreground-light mb-4">{formData.bio || 'No bio added yet.'}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-foreground-light">
                        <Mail className="w-4 h-4 text-purple-600" />
                        <span>{formData.email}</span>
                      </div>
                      {formData.phone && (
                        <div className="flex items-center gap-2 text-foreground-light">
                          <Phone className="w-4 h-4 text-purple-600" />
                          <span>{formData.phone}</span>
                        </div>
                      )}
                      {formData.location && (
                        <div className="flex items-center gap-2 text-foreground-light">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <span>{formData.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="shadow-lg border-2 border-white bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{totalHours}</p>
                      <p className="text-sm text-foreground-light">Hours Volunteered</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-2 border-white bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{formData.skills.length}</p>
                      <p className="text-sm text-foreground-light">Skills</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-2 border-white bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{formData.interests.length}</p>
                      <p className="text-sm text-foreground-light">Interests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interests & Skills */}
            <Card className="shadow-lg border-purple-100">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                    Areas of Interest
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.length > 0 ? formData.interests.map((interest) => (
                      <Badge key={interest} className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-md px-4 py-2 text-sm">
                        {interest}
                      </Badge>
                    )) : (
                      <p className="text-sm text-foreground-light">No interests added yet. Edit your profile to add some!</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.length > 0 ? formData.skills.map((skill) => (
                      <Badge key={skill} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md px-4 py-2 text-sm">
                        {skill}
                      </Badge>
                    )) : (
                      <p className="text-sm text-foreground-light">No skills added yet. Edit your profile to add some!</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Edit Mode */
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Edit Your Profile</h2>
                
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">First Name *</label>
                    <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Last Name *</label>
                    <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input type="email" value={formData.email} disabled className="bg-surface/50" />
                    <p className="text-xs text-foreground-light">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone</label>
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="City, State" />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-32"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Areas of Interest</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`p-3 rounded-lg border-2 transition-smooth text-sm font-medium ${
                          formData.interests.includes(interest)
                            ? "border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700"
                            : "border-border bg-surface text-foreground-light hover:border-purple-300"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Skills & Expertise</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {skillsList.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`p-3 rounded-lg border-2 transition-smooth text-sm font-medium ${
                          formData.skills.includes(skill)
                            ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700"
                            : "border-border bg-surface text-foreground-light hover:border-blue-300"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700" 
                    size="lg" 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
