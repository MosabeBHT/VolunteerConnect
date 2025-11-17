"use client"

import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  User,
  Backpack,
  Target,
  Info
} from "lucide-react"

// Mock data - In real app, this would come from a database or API
const opportunitiesData = [
  {
    id: "1",
    title: "Community Garden Cleanup",
    organization: "Green Earth Initiative",
    category: "Environment",
    location: "Downtown Park, 123 Park Avenue, City Center",
    date: "Nov 25, 2025",
    duration: "4 hours",
    volunteers: 12,
    description: "Join our team to clean and maintain the downtown community garden. Tasks include weeding, planting seasonal flowers, and organizing the compost area.",
    fullDescription: "Join Green Earth Initiative for a rewarding day of community gardening! We're organizing a comprehensive cleanup and maintenance session at our beloved Downtown Park community garden. This garden serves as a green oasis in our urban environment and provides fresh produce to local families. Your contribution will help maintain this vital community resource and create a beautiful, sustainable space for everyone to enjoy.",
    image: "/opportunities/garden.jpg",
    verified: true,
    featured: true,
    spotsLeft: 5,
    urgent: false,
    requirements: [
      "No prior gardening experience required",
      "Must be at least 16 years old",
      "Ability to perform light physical work",
      "Enthusiastic attitude and willingness to learn",
      "Commitment to full session duration"
    ],
    whatVolunteersDo: [
      "Weed garden beds and pathways",
      "Plant seasonal flowers and vegetables",
      "Organize and turn compost area",
      "Clean and maintain garden tools",
      "Water plants and seedlings",
      "Set up mulch around plants"
    ],
    whoCanApply: [
      "Individuals aged 16 and above",
      "Groups and families welcome",
      "Students seeking community service hours",
      "Nature and gardening enthusiasts",
      "First-time volunteers encouraged"
    ],
    whatToBring: [
      "Comfortable clothes you don't mind getting dirty",
      "Closed-toe shoes or boots",
      "Sun hat and sunscreen",
      "Reusable water bottle",
      "Work gloves (if you have them - extras provided)",
      "Positive attitude and energy!"
    ],
    contact: {
      name: "Sarah Johnson",
      role: "Volunteer Coordinator",
      email: "sarah@greenearthinitiative.org",
      phone: "+1 (555) 123-4567"
    },
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316d5e3b77%3A0x7b5e7d8c4a5b6c9d!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890123"
  },
  {
    id: "2",
    title: "Tutoring Session",
    organization: "Education for All",
    category: "Education",
    location: "Community Center, 456 Main Street, Downtown",
    date: "Nov 20, 2025",
    duration: "2 hours",
    volunteers: 5,
    description: "Help high school students excel in mathematics. Share your knowledge and make a lasting impact on young minds.",
    fullDescription: "Education for All is seeking passionate tutors to help high school students master mathematics. Whether it's algebra, geometry, or calculus, your expertise can make a real difference in a student's academic journey. This is a one-on-one or small group tutoring session where you'll work directly with students who need extra support in math.",
    image: "/opportunities/tutoring.jpg",
    verified: true,
    featured: false,
    spotsLeft: 2,
    urgent: true,
    requirements: [
      "Strong knowledge of high school mathematics",
      "Patience and good communication skills",
      "At least 18 years old",
      "Background check required (we'll assist)",
      "Commitment to at least one session"
    ],
    whatVolunteersDo: [
      "Provide one-on-one math tutoring",
      "Explain complex concepts in simple terms",
      "Help with homework and assignments",
      "Prepare students for tests and exams",
      "Build student confidence in math",
      "Track student progress"
    ],
    whoCanApply: [
      "College students majoring in STEM fields",
      "Math teachers or former educators",
      "Professionals with strong math background",
      "Anyone passionate about education",
      "Graduate students welcome"
    ],
    whatToBring: [
      "Valid ID for check-in",
      "Calculator (scientific or graphing)",
      "Notebook and pens",
      "Math reference materials (optional)",
      "Laptop or tablet (optional)",
      "Enthusiasm for teaching!"
    ],
    contact: {
      name: "Michael Chen",
      role: "Program Director",
      email: "michael@educationforall.org",
      phone: "+1 (555) 234-5678"
    },
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316d5e3b77%3A0x7b5e7d8c4a5b6c9d!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890123"
  },
  {
    id: "3",
    title: "Animal Shelter Support",
    organization: "Paws & Love",
    category: "Animals",
    location: "Animal Shelter, 789 Pet Lane, Northside",
    date: "Dec 1, 2025",
    duration: "3 hours",
    volunteers: 8,
    description: "Help care for rescued animals, assist with feeding, cleaning, and socializing with our furry friends.",
    fullDescription: "Join Paws & Love in caring for rescued cats and dogs awaiting their forever homes. You'll work directly with animals, providing them with love, care, and attention while helping maintain a clean, safe shelter environment. This is perfect for animal lovers who want to make a direct impact on the lives of homeless pets.",
    image: "/opportunities/animals.jpg",
    verified: true,
    featured: false,
    spotsLeft: 10,
    urgent: false,
    requirements: [
      "Love for animals (cats and dogs)",
      "Must be at least 16 years old",
      "Comfortable around animals of all sizes",
      "Physical ability to walk dogs and clean kennels",
      "No severe animal allergies"
    ],
    whatVolunteersDo: [
      "Feed and provide fresh water to animals",
      "Clean kennels and litter boxes",
      "Walk and exercise dogs",
      "Socialize and play with cats and dogs",
      "Groom animals (brushing, bathing)",
      "Assist with basic health checks"
    ],
    whoCanApply: [
      "Animal lovers of all backgrounds",
      "Teenagers (16+) with parental consent",
      "Families with children (supervised)",
      "Students earning volunteer hours",
      "Anyone seeking animal therapy"
    ],
    whatToBring: [
      "Old clothes you don't mind getting dirty or hairy",
      "Closed-toe shoes (required for safety)",
      "Hair tie (if you have long hair)",
      "Water bottle",
      "Positive, gentle energy",
      "Camera (optional - for adoptable pet photos!)"
    ],
    contact: {
      name: "Emma Rodriguez",
      role: "Shelter Manager",
      email: "emma@pawsandlove.org",
      phone: "+1 (555) 345-6789"
    },
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316d5e3b77%3A0x7b5e7d8c4a5b6c9d!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890123"
  },
  {
    id: "4",
    title: "Food Bank Sorting",
    organization: "Community Care",
    category: "Community",
    location: "Food Bank, 321 Hope Street, Westside",
    date: "Nov 22, 2025",
    duration: "3 hours",
    volunteers: 20,
    description: "Sort and organize food donations to help feed families in need. Light physical work in a friendly team environment.",
    fullDescription: "Community Care Food Bank distributes food to over 500 families each week. Volunteers are essential to our operation, helping sort, organize, and package food donations. This is teamwork at its best - you'll work alongside other volunteers in a friendly, supportive environment while making a tangible difference in fighting hunger in our community.",
    image: "/opportunities/foodbank.jpg",
    verified: true,
    featured: true,
    spotsLeft: 8,
    urgent: false,
    requirements: [
      "Ability to stand for extended periods",
      "Comfortable with light lifting (up to 25 lbs)",
      "Must be at least 14 years old",
      "Team player with positive attitude",
      "Punctuality and reliability"
    ],
    whatVolunteersDo: [
      "Sort donated food items by type and expiration date",
      "Check food quality and safety",
      "Organize items on warehouse shelves",
      "Package food into family portions",
      "Assemble meal boxes for distribution",
      "Maintain clean, organized work area"
    ],
    whoCanApply: [
      "Individuals and groups welcome",
      "Corporate volunteer teams",
      "Students (14+) with or without parents",
      "Families looking to volunteer together",
      "Anyone wanting to fight hunger"
    ],
    whatToBring: [
      "Comfortable, closed-toe shoes",
      "Clothing suitable for warehouse work",
      "Reusable water bottle",
      "Light jacket (warehouse can be cool)",
      "Hair net provided if needed",
      "Team spirit!"
    ],
    contact: {
      name: "David Martinez",
      role: "Volunteer Services Manager",
      email: "david@communitycare.org",
      phone: "+1 (555) 456-7890"
    },
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316d5e3b77%3A0x7b5e7d8c4a5b6c9d!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890123"
  },
  {
    id: "5",
    title: "Beach Cleanup Drive",
    organization: "Ocean Care",
    category: "Environment",
    location: "Sandy Beach, Ocean Drive, Beachfront",
    date: "Nov 28, 2025",
    duration: "5 hours",
    volunteers: 15,
    description: "Join us for a beach cleanup initiative to protect marine life and keep our coastlines beautiful.",
    fullDescription: "Ocean Care is organizing a comprehensive beach cleanup to protect our marine ecosystems. Every year, thousands of pounds of trash end up in our oceans, harming wildlife and polluting our beaches. Join us for a day of environmental action, meet like-minded people, and enjoy the beach while making it cleaner and safer for everyone.",
    image: "/opportunities/beach.jpg",
    verified: true,
    featured: false,
    spotsLeft: 12,
    urgent: false,
    requirements: [
      "Ability to walk on sand for extended periods",
      "Must be at least 12 years old (with adult supervision)",
      "Comfortable working outdoors in various weather",
      "Sun protection awareness",
      "Commitment to full cleanup session"
    ],
    whatVolunteersDo: [
      "Collect trash and recyclables from beach",
      "Sort collected items for proper disposal/recycling",
      "Document findings for environmental reports",
      "Help load bags into collection vehicles",
      "Spread awareness about ocean conservation",
      "Enjoy the beach responsibly!"
    ],
    whoCanApply: [
      "Families with children (12+ or supervised)",
      "Environmental activists and students",
      "Beach lovers and ocean enthusiasts",
      "Photography enthusiasts (before/after)",
      "Anyone passionate about clean oceans"
    ],
    whatToBring: [
      "Sunscreen and sun hat",
      "Reusable water bottle (very important!)",
      "Comfortable walking shoes or sandals",
      "Gloves (provided if you don't have)",
      "Snacks for energy",
      "Bag for personal items",
      "Camera to document impact"
    ],
    contact: {
      name: "Alex Thompson",
      role: "Environmental Coordinator",
      email: "alex@oceancare.org",
      phone: "+1 (555) 567-8901"
    },
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316d5e3b77%3A0x7b5e7d8c4a5b6c9d!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890123"
  },
  {
    id: "6",
    title: "Senior Care Companion",
    organization: "Golden Hearts",
    category: "Healthcare",
    location: "Senior Center, 555 Elder Avenue, Uptown",
    date: "Nov 18, 2025",
    duration: "2 hours",
    volunteers: 3,
    description: "Spend quality time with seniors, engage in conversations, play games, and bring joy to their day.",
    fullDescription: "Golden Hearts seeks compassionate volunteers to spend quality time with senior citizens. Many of our seniors live alone and cherish the opportunity to connect with friendly faces. You'll engage in meaningful conversations, play games, share stories, and simply provide companionship that brightens their day. This is one of the most rewarding volunteer experiences you can have.",
    image: "/opportunities/seniors.jpg",
    verified: true,
    featured: false,
    spotsLeft: 1,
    urgent: true,
    requirements: [
      "Patience, empathy, and good listening skills",
      "Must be at least 18 years old",
      "Background check required (we assist)",
      "Comfortable conversing with elderly",
      "Reliable and punctual"
    ],
    whatVolunteersDo: [
      "Engage in friendly conversation with seniors",
      "Play board games, cards, or puzzles",
      "Read books or newspapers aloud",
      "Share stories and listen to theirs",
      "Assist with light activities (if needed)",
      "Provide emotional support and companionship"
    ],
    whoCanApply: [
      "Adults 18+ with caring nature",
      "Retirees looking to give back",
      "Healthcare or social work students",
      "Anyone with elderly family experience",
      "Those seeking meaningful connections"
    ],
    whatToBring: [
      "Valid ID for facility check-in",
      "Friendly, patient attitude",
      "Book or magazine to share (optional)",
      "Board games (optional - we have some)",
      "Stories and good conversation",
      "Warm smile and open heart"
    ],
    contact: {
      name: "Patricia Wilson",
      role: "Senior Services Director",
      email: "patricia@goldenhearts.org",
      phone: "+1 (555) 678-9012"
    },
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316d5e3b77%3A0x7b5e7d8c4a5b6c9d!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890123"
  }
]

// Category colors
const categoryColors: { [key: string]: string } = {
  Environment: "from-green-400 to-green-600",
  Education: "from-blue-400 to-blue-600",
  Animals: "from-orange-400 to-orange-600",
  Community: "from-purple-400 to-purple-600",
  Healthcare: "from-red-400 to-red-600",
  Arts: "from-pink-400 to-pink-600"
}

export default function OpportunityDetailPage() {
  const params = useParams()
  const opportunityId = params.id as string
  
  // Find the opportunity by ID
  const opportunity = opportunitiesData.find(opp => opp.id === opportunityId)

  // If opportunity not found, show error
  if (!opportunity) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Opportunity Not Found</h1>
            <p className="text-foreground-light mb-8">The opportunity you're looking for doesn't exist.</p>
            <Link href="/opportunities">
              <Button>Browse All Opportunities</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section with Image */}
        <section className="relative h-80 md:h-96 bg-linear-to-br overflow-hidden">
          {opportunity.image && opportunity.image.startsWith('/opportunities/') ? (
            <Image
              src={opportunity.image}
              alt={opportunity.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className={`w-full h-full bg-linear-to-br ${categoryColors[opportunity.category]} flex items-center justify-center`}>
              <span className="text-9xl">
                {opportunity.category === "Environment" ? "🌱" : 
                 opportunity.category === "Education" ? "📚" :
                 opportunity.category === "Animals" ? "🐾" :
                 opportunity.category === "Community" ? "🤝" :
                 opportunity.category === "Healthcare" ? "⚕️" : "🎨"}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <Link href="/opportunities">
              <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Opportunities
              </Button>
            </Link>
          </div>

          {/* Badges */}
          <div className="absolute top-6 right-6 flex gap-2">
            {opportunity.featured && (
              <Badge className="bg-yellow-500 text-white border-0">⭐ Featured</Badge>
            )}
            {opportunity.urgent && (
              <Badge className="bg-red-500 text-white border-0 animate-pulse">
                <AlertCircle className="w-3 h-3 mr-1" />
                Urgent
              </Badge>
            )}
            {opportunity.verified && (
              <Badge className="bg-blue-500 text-white border-0">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <Badge className="mb-3">{opportunity.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{opportunity.title}</h1>
            <p className="text-xl text-gray-200">{opportunity.organization}</p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-foreground-light">Date</p>
                        <p className="font-semibold text-foreground">{opportunity.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-foreground-light">Duration</p>
                        <p className="font-semibold text-foreground">{opportunity.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-foreground-light">Interested</p>
                        <p className="font-semibold text-foreground">{opportunity.volunteers}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-foreground-light">Spots Left</p>
                        <p className="font-semibold text-orange-600">{opportunity.spotsLeft}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About This Opportunity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    About This Opportunity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-light leading-relaxed">{opportunity.fullDescription}</p>
                </CardContent>
              </Card>

              {/* What Volunteers Will Do */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    What You'll Do
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {opportunity.whatVolunteersDo.map((task, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-foreground-light">{task}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {opportunity.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                        <span className="text-foreground-light">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Who Can Apply */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Who Can Apply
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {opportunity.whoCanApply.map((who, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                        <span className="text-foreground-light">{who}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* What to Bring */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Backpack className="w-5 h-5 text-primary" />
                    What to Bring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {opportunity.whatToBring.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                        <span className="text-foreground-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Map/Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Location & Directions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-light mb-4">{opportunity.location}</p>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-200">
                    <iframe
                      src={opportunity.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Location Map"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Ready to Volunteer?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {opportunity.spotsLeft && opportunity.spotsLeft <= 5 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Only {opportunity.spotsLeft} spot{opportunity.spotsLeft !== 1 ? 's' : ''} remaining!
                      </p>
                    </div>
                  )}
                  
                  <Link href="/register?role=volunteer" className="w-full">
                    <Button size="lg" className="w-full">Apply Now</Button>
                  </Link>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold text-foreground">{opportunity.contact.name}</p>
                    <p className="text-sm text-foreground-light">{opportunity.contact.role}</p>
                  </div>
                  <div className="space-y-2">
                    <a href={`mailto:${opportunity.contact.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Mail className="w-4 h-4" />
                      {opportunity.contact.email}
                    </a>
                    <a href={`tel:${opportunity.contact.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Phone className="w-4 h-4" />
                      {opportunity.contact.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Organization Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About {opportunity.organization}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground-light mb-3">
                    A verified organization committed to making positive change in our community.
                  </p>
                  {opportunity.verified && (
                    <Badge className="bg-blue-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Organization
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
