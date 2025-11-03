"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "volunteer" | "ngo"
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const pathname = usePathname()

  const volunteerLinks = [
    { href: "/dashboard/volunteer", label: "Home", icon: "🏠" },
    { href: "/dashboard/volunteer/missions", label: "Find Missions", icon: "🎯" },
    { href: "/dashboard/volunteer/applications", label: "My Applications", icon: "📋" },
    { href: "/dashboard/volunteer/profile", label: "Profile", icon: "👤" },
    { href: "/dashboard/volunteer/settings", label: "Settings", icon: "⚙️" },
  ]

  const ngoLinks = [
    { href: "/dashboard/ngo", label: "Home", icon: "🏠" },
    { href: "/dashboard/ngo/missions", label: "My Missions", icon: "📝" },
    { href: "/dashboard/ngo/applicants", label: "Applicants", icon: "👥" },
    { href: "/dashboard/ngo/create-mission", label: "Create Mission", icon: "➕" },
    { href: "/dashboard/ngo/profile", label: "Profile", icon: "🏢" },
    { href: "/dashboard/ngo/settings", label: "Settings", icon: "⚙️" },
  ]

  const links = userRole === "volunteer" ? volunteerLinks : ngoLinks

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface shadow-sm">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="font-bold text-foreground">Connect</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
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
        <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t border-border bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-primary font-bold">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-foreground-light truncate">john@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
