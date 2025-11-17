import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Heart, 
  TrendingUp, 
  Sparkles, 
  Rocket,
  Users,
  Target,
  Clock,
  MapPin,
  CheckCircle,
  Quote,
  Calendar,
  Award,
  Briefcase
} from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "Every decision we make prioritizes the volunteers and organizations building stronger, more connected communities together.",
    },
    {
      icon: TrendingUp,
      title: "Sustainable Impact",
      description: "We focus on creating long-term, measurable change rather than one-time events. Real impact takes time, and we're here for the journey.",
    },
    {
      icon: Sparkles,
      title: "Accessibility for All",
      description: "Whether you have 2 hours or 20, whether you're 16 or 60, volunteering should be easy to start and rewarding to continue.",
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "We've built 47 features based on feedback from real volunteers, constantly evolving to serve our community better.",
    },
  ]

  const team = [
    {
      name: "Mosabe BELHOUT",
      role: "Founder & CEO",
      bio: "Started VolunteerConnect after struggling to find volunteering opportunities. Now helping 15k volunteers avoid the same frustration.",
      initials: "BM",
    },
    {
      name: "Yazan Chibane",
      role: "Head of Operations",
      bio: "Codes by day, knows the challenges firsthand. Believes technology should make good things easier.",
      initials: "YC",
    },
    {
      name: "You",
      role: "need you",
      bio: "join our team to make your own story.",
      initials: "You",
    },
    {
      name: "You",
      role: "need you",
      bio: "join our team to make your own story.",
      initials: "You",
    },
    
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Volunteer",
      content: "I wanted to help my local food bank but didn't know where to start. VolunteerConnect made it as easy as ordering food online. Applied in 2 minutes, volunteered the next week!",
      initials: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Education for All - Director",
      content: "Before VolunteerConnect, we spent hours posting on multiple platforms. Now we post once and get qualified volunteers within days. It's changed how we operate.",
      initials: "MC",
    },
    {
      name: "Emma Rodriguez",
      role: "Volunteer",
      content: "As a college student with a crazy schedule, I love that I can filter by duration and date. Found a 2-hour opportunity that fit perfectly between classes.",
      initials: "ER",
    },
  ]

  const timeline = [
    {
      year: "2023",
      title: "The Beginning",
      description: "Founded in a college dorm room after our founder spent 3 weeks trying to find a simple tutoring opportunity.",
    },
    {
      year: "2024",
      title: "First 1,000 Volunteers",
      description: "Reached our first major milestone and partnered with 50 local NGOs across 3 cities.",
    },
    {
      year: "2024",
      title: "Platform Redesign",
      description: "Rebuilt from scratch based on user feedback. Added advanced search, filtering, and mobile app.",
    },
    {
      year: "2025",
      title: "15,000+ Strong",
      description: "Now serving 10 cities with 500+ verified organizations. Our community has volunteered over 50,000 hours!",
    },
  ]

  const stats = [
    { icon: Users, number: "15,000+", label: "Active Volunteers", color: "text-blue-500" },
    { icon: Target, number: "500+", label: "Verified NGOs", color: "text-green-500" },
    { icon: Clock, number: "50,000+", label: "Hours Volunteered", color: "text-purple-500" },
    { icon: MapPin, number: "10", label: "Cities Served", color: "text-orange-500" },
  ]

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary-light via-background to-background py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-primary">impact</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                Making Volunteering as Easy as Ordering Coffee
              </h1>
              <p className="text-xl md:text-2xl text-foreground-light max-w-3xl mx-auto text-balance">
                Every year, 5 million people want to volunteer but don't know where to start. We're changing that.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Story</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            </div>
            <div className="prose prose-lg max-w-none">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg text-foreground-light mb-4">
                    <strong className="text-foreground">It started with frustration.</strong> Our founders, <strong className="text-foreground">Mosabe & Yazan</strong>, joined a volunteering experience in Nepal. Simple enough, right? Wrong.
                  </p>
                  <p className="text-lg text-foreground-light mb-4">
                    After weeks of searching endlessly, wasting energy on complicated applications, and almost giving up, Mosabe finally got accepted and joined the volunteering mission. And once he arrived, he realized how life-changing the experience was, something everyone should live. But most people never reach that point because the process is too long, too confusing, and opportunities are hard to find. That is when he started thinking:<strong className="text-foreground"> how can I solve this? </strong>
                  </p>
                  <p className="text-lg text-foreground-light mb-4">
                    So, VolunteerConnect was born in a college dorm room. The mission was simple: make finding volunteer opportunities as easy as ordering food online.
                  </p>
                  <p className="text-lg text-foreground-light">
                    Today, we're helping volunteers find their perfect opportunity, and we're just getting started. <strong className="text-foreground">Because everyone deserves an easy way to make a difference.</strong>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

       

        {/* Mission & Vision */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-8 h-8 text-primary" />
                    <CardTitle className="text-3xl">Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-foreground-light mb-4">
                    <strong className="text-foreground">To eliminate every barrier</strong> between someone who wants to help and an opportunity to make real impact.
                  </p>
                  <p className="text-lg text-foreground-light">
                    No more endless searching. No more unreturned emails. No more wondering if you're "qualified enough." Just easy, accessible volunteering for everyone.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <CardTitle className="text-3xl">Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-foreground-light mb-4">
                    <strong className="text-foreground">A world where volunteering is the default</strong> — as normal as grabbing coffee with a friend.
                  </p>
                  <p className="text-lg text-foreground-light">
                    We envision communities where technology connects helpers to those who need it, creating a ripple effect of positive change that transforms society.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Impact</h2>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-8 pb-8">
                      <Icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
                      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.number}</div>
                      <p className="text-foreground-light font-medium">{stat.label}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            <div className="mt-8 text-center">
              <Badge variant="secondary" className="text-sm">
                Updated November 2025 • Growing every day
              </Badge>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What We Stand For</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-foreground-light max-w-2xl mx-auto">
                These aren't just words on a wall. They guide every feature we build and every decision we make.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <Card key={value.title} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="w-7 h-7 text-primary" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                          <p className="text-foreground-light leading-relaxed">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Community Says</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-foreground-light max-w-2xl mx-auto">
                Real stories from volunteers and organizations using VolunteerConnect
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="relative">
                  <CardContent className="pt-6">
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                    <p className="text-foreground-light mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-primary">{testimonial.initials}</span>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-foreground-light">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-foreground-light max-w-2xl mx-auto">
                We're a small team of volunteers who happen to work here full-time
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <Card key={member.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-3xl font-bold text-white">
                        {member.initials}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{member.name}</h3>
                    <p className="text-sm text-primary font-semibold mb-3">{member.role}</p>
                    <p className="text-sm text-foreground-light leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* We're Hiring Card */}
            <div className="mt-8">
              <Card className="border-2 border-primary/30 bg-primary/5">
                <CardContent className="pt-6 pb-6 text-center">
                  <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">We're Hiring!</h3>
                  <p className="text-foreground-light mb-4 max-w-2xl mx-auto">
                    Want to help us make volunteering easier for millions? We're looking for passionate people to join our mission.
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" size="lg">
                      View Open Positions
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust & Verification Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your Trust Matters</h2>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">100% Verified NGOs</h3>
                  <p className="text-foreground-light">
                    Every organization is manually verified by our team. We check registration, contact info, and legitimacy.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">100% Free Forever</h3>
                  <p className="text-foreground-light">
                    No hidden fees. No premium tiers. Volunteering should be free, and so is our platform. Always.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Privacy Protected</h3>
                  <p className="text-foreground-light">
                    Your data is yours. We never sell information, send spam, or share your details without permission.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-linear-to-br from-primary-light to-primary/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Make a Difference?</h2>
            <p className="text-lg text-foreground-light mb-8 text-balance">
              Join 15,000+ volunteers who've already found their perfect opportunity. Your community needs you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=volunteer">
                <Button size="lg">Start Volunteering Today</Button>
              </Link>
              <Link href="/register?role=ngo">
                <Button size="lg" variant="outline">Post Your First Mission</Button>
              </Link>
            </div>
            <p className="text-sm text-foreground-light mt-6">
              100% Free • Takes 2 minutes • Make an impact this week
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
