"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut, LayoutDashboard } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-foreground-light hover:text-foreground transition-smooth">
              Home
            </Link>
            <Link
              href="/opportunities"
              className="text-sm text-foreground-light hover:text-foreground transition-smooth"
            >
              Opportunities
            </Link>
            <Link href="/about" className="text-sm text-foreground-light hover:text-foreground transition-smooth">
              About
            </Link>
            <Link href="/contact" className="text-sm text-foreground-light hover:text-foreground transition-smooth">
              Contact Us
            </Link>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* Desktop User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden md:flex">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-white text-sm">
                          {user.volunteerProfile?.firstName?.[0] || user.ngoProfile?.organizationName?.[0] || user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {user.volunteerProfile?.firstName || user.ngoProfile?.organizationName || 'User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                          {user.volunteerProfile?.firstName && user.volunteerProfile?.lastName
                            ? `${user.volunteerProfile.firstName} ${user.volunteerProfile.lastName}`
                            : user.ngoProfile?.organizationName || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <Badge variant="secondary" className="w-fit text-xs">
                          {user.role === 'VOLUNTEER' ? 'Volunteer' : user.role === 'NGO' ? 'Organization' : 'Admin'}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={user.role === 'VOLUNTEER' ? '/dashboard/volunteer' : '/dashboard/ngo'} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={user.role === 'VOLUNTEER' ? '/dashboard/volunteer/profile' : '/dashboard/ngo/profile'} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Mobile User Avatar */}
                <Button variant="ghost" size="sm" asChild className="md:hidden">
                  <Link href={user.role === 'VOLUNTEER' ? '/dashboard/volunteer' : '/dashboard/ngo'}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white text-sm">
                        {user.volunteerProfile?.firstName?.[0] || user.ngoProfile?.organizationName?.[0] || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex bg-transparent">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-primary-light transition-smooth"
            >
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 rounded-lg text-foreground-light hover:bg-primary-light hover:text-foreground transition-smooth"
            >
              Home
            </Link>
            <Link
              href="/opportunities"
              className="block px-4 py-2 rounded-lg text-foreground-light hover:bg-primary-light hover:text-foreground transition-smooth"
            >
              Opportunities
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 rounded-lg text-foreground-light hover:bg-primary-light hover:text-foreground transition-smooth"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 rounded-lg text-foreground-light hover:bg-primary-light hover:text-foreground transition-smooth"
            >
              Contact Us
            </Link>
            
            {isAuthenticated && user ? (
              <>
                <Link
                  href={user.role === 'VOLUNTEER' ? '/dashboard/volunteer' : '/dashboard/ngo'}
                  className="block px-4 py-2 rounded-lg text-foreground-light hover:bg-primary-light hover:text-foreground transition-smooth"
                >
                  Dashboard
                </Link>
                <Link
                  href={user.role === 'VOLUNTEER' ? '/dashboard/volunteer/profile' : '/dashboard/ngo/profile'}
                  className="block px-4 py-2 rounded-lg text-foreground-light hover:bg-primary-light hover:text-foreground transition-smooth"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-smooth"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-2 rounded-lg text-foreground-light hover:bg-primary-light hover:text-foreground transition-smooth"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
