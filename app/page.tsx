import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

// Placeholder Components for Images (You'll need to create these or use <img> tags)
const VolunteerImage = () => (
    // The design shows the man sitting in the armchair on the left.
    <div className="absolute top-15 left-[-100px] md:left-5 h-[400px] w-auto z-10">
        <Image 
            src="/volunteer-man.png" // <-- Path from the public folder
            alt="Volunteer man sitting in armchair and smiling"
            width={400} // Set dimensions based on your design
            height={400} // Set dimensions based on your design
            priority 
        />
    </div>
)

const OrganizationImage = () => (
    // The design shows the man on the beanbag with a laptop on the right.
    <div className="absolute top-45 right-[-100px] md:right-5 h-[400px] w-auto z-10">
        <Image 
            src="/organization-man.png" // <-- Path from the public folder
            alt="Man sitting with laptop on beanbag"
            width={400} // Set dimensions based on your design
            height={400} // Set dimensions based on your design
            priority
        />
    </div>
)

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* -------------------- Hero & What Is V>Connect? Section -------------------- */}
        <section className="relative overflow-hidden bg-gradient-to-tr from-[#6b47c0] via-[#524584] to-[#3a3556] py-10 pt-4 md:pt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

            {/* Title Block (Centered) - Matches the image */}
            <div className="relative text-center pt-24 pb-20 md:pt-36 md:pb-32 text-white">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-balance shadow-text">
                The Gateway for Volunteering
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 text-balance">
                The simplest wayyyy to find local volunteering opportunities that match your passion, made to make volunteering experience smooth
              </p>
              {/* Note: I'm making this a simple button that directs to opportunities, as seen in the image. */}
              <Button size="lg" className="shadow-lg" asChild> 
                <Link href="/opportunities">Find Opportunities</Link>
              </Button>

              {/* Image Placeholders (Positioned to match design) */}
              <VolunteerImage />
              <OrganizationImage />
            </div>
          </div>
        </section>
        
        {/* -------------------- What is V>Connect? Section -------------------- */}
        <section className="bg-background py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              
              {/* Left Column - Heading and Button */}
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  What is V-Connect?
                </h2>
                <Button size="lg" className="mt-4" variant="default">
                  Got to know us
                </Button>
              </div>

              {/* Right Column - Text (Placeholder) */}
              <p className="text-base text-foreground-light leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------- Volunteers/Organization Features (Card Section) -------------------- */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Volunteers Card */}
              <div className="bg-primary-light/50 rounded-2xl p-8 border border-primary-light">
                <h3 className="text-2xl font-bold text-foreground mb-4">Volunteers</h3>
                <ul className="space-y-3 text-foreground-light">
                  <li>✓ Find events near you</li>
                  <li>✓ Track your impact</li>
                  <li>✓ Connect with organizations</li>
                </ul>
              </div>
              {/* Organization Card - Dark/Purple Themed */}
              <div className="bg-surface-dark rounded-2xl p-8 text-white border border-surface-dark">
                <h3 className="text-2xl font-bold mb-4">Organization</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>✓ Reach motivated volunteers</li>
                  <li>✓ Easy application tracking</li>
                  <li>✓ Increase your impact</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------- Stats Section (Refactored to match image) -------------------- */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column - Stats Card */}
              <div className="bg-primary-light/50 rounded-2xl p-8 max-w-md">
                <div className="text-6xl font-extrabold text-[#7e57c2] mb-4">+15,000</div>
                <div className="text-xl font-semibold text-foreground mb-6">Volunteers Joined</div>
                <div className="text-6xl font-extrabold text-[#9c27b0] mb-4">+500</div>
                <div className="text-xl font-semibold text-foreground">Active Organizations</div>
              </div>

              {/* Right Column - Trusted By (Placeholder) */}
              <div className="pt-8">
                <p className="text-foreground-light mb-4">Trusted by</p>
                {/* Placeholders for partner logos */}
                <div className="space-y-4">
                    <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials (Skipped for brevity, but this would be the next section) */}
        
      </main>
      <Footer />
    </>
  )
}