import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  const values = [
    {
      icon: "",
      title: "Community First",
      description: "We believe in the power of communities coming together to create positive change.",
    },
    {
      icon: "",
      title: "Sustainable Impact",
      description: "Every mission is designed to create lasting, meaningful impact in our communities.",
    },
    {
      icon: "",
      title: "Accessibility",
      description: "We make volunteering accessible to everyone, regardless of background or experience.",
    },
    {
      icon: "",
      title: "Innovation",
      description: "We continuously improve our platform to better connect volunteers with opportunities.",
    },
  ]

  const team = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      bio: "Passionate about social impact and technology",
    },
    {
      name: "Maria Garcia",
      role: "Head of Operations",
      bio: "Dedicated to connecting volunteers with meaningful work",
    },
    {
      name: "James Wilson",
      role: "Lead Developer",
      bio: "Building technology that makes a difference",
    },
    {
      name: "Priya Patel",
      role: "Community Manager",
      bio: "Fostering connections and building relationships",
    },
  ]

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-light via-background to-background py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                About VolunteerConnect
              </h1>
              <p className="text-xl text-foreground-light max-w-2xl mx-auto text-balance">
                We're on a mission to make volunteering accessible, meaningful, and impactful for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-lg text-foreground-light mb-4">
                  To connect passionate volunteers with meaningful opportunities that create positive change in their
                  communities.
                </p>
                <p className="text-lg text-foreground-light">
                  We believe that everyone has the power to make a difference, and we're here to help you find the
                  perfect way to contribute your time and talents.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-lg text-foreground-light mb-4">
                  A world where volunteering is the easiest way to create meaningful impact and build stronger
                  communities.
                </p>
                <p className="text-lg text-foreground-light">
                  We envision a future where technology bridges the gap between those who want to help and those who
                  need support, making the world a better place for everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-foreground-light">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-surface-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-accent mb-2">15,000+</div>
                <p className="text-gray-300">Volunteers Joined</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">500+</div>
                <p className="text-gray-300">Active Organizations</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">50,000+</div>
                <p className="text-gray-300">Hours Volunteered</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">1,000+</div>
                <p className="text-gray-300">Missions Completed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <Card key={member.name}>
                  <CardContent className="pt-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-primary">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{member.name}</h3>
                    <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-foreground-light">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary-light to-primary/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Make a Difference?</h2>
            <p className="text-lg text-foreground-light mb-8 text-balance">
              Join thousands of volunteers who are already creating positive change in their communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register?role=volunteer">Start Volunteering</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register?role=ngo">Post a Mission</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
