"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

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

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex bg-transparent">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>

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
            <Link
              href="/login"
              className="block px-4 py-2 rounded-lg text-foreground-light hover:bg-primary-light hover:text-foreground transition-smooth"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
