"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Sparkles, 
  Target, 
  Award, 
  Building,
  Plus,
  X 
} from "lucide-react"

export default function CompleteProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    mission: "",
    vision: "",
    phone: "",
    website: "",
    address: "",
    foundedYear: "",
    teamSize: "",
    focusAreas: [] as string[],
    achievements: [] as string[],
  })

  const [newFocusArea, setNewFocusArea] = useState("")
  const [newAchievement, setNewAchievement] = useState("")

  const commonFocusAreas = [
    "Environmental Conservation",
    "Education",
    "Healthcare",
    "Community Development",
    "Animal Welfare",
    "Arts & Culture",
    "Youth Development",
    "Elderly Care",
    "Poverty Alleviation",
    "Disaster Relief"
  ]

  const addFocusArea = (area: string) => {
    if (area && !formData.focusAreas.includes(area)) {
      setFormData({ ...formData, focusAreas: [...formData.focusAreas, area] })
      setNewFocusArea("")
    }
  }

  const removeFocusArea = (area: string) => {
    setFormData({ 
      ...formData, 
      focusAreas: formData.focusAreas.filter(a => a !== area) 
    })
  }

  const addAchievement = () => {
    if (newAchievement.trim() && !formData.achievements.includes(newAchievement.trim())) {
      setFormData({ 
        ...formData, 
        achievements: [...formData.achievements, newAchievement.trim()] 
      })
      setNewAchievement("")
    }
  }

  const removeAchievement = (achievement: string) => {
    setFormData({ 
      ...formData, 
      achievements: formData.achievements.filter(a => a !== achievement) 
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.mission || !formData.vision) {
      toast({
        title: "Required fields",
        description: "Please fill in mission and vision statements",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await api.updateNGOProfile(formData)
      
      toast({
        title: "Profile completed!",
        description: "Your organization profile has been set up successfully",
      })

      // Redirect to dashboard
      router.push('/dashboard/ngo')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/dashboard/ngo')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Banner */}
      <div className="bg-linear-to-br from-primary/20 via-primary/10 to-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Welcome to VolunteerConnect!
          </h1>
          <p className="text-xl text-foreground-light mb-2">
            Hello, <span className="text-primary font-semibold">{user?.ngoProfile?.organizationName}</span>
          </p>
          <p className="text-foreground-light max-w-2xl mx-auto">
            Let's complete your organization profile so volunteers can learn more about your mission and the impact you're making.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mission & Vision */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Mission & Vision
              </CardTitle>
              <CardDescription>
                Define your organization's purpose and future aspirations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Mission Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.mission}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-32"
                  placeholder="What is your organization's core purpose? What do you aim to achieve?"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Vision Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-32"
                  placeholder="What future do you envision? Where do you see your organization going?"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact & Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Organization Details
              </CardTitle>
              <CardDescription>
                Provide contact information and organizational details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Website</label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourorganization.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street, Suite 400, City, State 12345"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Founded Year</label>
                  <Input
                    type="text"
                    value={formData.foundedYear}
                    onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                    placeholder="e.g., 2020"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Team Size</label>
                  <Input
                    type="text"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    placeholder="e.g., 25"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Focus Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Focus Areas</CardTitle>
              <CardDescription>
                What causes does your organization work on?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {commonFocusAreas.map((area) => (
                  <Badge
                    key={area}
                    onClick={() => addFocusArea(area)}
                    className={`cursor-pointer transition-all ${
                      formData.focusAreas.includes(area)
                        ? "bg-primary text-white"
                        : "bg-surface text-foreground hover:bg-primary/10"
                    }`}
                  >
                    {formData.focusAreas.includes(area) && (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    {area}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newFocusArea}
                  onChange={(e) => setNewFocusArea(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addFocusArea(newFocusArea)
                    }
                  }}
                  placeholder="Add custom focus area..."
                />
                <Button 
                  type="button" 
                  onClick={() => addFocusArea(newFocusArea)}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.focusAreas.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Selected Focus Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.focusAreas.map((area) => (
                      <Badge key={area} className="bg-primary text-white">
                        {area}
                        <X 
                          className="w-3 h-3 ml-2 cursor-pointer" 
                          onClick={() => removeFocusArea(area)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Key Achievements
              </CardTitle>
              <CardDescription>
                Highlight your organization's accomplishments and milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addAchievement()
                    }
                  }}
                  placeholder="e.g., Planted over 10,000 trees in local communities"
                />
                <Button 
                  type="button" 
                  onClick={addAchievement}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.achievements.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Your Achievements:</p>
                  <ul className="space-y-2">
                    {formData.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-surface rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="flex-1 text-foreground">{achievement}</span>
                        <X 
                          className="w-4 h-4 text-foreground-light hover:text-red-500 cursor-pointer shrink-0" 
                          onClick={() => removeAchievement(achievement)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1"
            >
              Skip for now
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
