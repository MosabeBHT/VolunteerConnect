import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { 
  MapPin, 
  Award, 
  Target, 
  Users, 
  TrendingUp, 
  Shield,
  Clock,
  Heart,
  CheckCircle2,
  ArrowRight
} from "lucide-react"

// Placeholder Components for Images
const VolunteerImage = () => (
    <div className="hidden [@media(min-width:1150px)]:block absolute top-15 left-[-100px] md:left-5 h-[400px] w-auto z-10">
        <Image 
            src="/volunteer-man.png"
            alt="Volunteer man sitting in armchair and smiling"
            width={400}
            height={400}
            priority 
        />
    </div>
)

const OrganizationImage = () => (
    <div className="hidden [@media(min-width:1150px)]:block absolute top-45 right-[-100px] md:right-5 h-[400px] w-auto z-10">
        <Image 
            src="/organization-man.png"
            alt="Man sitting with laptop on beanbag"
            width={400}
            height={400}
            priority
        />
    </div>
)

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* -------------------- Hero Section -------------------- */}
        <section className="relative overflow-hidden bg-gradient-to-tr from-[#6b47c0] via-[#524584] to-[#3a3556] py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="relative text-center pt-16 pb-16 md:pt-20 md:pb-20 text-white">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Shield className="w-3 h-3 mr-1" />
                100% Free Platform
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-balance">
                The Gateway for Volunteering
              </h1>
              
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 text-balance">
                Making community impact simple, meaningful, and rewarding
              </p>
              
              {/* Dual CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="shadow-lg bg-white text-purple-700 hover:bg-gray-100" asChild> 
                  <Link href="/opportunities" className="flex items-center gap-2">
                    <span>Find Opportunities</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="shadow-lg border-white text-white hover:bg-white/10" asChild>
                  <Link href="/register?role=ngo">
                    Post a Mission
                  </Link>
                </Button>
              </div>

              {/* Trust Badge */}
              <p className="mt-8 text-sm text-gray-300">
                <Users className="inline w-4 h-4 mr-1" />
                Join 15,000+ volunteers making a difference
              </p>

              <VolunteerImage />
              <OrganizationImage />
            </div>
          </div>
        </section>
        
        {/* -------------------- How It Works Section -------------------- */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-foreground-light max-w-2xl mx-auto">
                Getting started is simple. Follow these three easy steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">1. Create Your Profile</h3>
                <p className="text-foreground-light">
                  Sign up in minutes and tell us about your skills, interests, and availability.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">2. Browse & Apply</h3>
                <p className="text-foreground-light">
                  Discover personalized opportunities that match your passion and location.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">3. Make Impact</h3>
                <p className="text-foreground-light">
                  Volunteer, track your hours, and watch your community impact grow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------- What is V-Connect Section -------------------- */}
        <section className="bg-surface py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              
              {/* Left Column - Heading and Button */}
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  What is V-Connect?
                </h2>
                <p className="text-base text-foreground-light leading-relaxed mb-6">
                  V-Connect bridges the gap between passionate volunteers and 
                  impactful organizations. Our intelligent matching system connects 
                  you with opportunities that align with your skills, interests, and 
                  schedule—making it easier than ever to give back to your community.
                </p>
                
              </div>

              {/* Right Column - Feature Highlights */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Smart Matching</h3>
                    <p className="text-sm text-foreground-light">
                      AI-powered recommendations based on your skills and interests
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Verified Organizations</h3>
                    <p className="text-sm text-foreground-light">
                      All NGOs are verified to ensure safe, legitimate opportunities
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Track Your Impact</h3>
                    <p className="text-sm text-foreground-light">
                      Visualize your contribution with hours logged, badges earned, and more
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------- Features Cards Section -------------------- */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Built for Everyone
              </h2>
              <p className="text-lg text-foreground-light">
                Whether you're a volunteer or an organization, we've got you covered
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Volunteers Card */}
              <Card className="bg-primary-light/30 border-primary-light/50 hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">For Volunteers</h3>
                  <ul className="space-y-3 text-foreground-light">
                    <li className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Discover local opportunities near you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Track hours and earn achievement badges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Get personalized mission recommendations</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6" asChild>
                    <Link href="/register?role=volunteer">Get Started as Volunteer</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Organizations Card */}
              <Card className="bg-surface-dark text-white border-surface-dark hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">For Organizations</h3>
                  <ul className="space-y-3 text-gray-200">
                    <li className="flex items-start gap-2">
                      <Users className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <span>Reach thousands of motivated volunteers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <span>Manage applications in one dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <span>Fill volunteer roles faster than ever</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-white text-purple-700 hover:bg-gray-100" asChild>
                    <Link href="/register?role=ngo">Register Your Organization</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* -------------------- Stats & Social Proof Section -------------------- */}
        <section className="py-16 md:py-24 bg-primary-light/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Impact
              </h2>
              <p className="text-lg text-foreground-light">
                Join a growing community making real change
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Stat 1 */}
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold text-primary mb-2">15,000+</div>
                <div className="text-lg font-semibold text-foreground">Volunteers Joined</div>
                <p className="text-sm text-foreground-light mt-1">And growing every day</p>
              </div>

              {/* Stat 2 */}
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold text-primary mb-2">500+</div>
                <div className="text-lg font-semibold text-foreground">Active Organizations</div>
                <p className="text-sm text-foreground-light mt-1">Verified and trusted</p>
              </div>

              {/* Stat 3 */}
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold text-primary mb-2">50,000+</div>
                <div className="text-lg font-semibold text-foreground">Hours Contributed</div>
                <p className="text-sm text-foreground-light mt-1">Making real impact</p>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------- Testimonials Section -------------------- */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What People Say
              </h2>
              <p className="text-lg text-foreground-light">
                Real stories from our community members
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">SJ</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Sarah Johnson</p>
                      <p className="text-sm text-foreground-light">Volunteer</p>
                    </div>
                  </div>
                  <p className="text-foreground-light italic">
                    "V-Connect helped me find the perfect volunteering role that matches my schedule. 
                    I've made amazing connections and real impact in my community!"
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">GE</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Green Earth Initiative</p>
                      <p className="text-sm text-foreground-light">NGO</p>
                    </div>
                  </div>
                  <p className="text-foreground-light italic">
                    "We filled our volunteer positions in just 48 hours! The platform is intuitive 
                    and connects us with truly passionate volunteers."
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">MC</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Mike Chen</p>
                      <p className="text-sm text-foreground-light">Volunteer</p>
                    </div>
                  </div>
                  <p className="text-foreground-light italic">
                    "The matching system is brilliant. I've been recommended opportunities I never 
                    would have found on my own. Highly recommend!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* -------------------- FAQ Section -------------------- */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-foreground mb-2">How do I get started as a volunteer?</h3>
                  <p className="text-foreground-light">
                    Simply sign up on our platform, complete your profile with your interests and skills, 
                    and start browsing available missions. You can apply to any opportunity that matches 
                    your preferences.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-foreground mb-2">Is V-Connect really free?</h3>
                  <p className="text-foreground-light">
                    Yes! VolunteerConnect is 100% free for both volunteers and organizations. We believe 
                    in making volunteering accessible to everyone without financial barriers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-foreground mb-2">How do organizations post missions?</h3>
                  <p className="text-foreground-light">
                    Organizations can create an account, complete verification, and start posting missions 
                    immediately. Our team reviews each mission to ensure it meets our community standards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-foreground mb-2">How do I track my volunteering hours?</h3>
                  <p className="text-foreground-light">
                    Your dashboard automatically tracks all completed missions and the hours you've contributed. 
                    You can view detailed statistics, earned badges, and your overall community impact anytime.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* -------------------- Final CTA Section -------------------- */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary-light to-primary/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-foreground-light mb-8 text-balance">
              Join thousands of volunteers and organizations creating positive change in communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register?role=volunteer" className="flex items-center gap-2">
                  <span>Start Volunteering Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register?role=ngo">Post Your First Mission</Link>
              </Button>
            </div>
          </div>
        </section>
        
      </main>
      <Footer />
    </>
  )
}