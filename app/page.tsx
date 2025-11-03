import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-light via-background to-background py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                  The Gateway for Volunteering
                </h1>
                <p className="text-lg text-foreground-light mb-8 text-balance">
                  The simplest way to find local volunteering opportunities that match your passion
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/register?role=volunteer">Join as Volunteer</Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/register?role=ngo">Join as Organization</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-96 bg-gradient-to-br from-accent/20 to-accent-pink/20 rounded-3xl" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-primary-light rounded-2xl p-8">
                <div className="text-4xl font-bold text-primary mb-2">+15,000</div>
                <div className="text-lg text-foreground">Volunteers Joined</div>
              </div>
              <div className="bg-surface-dark rounded-2xl p-8 text-white">
                <div className="text-4xl font-bold text-accent mb-2">+500</div>
                <div className="text-lg">Active Organizations</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              What is VolunteerConnect?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-primary-light rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">For Volunteers</h3>
                <ul className="space-y-3 text-foreground-light">
                  <li>✓ Find events near you</li>
                  <li>✓ Track your impact</li>
                  <li>✓ Connect with organizations</li>
                </ul>
              </div>
              <div className="bg-surface-dark rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">For Organizations</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>✓ Reach motivated volunteers</li>
                  <li>✓ Easy application tracking</li>
                  <li>✓ Increase your impact</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
