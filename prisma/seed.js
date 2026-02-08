import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create NGO users with profiles
  const ngo1Password = await bcrypt.hash('password123', 10);
  const ngo1 = await prisma.user.upsert({
    where: { email: 'greenearth@ngo.com' },
    update: {},
    create: {
      email: 'greenearth@ngo.com',
      password: ngo1Password,
      role: 'NGO',
      isVerified: true,
      ngoProfile: {
        create: {
          organizationName: 'Green Earth Initiative',
          email: 'greenearth@ngo.com',
          location: 'San Francisco, CA',
          description: 'Leading environmental conservation efforts in California',
          registrationNumber: 'NGO-2023-001',
          isVerified: true,
          focusAreas: ['Environment', 'Conservation', 'Education'],
          achievements: ['Planted 50,000 trees', 'Cleaned 100+ beaches']
        }
      }
    }
  });

  const ngo2Password = await bcrypt.hash('password123', 10);
  const ngo2 = await prisma.user.upsert({
    where: { email: 'helpinghands@ngo.com' },
    update: {},
    create: {
      email: 'helpinghands@ngo.com',
      password: ngo2Password,
      role: 'NGO',
      isVerified: true,
      ngoProfile: {
        create: {
          organizationName: 'Helping Hands Foundation',
          email: 'helpinghands@ngo.com',
          location: 'Los Angeles, CA',
          description: 'Supporting communities through education and social services',
          registrationNumber: 'NGO-2023-002',
          isVerified: true,
          focusAreas: ['Community', 'Education', 'Healthcare'],
          achievements: ['Served 10,000+ families', 'Built 5 community centers']
        }
      }
    }
  });

  console.log('✅ NGO users created');

  // Create sample missions
  const missions = [
    {
      creatorId: ngo1.id,
      title: 'Beach Cleanup Drive',
      description: 'Join us for a coastal cleanup event. Help remove plastic and debris from our beautiful beaches. All materials provided. Great for families and groups!',
      category: 'Environment',
      location: 'Santa Monica Beach, CA',
      address: '1550 Pacific Coast Highway, Santa Monica, CA 90401',
      date: new Date('2026-02-15T09:00:00Z'),
      startTime: '09:00 AM',
      endTime: '01:00 PM',
      duration: 4,
      volunteersNeeded: 25,
      volunteersAccepted: 0,
      status: 'ACTIVE',
      requirements: 'Comfortable shoes, sunscreen, water bottle. Gloves and bags will be provided.',
      benefits: 'Community service hours, free lunch, event t-shirt',
      tags: ['cleanup', 'beach', 'ocean', 'environment'],
      isFeatured: true
    },
    {
      creatorId: ngo1.id,
      title: 'Tree Planting in City Park',
      description: 'Help us plant 100 trees in Downtown City Park. Learn about native species and sustainable urban forestry. Perfect for nature enthusiasts!',
      category: 'Environment',
      location: 'Downtown City Park, San Francisco',
      address: 'Market Street & 8th St, San Francisco, CA',
      date: new Date('2026-02-20T08:00:00Z'),
      startTime: '08:00 AM',
      endTime: '12:00 PM',
      duration: 4,
      volunteersNeeded: 30,
      volunteersAccepted: 0,
      status: 'ACTIVE',
      requirements: 'Work gloves, sturdy shoes, weather-appropriate clothing',
      benefits: 'Refreshments, certificate of participation, tree adoption certificate',
      tags: ['planting', 'trees', 'nature', 'green'],
      isFeatured: true
    },
    {
      creatorId: ngo2.id,
      title: 'Food Bank Sorting & Distribution',
      description: 'Assist with organizing and distributing food to families in need. Sort donations, pack boxes, and help with community distribution.',
      category: 'Community',
      location: 'LA Food Bank, Los Angeles',
      address: '1734 E 41st St, Los Angeles, CA 90058',
      date: new Date('2026-02-18T10:00:00Z'),
      startTime: '10:00 AM',
      endTime: '02:00 PM',
      duration: 4,
      volunteersNeeded: 20,
      volunteersAccepted: 0,
      status: 'ACTIVE',
      requirements: 'Ability to lift 20+ lbs, closed-toe shoes',
      benefits: 'Free lunch, volunteer certificate, transportation reimbursement',
      tags: ['food', 'community', 'charity', 'helping'],
      isFeatured: false
    },
    {
      creatorId: ngo2.id,
      title: 'After-School Tutoring Program',
      description: 'Mentor and tutor elementary students in math and reading. Make a lasting impact on young minds. Training provided for all volunteers.',
      category: 'Education',
      location: 'Lincoln Elementary School, LA',
      address: '1234 Education Ave, Los Angeles, CA',
      date: new Date('2026-02-22T15:00:00Z'),
      startTime: '03:00 PM',
      endTime: '05:00 PM',
      duration: 2,
      volunteersNeeded: 15,
      volunteersAccepted: 0,
      status: 'ACTIVE',
      requirements: 'Background check required, patience with children, basic math/reading skills',
      benefits: 'Training materials, volunteer hours certificate, ongoing program opportunity',
      tags: ['education', 'tutoring', 'children', 'teaching'],
      isFeatured: false
    },
    {
      creatorId: ngo2.id,
      title: 'Senior Center Companion Program',
      description: 'Spend quality time with seniors through conversation, games, and activities. Bring joy and companionship to our elderly community members.',
      category: 'Healthcare',
      location: 'Sunshine Senior Center, LA',
      address: '5678 Elder Street, Los Angeles, CA',
      date: new Date('2026-02-25T13:00:00Z'),
      startTime: '01:00 PM',
      endTime: '04:00 PM',
      duration: 3,
      volunteersNeeded: 10,
      volunteersAccepted: 0,
      status: 'ACTIVE',
      requirements: 'Good communication skills, patience, respect for elderly',
      benefits: 'Snacks provided, heartwarming experience, ongoing volunteer opportunity',
      tags: ['seniors', 'healthcare', 'companionship', 'elderly'],
      isFeatured: false
    },
    {
      creatorId: ngo1.id,
      title: 'Community Garden Workshop',
      description: 'Learn urban farming techniques and help maintain our community garden. Grow vegetables for local food banks while learning sustainable agriculture.',
      category: 'Community',
      location: 'Urban Roots Garden, SF',
      address: 'Mission District, San Francisco, CA',
      date: new Date('2026-03-01T10:00:00Z'),
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      duration: 3,
      volunteersNeeded: 12,
      volunteersAccepted: 0,
      status: 'ACTIVE',
      requirements: 'Gardening gloves, sun protection, willingness to get dirty',
      benefits: 'Free organic produce, gardening skills training, community connections',
      tags: ['gardening', 'urban farming', 'community', 'food'],
      isFeatured: false
    }
  ];

  for (const missionData of missions) {
    await prisma.mission.create({ data: missionData });
  }

  console.log('✅ Sample missions created');

  // Create a sample volunteer (optional - for testing applications)
  const volunteerPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'demo@volunteer.com' },
    update: {},
    create: {
      email: 'demo@volunteer.com',
      password: volunteerPassword,
      role: 'VOLUNTEER',
      isVerified: true,
      volunteerProfile: {
        create: {
          firstName: 'Demo',
          lastName: 'Volunteer',
          location: 'San Francisco, CA',
          bio: 'Passionate about making a difference in my community!',
          interests: ['Environment', 'Community', 'Education'],
          skills: ['Teamwork', 'Communication', 'Problem Solving'],
          totalHours: 0,
          impactScore: 0
        }
      }
    }
  });

  console.log('✅ Demo volunteer created');
  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Test Accounts:');
  console.log('   NGO 1: greenearth@ngo.com / password123');
  console.log('   NGO 2: helpinghands@ngo.com / password123');
  console.log('   Volunteer: demo@volunteer.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
