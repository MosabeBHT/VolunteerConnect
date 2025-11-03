"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const initialRole = (searchParams.get("role") as "volunteer" | "ngo") || "volunteer"
  const [role, setRole] = useState<"volunteer" | "ngo">(initialRole)
  const [step, setStep] = useState(1)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4">
          {step === 1 ? (
            <RoleSelectionStep role={role} setRole={setRole} onNext={() => setStep(2)} />
          ) : role === "volunteer" ? (
            <VolunteerRegistrationStep onBack={() => setStep(1)} />
          ) : (
            <NGORegistrationStep onBack={() => setStep(1)} />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function RoleSelectionStep({
  role,
  setRole,
  onNext,
}: {
  role: "volunteer" | "ngo"
  setRole: (role: "volunteer" | "ngo") => void
  onNext: () => void
}) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Join VolunteerConnect</CardTitle>
        <CardDescription>Choose how you'd like to get involved</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setRole("volunteer")}
            className={`p-6 rounded-2xl border-2 transition-smooth text-left ${
              role === "volunteer" ? "border-primary bg-primary-light" : "border-border bg-surface hover:border-primary"
            }`}
          >
            <div className="text-2xl mb-2"></div>
            <h3 className="font-bold text-lg text-foreground mb-2">I'm a Volunteer</h3>
            <p className="text-sm text-foreground-light">
              Find meaningful opportunities and make a difference in your community
            </p>
          </button>

          <button
            onClick={() => setRole("ngo")}
            className={`p-6 rounded-2xl border-2 transition-smooth text-left ${
              role === "ngo" ? "border-primary bg-primary-light" : "border-border bg-surface hover:border-primary"
            }`}
          >
            <div className="text-2xl mb-2"></div>
            <h3 className="font-bold text-lg text-foreground mb-2">I'm an Organization</h3>
            <p className="text-sm text-foreground-light">Post missions and connect with passionate volunteers</p>
          </button>
        </div>

        <Button onClick={onNext} className="w-full" size="lg">
          Continue
        </Button>
      </CardContent>
    </Card>
  )
}

function VolunteerRegistrationStep({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    interests: [] as string[],
  })

  const interests = ["Education", "Environment", "Healthcare", "Community", "Animals", "Arts"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual registration
    console.log("Volunteer registration:", formData)
  }

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Your Volunteer Account</CardTitle>
        <CardDescription>Tell us about yourself</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">First Name</label>
              <input
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Phone & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
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

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              Back
            </Button>
            <Button type="submit" className="flex-1" size="lg">
              Create Account
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-foreground-light">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function NGORegistrationStep({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    website: "",
    location: "",
    description: "",
    registrationNumber: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual registration
    console.log("NGO registration:", formData)
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Register Your Organization</CardTitle>
        <CardDescription>Create an account to post missions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Organization Name</label>
            <input
              type="text"
              placeholder="Your Organization"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <input
                type="email"
                placeholder="contact@organization.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Website & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Website</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Organization Description</label>
            <textarea
              placeholder="Tell us about your organization..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
              required
            />
          </div>

          {/* Registration Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Registration Number</label>
            <input
              type="text"
              placeholder="NGO/NPO Registration Number"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              Back
            </Button>
            <Button type="submit" className="flex-1" size="lg">
              Create Account
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-foreground-light">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
