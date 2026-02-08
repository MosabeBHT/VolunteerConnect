"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Real-time validation
  const validateField = (field: string, value: string) => {
    let error = ""

    switch (field) {
      case "name":
        if (value.trim().length === 0) {
          error = "Name is required"
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters"
        } else if (!/^[a-zA-Z\s\-']+$/.test(value)) {
          error = "Name can only contain letters, spaces, hyphens, and apostrophes"
        }
        break

      case "email":
        if (value.trim().length === 0) {
          error = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address"
        }
        break

      case "subject":
        if (value.trim().length === 0) {
          error = "Subject is required"
        } else if (value.trim().length < 3) {
          error = "Subject must be at least 3 characters"
        }
        break

      case "message":
        if (value.trim().length === 0) {
          error = "Message is required"
        } else if (value.trim().length < 10) {
          error = "Message must be at least 10 characters"
        }
        break
    }

    setErrors((prev) => ({ ...prev, [field]: error }))
    return error === ""
  }

  // Validate entire form
  const validateForm = (): boolean => {
    const nameValid = validateField("name", formData.name)
    const emailValid = validateField("email", formData.email)
    const subjectValid = validateField("subject", formData.subject)
    const messageValid = validateField("message", formData.message)

    return nameValid && emailValid && subjectValid && messageValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    if (!validateForm()) {
      setErrorMessage("Please fix all errors before submitting")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call (contact form backend not yet implemented)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      setShowSuccess(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      setErrors({ name: "", email: "", subject: "", message: "" })

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      setErrorMessage("Failed to send message. Please try again.")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary-light via-background to-background py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Get in Touch</h1>
              <p className="text-xl text-foreground-light max-w-2xl mx-auto text-balance">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>We'll get back to you within 24 hours</CardDescription>
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
                      <p className="font-semibold text-green-800">Message sent successfully!</p>
                      <p className="text-sm text-green-600">We'll get back to you within 24 hours.</p>
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
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value })
                          validateField("name", e.target.value)
                        }}
                        onBlur={(e) => validateField("name", e.target.value)}
                        className={errors.name ? "border-red-500" : ""}
                        required
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value })
                          validateField("email", e.target.value)
                        }}
                        onBlur={(e) => validateField("email", e.target.value)}
                        className={errors.email ? "border-red-500" : ""}
                        required
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-foreground">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) => {
                          setFormData({ ...formData, subject: e.target.value })
                          validateField("subject", e.target.value)
                        }}
                        onBlur={(e) => validateField("subject", e.target.value)}
                        className={errors.subject ? "border-red-500" : ""}
                        required
                      />
                      {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-foreground">
                        Message
                      </label>
                      <textarea
                        id="message"
                        placeholder="Tell us more about your inquiry... (minimum 10 characters)"
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value })
                          validateField("message", e.target.value)
                        }}
                        onBlur={(e) => validateField("message", e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.message ? "border-red-500" : "border-border"
                        } bg-surface text-foreground placeholder:text-foreground-light focus:outline-none focus:ring-2 focus:ring-primary min-h-32`}
                        required
                      />
                      {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How do I get started as a volunteer?",
                  a: "Simply sign up on our platform, complete your profile, and start browsing available missions. You can apply to any mission that matches your interests and availability.",
                },
                {
                  q: "How do organizations post missions?",
                  a: "Organizations can create an account, verify their details, and start posting missions. Our team reviews each mission to ensure it meets our community standards.",
                },
                {
                  q: "Is there a cost to use VolunteerConnect?",
                  a: "VolunteerConnect is completely free for both volunteers and organizations. We believe in making volunteering accessible to everyone.",
                },
                {
                  q: "How do I track my volunteering hours?",
                  a: "Your dashboard automatically tracks all completed missions and the hours you've contributed. You can view your impact statistics anytime.",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-foreground-light">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
