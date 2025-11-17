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
  const skipRoleSelection = searchParams.get("role") !== null
  const [role, setRole] = useState<"volunteer" | "ngo">(initialRole)
  const [step, setStep] = useState(skipRoleSelection ? 2 : 1)

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
  const baseInterests = ["Education", "Environment", "Healthcare", "Community", "Animals", "Arts"]

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    interests: [] as string[], // selected interests (including any custom ones)
  })

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  const [showOther, setShowOther] = useState(false)
  const [customInterest, setCustomInterest] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Password strength calculation
  const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
    if (password.length === 0) return { strength: "", color: "", width: "0%" }
    
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { strength: "Weak", color: "bg-red-500", width: "33%" }
    if (score <= 4) return { strength: "Medium", color: "bg-yellow-500", width: "66%" }
    return { strength: "Strong", color: "bg-green-500", width: "100%" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  // Real-time validation
  const validateField = (field: string, value: string) => {
    let error = ""

    switch (field) {
      case "firstName":
      case "lastName":
        if (value.trim().length === 0) {
          error = `${field === "firstName" ? "First" : "Last"} name is required`
        } else if (value.trim().length < 2) {
          error = `${field === "firstName" ? "First" : "Last"} name must be at least 2 characters`
        } else if (!/^[a-zA-Z\s\-']+$/.test(value)) {
          error = "Only letters, spaces, hyphens, and apostrophes allowed"
        }
        break

      case "email":
        if (value.trim().length === 0) {
          error = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address"
        }
        break

      case "password":
        if (value.length === 0) {
          error = "Password is required"
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters"
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
          error = "Password must contain uppercase, lowercase, and number"
        }
        break

      case "confirmPassword":
        if (value.length === 0) {
          error = "Please confirm your password"
        } else if (value !== formData.password) {
          error = "Passwords don't match"
        }
        break

      case "phone":
        if (value.trim().length > 0 && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          error = "Please enter a valid phone number"
        }
        break
    }

    setErrors((prev) => ({ ...prev, [field]: error }))
    return error === ""
  }

  const validateForm = (): boolean => {
    const fields = ["firstName", "lastName", "email", "password", "confirmPassword"]
    let isValid = true

    fields.forEach((field) => {
      const value = formData[field as keyof typeof formData] as string
      if (!validateField(field, value)) {
        isValid = false
      }
    })

    if (formData.phone) {
      validateField("phone", formData.phone)
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setErrorMessage("Please fix all errors before submitting")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      console.log("Volunteer registration:", formData)
      
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        // Here you would redirect to login or dashboard
      }, 3000)
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setIsLoading(false)
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

  // Combine base interests with any custom interests the user added (avoid duplicates)
  const renderedInterests = [
    ...baseInterests,
    ...formData.interests.filter((i) => !baseInterests.includes(i)),
  ]

  const addCustomInterest = () => {
    const trimmed = customInterest.trim()
    if (trimmed === "") return
    // if it's already selected, do nothing; otherwise add it and mark as selected
    setFormData((prev) => {
      if (prev.interests.includes(trimmed)) return prev
      return { ...prev, interests: [...prev.interests, trimmed] }
    })
    setCustomInterest("")
    setShowOther(false)
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Your Volunteer Account</CardTitle>
        <CardDescription>Tell us about yourself</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Success Toast */}
        {showSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800">Account created successfully!</p>
              <p className="text-sm text-green-600">Redirecting you to login...</p>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {showError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="font-semibold text-red-800">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value })
                  validateField("firstName", e.target.value)
                }}
                onBlur={(e) => validateField("firstName", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.firstName ? "border-red-500" : "border-border"
                } bg-surface text-foreground focus:outline-none focus:ring-2 ${
                  errors.firstName ? "focus:ring-red-500" : "focus:ring-primary"
                }`}
                required
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value })
                  validateField("lastName", e.target.value)
                }}
                onBlur={(e) => validateField("lastName", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.lastName ? "border-red-500" : "border-border"
                } bg-surface text-foreground focus:outline-none focus:ring-2 ${
                  errors.lastName ? "focus:ring-red-500" : "focus:ring-primary"
                }`}
                required
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                validateField("email", e.target.value)
              }}
              onBlur={(e) => validateField("email", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email ? "border-red-500" : "border-border"
              } bg-surface text-foreground focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-primary"
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value })
                  validateField("phone", e.target.value)
                }}
                onBlur={(e) => validateField("phone", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.phone ? "border-red-500" : "border-border"
                } bg-surface text-foreground focus:outline-none focus:ring-2 ${
                  errors.phone ? "focus:ring-red-500" : "focus:ring-primary"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Areas of Interest</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {renderedInterests.map((interest) => (
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

              {/* "Other" Button */}
              <button
                type="button"
                onClick={() => setShowOther((prev) => !prev)}
                className={`p-2 rounded-lg border-2 transition-smooth text-sm font-medium ${
                  showOther ? "border-primary bg-primary-light text-primary" : "border-border bg-surface text-foreground-light hover:border-primary"
                }`}
              >
                Other
              </button>
            </div>

            {/* Show input when "Other" clicked */}
            {showOther && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  type="button"
                  onClick={addCustomInterest}
                >
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  validateField("password", e.target.value)
                }}
                onBlur={(e) => validateField("password", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-border"
                } bg-surface text-foreground focus:outline-none focus:ring-2 ${
                  errors.password ? "focus:ring-red-500" : "focus:ring-primary"
                }`}
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              
              {/* Password Strength Indicator */}
              {formData.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground-light">Password Strength:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.strength === "Weak" ? "text-red-500" :
                      passwordStrength.strength === "Medium" ? "text-yellow-500" : "text-green-500"
                    }`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <p className="text-xs text-foreground-light mt-1">
                    Use 8+ characters with uppercase, lowercase, and numbers
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value })
                  validateField("confirmPassword", e.target.value)
                }}
                onBlur={(e) => validateField("confirmPassword", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.confirmPassword ? "border-red-500" : "border-border"
                } bg-surface text-foreground focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? "focus:ring-red-500" : "focus:ring-primary"
                }`}
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              
              {/* Match Indicator */}
              {formData.confirmPassword.length > 0 && !errors.confirmPassword && (
                <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Passwords match
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              Back
            </Button>
            <Button type="submit" className="flex-1" size="lg" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
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
  })

  const [errors, setErrors] = useState({
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    website: "",
    description: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Password strength calculation
  const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
    if (password.length === 0) return { strength: "", color: "", width: "0%" }
    
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { strength: "Weak", color: "bg-red-500", width: "33%" }
    if (score <= 4) return { strength: "Medium", color: "bg-yellow-500", width: "66%" }
    return { strength: "Strong", color: "bg-green-500", width: "100%" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  // Real-time validation
  const validateField = (field: string, value: string) => {
    let error = ""

    switch (field) {
      case "organizationName":
        if (value.trim().length === 0) {
          error = "Organization name is required"
        } else if (value.trim().length < 2) {
          error = "Organization name must be at least 2 characters"
        } else if (/^\d+$/.test(value.trim())) {
          error = "Organization name cannot contain only numbers"
        }
        break

      case "email":
        if (value.trim().length === 0) {
          error = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address"
        }
        break

      case "password":
        if (value.length === 0) {
          error = "Password is required"
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters"
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
          error = "Password must contain uppercase, lowercase, and number"
        }
        break

      case "confirmPassword":
        if (value.length === 0) {
          error = "Please confirm your password"
        } else if (value !== formData.password) {
          error = "Passwords don't match"
        }
        break

      case "phone":
        if (value.trim().length > 0 && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          error = "Please enter a valid phone number"
        }
        break

      case "website":
        if (value.trim().length > 0 && !/^https?:\/\/.+/.test(value)) {
          error = "Website must start with http:// or https://"
        }
        break

      case "description":
        if (value.trim().length === 0) {
          error = "Organization description is required"
        } else if (value.trim().length < 20) {
          error = "Description must be at least 20 characters"
        }
        break
    }

    setErrors((prev) => ({ ...prev, [field]: error }))
    return error === ""
  }

  const validateForm = (): boolean => {
    const fields = ["organizationName", "email", "password", "confirmPassword", "description"]
    let isValid = true

    fields.forEach((field) => {
      const value = formData[field as keyof typeof formData] as string
      if (!validateField(field, value)) {
        isValid = false
      }
    })

    if (formData.phone) {
      validateField("phone", formData.phone)
    }

    if (formData.website) {
      validateField("website", formData.website)
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setErrorMessage("Please fix all errors before submitting")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      console.log("NGO registration:", formData)
      
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        // Here you would redirect to login or dashboard
      }, 3000)
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Register Your Organization</CardTitle>
        <CardDescription>Create an account to post missions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Success Toast */}
        {showSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800">Organization registered successfully!</p>
              <p className="text-sm text-green-600">Redirecting you to login...</p>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {showError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="font-semibold text-red-800">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Organization Name</label>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) => {
                setFormData({ ...formData, organizationName: e.target.value });
                validateField("organizationName", e.target.value);
              }}
              onBlur={(e) => validateField("organizationName", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.organizationName ? "border-red-500" : "border-border"
              } bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              required
            />
            {errors.organizationName && (
              <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>
            )}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  validateField("email", e.target.value);
                }}
                onBlur={(e) => validateField("email", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-border"
                } bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  validateField("phone", e.target.value);
                }}
                onBlur={(e) => validateField("phone", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.phone ? "border-red-500" : "border-border"
                } bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Website & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => {
                  setFormData({ ...formData, website: e.target.value });
                  if (e.target.value) validateField("website", e.target.value);
                }}
                onBlur={(e) => {
                  if (e.target.value) validateField("website", e.target.value);
                }}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.website ? "border-red-500" : "border-border"
                } bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">{errors.website}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Organization Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                validateField("description", e.target.value);
              }}
              onBlur={(e) => validateField("description", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.description ? "border-red-500" : "border-border"
              } bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24`}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  validateField("password", e.target.value);
                }}
                onBlur={(e) => validateField("password", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-border"
                } bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength === "Strong" ? "text-green-600" : 
                      passwordStrength.strength === "Medium" ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  validateField("confirmPassword", e.target.value);
                }}
                onBlur={(e) => validateField("confirmPassword", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.confirmPassword ? "border-red-500" : "border-border"
                } bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
              {/* Password Match Indicator */}
              {formData.password && formData.confirmPassword && !errors.confirmPassword && (
                <div className="flex items-center gap-2 text-green-600 text-sm mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Passwords match</span>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              Back
            </Button>
            <Button type="submit" className="flex-1" size="lg" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
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
