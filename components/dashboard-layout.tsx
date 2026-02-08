"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { AuthGuard } from "./auth-guard"
import { Navbar } from "./navbar"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "volunteer" | "ngo"
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user } = useAuth()

  // Derive display name and initials from real user data
  const displayName = userRole === "volunteer"
    ? (user?.volunteerProfile?.firstName
      ? `${user.volunteerProfile.firstName} ${user.volunteerProfile.lastName || ''}`.trim()
      : user?.email || 'Volunteer')
    : (user?.ngoProfile?.organizationName || user?.email || 'Organization')

  const displayEmail = user?.email || ''
  const initials = userRole === "volunteer"
    ? ((user?.volunteerProfile?.firstName?.[0] || '') + (user?.volunteerProfile?.lastName?.[0] || '')).toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
    : (user?.ngoProfile?.organizationName?.[0] || user?.email?.[0] || 'O').toUpperCase()

  const volunteerLinks = [
    { href: "/dashboard/volunteer", label: "Home", icon: "" },
    { href: "/dashboard/volunteer/missions", label: "Find Missions", icon: "" },
    { href: "/dashboard/volunteer/applications", label: "My Applications", icon: "" },
    { href: "/dashboard/volunteer/profile", label: "Profile", icon: "" },
    { href: "/dashboard/volunteer/settings", label: "Settings", icon: "" },
  ]

  const ngoLinks = [
    { href: "/dashboard/ngo", label: "Home", icon: "" },
    { href: "/dashboard/ngo/missions", label: "My Missions", icon: "" },
    { href: "/dashboard/ngo/applicants", label: "Applicants", icon: "" },
    { href: "/dashboard/ngo/create-mission", label: "Create Mission", icon: "" },
    { href: "/dashboard/ngo/profile", label: "Profile", icon: "" },
    { href: "/dashboard/ngo/settings", label: "Settings", icon: "" },
  ]

  const links = userRole === "volunteer" ? volunteerLinks : ngoLinks

  return (
    <AuthGuard>
    <Navbar />
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface shadow-sm transform transition-transform duration-300 lg:transform-none flex flex-col lg:top-16 lg:h-[calc(100vh-4rem)]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Close button for mobile */}
        <div className="p-4 border-b border-border flex items-center justify-end lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-foreground-light hover:text-foreground"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth text-sm font-medium",
                pathname === link.href
                  ? "bg-primary-light text-primary"
                  : "text-foreground-light hover:bg-primary-light/50 hover:text-foreground",
              )}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-border bg-surface mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0">
              <span className="text-primary font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-foreground-light truncate">{displayEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full lg:w-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-primary-light/50 rounded-lg transition-smooth"
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="font-bold text-foreground">Connect</span>
          </Link>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
    </AuthGuard>
  )
}
