# VolunteerConnect - Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [User Flows](#user-flows)
6. [Frontend Integration Points](#frontend-integration-points)
7. [Authentication & Security](#authentication--security)
8. [Deployment & Scaling](#deployment--scaling)

---

## 🎯 Project Overview

### Vision
VolunteerConnect is a full-stack web platform that bridges volunteers with NGOs/non-profits, enabling meaningful volunteer opportunities and community engagement.

### Core Features
- **For Volunteers**: Browse missions, apply for opportunities, track hours, manage profile, view impact metrics
- **For NGOs**: Create and manage missions, review volunteer applications, track volunteers, manage teams
- **For Admins**: Moderate content, verify organizations, view platform analytics

### Tech Stack
- **Frontend**: Next.js 15.2.4 (App Router), React 19, TypeScript, Tailwind CSS 4.1.9, shadcn/ui
- **Backend**: Node.js with Next.js API routes (or separate backend)
- **Database**: PostgreSQL (recommended) or MongoDB
- **Auth**: Email/Password with JWT or OAuth (Google/GitHub)
- **Hosting**: Vercel (frontend) + AWS/Railway/Vercel (backend)

### Target Users
- **Primary**: Volunteers (18-65), NGOs, Non-profits, Community organizations
- **Secondary**: Admins, System moderators

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                        │
│  ├─ Pages: Homepage, About, Opportunities, Dashboard            │
│  ├─ Forms: Register, Login, Create Mission, Apply               │
│  └─ Components: Navbar, Dashboard Layout, Cards, Validation     │
└──────────────┬──────────────────────────────────────────────────┘
               │ HTTPS / REST API
               │
┌──────────────▼──────────────────────────────────────────────────┐
│                   API Layer (Next.js Routes)                    │
│  ├─ /api/auth/*          - Authentication                       │
│  ├─ /api/users/*         - User management                      │
│  ├─ /api/missions/*      - Mission CRUD                         │
│  ├─ /api/applications/*  - Volunteer applications               │
│  └─ /api/admin/*         - Admin operations                     │
└──────────────┬──────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────────┐
│                      Database Layer                             │
│  ├─ PostgreSQL or MongoDB                                       │
│  ├─ Tables/Collections for entities (see schema below)          │
│  └─ Indexes on frequently queried fields                        │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Registration Flow**
   - User fills form (Frontend) → Validates (Client + Server) → Stores in DB → Sends verification email

2. **Mission Browsing Flow**
   - Frontend requests opportunities → API queries DB → Returns filtered results → Frontend displays

3. **Application Flow**
   - Volunteer applies → Store application in DB → NGO receives notification → NGO reviews → Status updated

---

## 🗄️ Database Schema

### Entity-Relationship Diagram

```
┌──────────────────┐         ┌──────────────────┐
│     User         │◄───────►│      Profile     │
│ (Volunteer/NGO)  │    1:1   │  (Extended Info) │
└──────────────────┘         └──────────────────┘
        │                            │
        │ creates                    │
        │                            │
┌───────▼──────────────┐    ┌─────────────────────┐
│   Organization       │    │  VolunteerProfile   │
│  (NGO Account)       │    │  (Hours, Skills)    │
└─────────────────────┘    └─────────────────────┘
        │
        │ creates
        │
┌───────▼──────────────────┐
│      Mission             │
│  (Volunteering Opportunity)
└─────────────────┬────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        │ receives          │
        │                   │
┌───────▼────────────┐  ┌────▼──────────────┐
│   Application      │  │  MissionCategory  │
│  (Volunteer Apply) │  │  (Tags/Categories)│
└────────────────────┘  └───────────────────┘
```

### Table/Collection Definitions

#### 1. **User** (Core Authentication)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('volunteer', 'ngo', 'admin') NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  organizationName VARCHAR(255), -- For NGO users
  phone VARCHAR(20),
  location VARCHAR(255),
  profileImage URL,
  emailVerified BOOLEAN DEFAULT FALSE,
  verificationToken VARCHAR(255),
  passwordResetToken VARCHAR(255),
  passwordResetExpires TIMESTAMP,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_createdAt (createdAt)
);
```

#### 2. **VolunteerProfile** (Volunteer-Specific Data)
```sql
CREATE TABLE volunteer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  skills JSON, -- ["Teaching", "Gardening", "First Aid"]
  interests JSON, -- ["Education", "Environment", "Healthcare"]
  availability JSON, -- { "monday": true, "hours": "weekends" }
  totalHoursVolunteered INT DEFAULT 0,
  missionsCompleted INT DEFAULT 0,
  impactScore INT DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(userId),
  INDEX idx_userId (userId),
  INDEX idx_verified (verified),
  INDEX idx_impactScore (impactScore DESC)
);
```

#### 3. **Organization** (NGO Account Info)
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
  organizationName VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  website URL,
  phone VARCHAR(20),
  email VARCHAR(255),
  location VARCHAR(255),
  registrationNumber VARCHAR(100) UNIQUE,
  taxId VARCHAR(100),
  logo URL,
  bannerImage URL,
  socialMedia JSON, -- { "twitter": "url", "facebook": "url" }
  verified BOOLEAN DEFAULT FALSE,
  verificationDate TIMESTAMP,
  memberCount INT DEFAULT 1,
  missionsPosted INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(userId),
  INDEX idx_userId (userId),
  INDEX idx_verified (verified),
  INDEX idx_location (location)
);
```

#### 4. **Mission** (Volunteering Opportunity)
```sql
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizationId UUID FOREIGN KEY REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  shortDescription VARCHAR(500),
  category VARCHAR(100), -- "Education", "Environment", "Healthcare"
  requiredSkills JSON, -- ["Teaching", "Patience"]
  whatYouWillDo TEXT,
  whoCanApply TEXT,
  whatToBring JSON,
  location VARCHAR(255),
  startDate DATE NOT NULL,
  endDate DATE,
  startTime TIME,
  endTime TIME,
  durationHours INT,
  maxVolunteers INT,
  currentVolunteers INT DEFAULT 0,
  status ENUM('draft', 'active', 'completed', 'cancelled') DEFAULT 'active',
  image URL,
  difficultyLevel ENUM('easy', 'intermediate', 'advanced') DEFAULT 'easy',
  views INT DEFAULT 0,
  applicationsCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  publishedAt TIMESTAMP,
  INDEX idx_organizationId (organizationId),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_location (location),
  INDEX idx_startDate (startDate),
  FULLTEXT idx_search (title, description)
);
```

#### 5. **Application** (Volunteer Application)
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteerId UUID FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
  missionId UUID FOREIGN KEY REFERENCES missions(id) ON DELETE CASCADE,
  status ENUM('pending', 'accepted', 'rejected', 'withdrawn', 'completed') DEFAULT 'pending',
  hoursCompleted INT DEFAULT 0,
  coverLetter TEXT,
  appliedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  respondedAt TIMESTAMP,
  respondedBy UUID FOREIGN KEY REFERENCES users(id),
  completedAt TIMESTAMP,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  INDEX idx_volunteerId (volunteerId),
  INDEX idx_missionId (missionId),
  INDEX idx_status (status),
  INDEX idx_appliedAt (appliedAt),
  UNIQUE(volunteerId, missionId) -- Prevent duplicate applications
);
```

#### 6. **MissionCategory** (Mission Tags/Categories)
```sql
CREATE TABLE mission_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon URL,
  color VARCHAR(7), -- Hex color code
  missionCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);
```

#### 7. **Notification** (Real-time Alerts)
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
  type ENUM('application_received', 'application_accepted', 'mission_update', 'message') NOT NULL,
  title VARCHAR(255),
  message TEXT,
  relatedEntityId UUID,
  relatedEntityType VARCHAR(50),
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_isRead (isRead),
  INDEX idx_createdAt (createdAt DESC)
);
```

#### 8. **Review & Rating** (Feedback)
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewerId UUID FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
  targetUserId UUID FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
  applicationId UUID FOREIGN KEY REFERENCES applications(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_targetUserId (targetUserId),
  INDEX idx_reviewerId (reviewerId)
);
```

#### 9. **VolunteerHours** (Audit Trail)
```sql
CREATE TABLE volunteer_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteerId UUID FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
  missionId UUID FOREIGN KEY REFERENCES missions(id) ON DELETE CASCADE,
  applicationId UUID FOREIGN KEY REFERENCES applications(id),
  hoursLogged INT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  verifiedBy UUID FOREIGN KEY REFERENCES users(id),
  verifiedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_volunteerId (volunteerId),
  INDEX idx_missionId (missionId),
  INDEX idx_date (date)
);
```

#### 10. **Message** (Volunteer-NGO Communication)
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senderId UUID FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
  recipientId UUID FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  content TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  readAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_senderId (senderId),
  INDEX idx_recipientId (recipientId),
  INDEX idx_isRead (isRead)
);
```

---

## 🔌 API Endpoints

### Authentication Endpoints

```http
POST /api/auth/register
  Body: { email, password, role, firstName, lastName, phone }
  Response: { id, email, role, token }

POST /api/auth/login
  Body: { email, password }
  Response: { id, email, role, token, refreshToken }

POST /api/auth/refresh
  Body: { refreshToken }
  Response: { token }

POST /api/auth/logout
  Response: { success }

POST /api/auth/verify-email
  Body: { token }
  Response: { success }

POST /api/auth/forgot-password
  Body: { email }
  Response: { success, message }

POST /api/auth/reset-password
  Body: { token, newPassword }
  Response: { success }
```

### User Endpoints

```http
GET /api/users/me
  Response: { id, email, role, profile, organization }

PUT /api/users/me
  Body: { firstName, lastName, phone, bio, interests }
  Response: { success, user }

GET /api/users/:id/profile
  Response: { user, profile }

GET /api/users/:id/missions
  Response: { missions[] }

GET /api/users/:id/reviews
  Response: { reviews[] }

DELETE /api/users/me
  Response: { success }
```

### Mission Endpoints

```http
GET /api/missions
  Query: { page, limit, category, location, search, status }
  Response: { missions[], total, pages }

GET /api/missions/:id
  Response: { mission, organization, applicationsCount }

POST /api/missions
  Auth: Required (NGO)
  Body: { title, description, category, startDate, location, maxVolunteers }
  Response: { mission }

PUT /api/missions/:id
  Auth: Required (NGO owner)
  Body: { title, description, status }
  Response: { mission }

DELETE /api/missions/:id
  Auth: Required (NGO owner)
  Response: { success }

GET /api/missions/:id/applications
  Auth: Required (NGO owner)
  Response: { applications[] }

GET /api/missions/:id/volunteers
  Auth: Required (NGO owner)
  Response: { volunteers[] }
```

### Application Endpoints

```http
POST /api/missions/:id/apply
  Auth: Required (Volunteer)
  Body: { coverLetter }
  Response: { application }

GET /api/applications/:id
  Response: { application, mission, volunteer }

PUT /api/applications/:id
  Auth: Required (NGO owner)
  Body: { status }
  Response: { application }

DELETE /api/applications/:id
  Auth: Required (Volunteer)
  Response: { success }

GET /api/volunteers/:id/applications
  Auth: Required (Volunteer)
  Response: { applications[] }
```

### Organization Endpoints

```http
GET /api/organizations/:id
  Response: { organization, stats }

PUT /api/organizations/:id
  Auth: Required (NGO owner)
  Body: { organizationName, description, website, logo }
  Response: { organization }

GET /api/organizations/:id/missions
  Response: { missions[] }

GET /api/organizations/:id/stats
  Auth: Required (NGO owner)
  Response: { volunteersCount, hoursLogged, missionsCompleted }
```

### Notification Endpoints

```http
GET /api/notifications
  Auth: Required
  Response: { notifications[] }

PUT /api/notifications/:id/read
  Auth: Required
  Response: { notification }

DELETE /api/notifications/:id
  Auth: Required
  Response: { success }
```

### Search Endpoints

```http
GET /api/search
  Query: { q, filters, sort }
  Response: { missions[], organizations[], volunteers[] }

GET /api/suggestions
  Query: { q, type }
  Response: { suggestions[] }
```

---

## 👥 User Flows

### 1. Volunteer Registration & Profile Setup

```
1. Visit /register?role=volunteer
2. Fill form (name, email, password, phone)
   - Frontend validates in real-time
   - Server validates on submit
3. Email verification sent
4. Redirect to /dashboard/volunteer?setup=true
5. Complete profile:
   - Bio, skills, interests, availability
   - Upload profile picture
6. Browse missions from /dashboard/volunteer/missions
7. Apply to mission with cover letter
   - Application stored in DB
   - NGO receives notification
8. NGO responds (accept/reject)
9. If accepted: volunteer starts mission
10. Log hours at end → /dashboard/volunteer/applications?id=...
11. NGO verifies hours
12. Application marked complete → volunteer sees hours on profile
```

### 2. NGO Registration & Mission Creation

```
1. Visit /register?role=ngo
2. Fill form (org name, email, password, phone, website, description)
   - Validate org name (letters + numbers only, 2+ chars)
   - Validate website URL format
   - Description min 20 chars
3. Email verification
4. Redirect to /dashboard/ngo?setup=true
5. Complete org profile:
   - Logo, banner image, description, social media
6. Create mission from /dashboard/ngo/create-mission:
   - Title, description, category
   - Date range, max volunteers
   - Required skills, difficulty level
   - Status: draft → active (once published)
7. NGO sees applications from volunteers
8. Review & accept/reject applications
9. Track volunteer progress & hours
10. Complete mission → mark as completed
11. Rate & review volunteers
```

### 3. Mission Discovery & Application

```
1. Visitor browses /opportunities
   - See featured missions (carousel)
   - Search, filter by category/location
   - Sort by newest/soonest/popular
2. Click mission → /opportunities/[id]
   - See full details, organization info
   - "Apply now" button
3. If not logged in → redirect to /login or /register?role=volunteer
4. If logged in → click apply
5. Fill cover letter + submit
6. Application sent to DB
7. Volunteer redirected to /dashboard/volunteer/applications
   - See "Pending" status
8. NGO notified (notification + email)
9. NGO reviews → accept/reject
10. Volunteer sees status update
```

### 4. Admin Dashboard (Future)

```
1. Admin logs in to /admin/dashboard
2. Approve/reject organizations (KYC)
3. Monitor platform metrics:
   - Active users, missions, hours logged
   - Revenue (if applicable)
4. Moderate content (remove inappropriate missions)
5. Generate reports (CSV export)
```

---

## 🔗 Frontend Integration Points

### Key Pages That Need Backend Integration

#### 1. **Registration Pages** (`app/register/page.tsx`)
- **Current**: Mock data, simulated API calls
- **Needed**:
  ```tsx
  const handleSubmit = async (e) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, ... })
    });
    const { token, user } = await response.json();
    localStorage.setItem('token', token);
    router.push(`/dashboard/${role}`);
  }
  ```

#### 2. **Opportunities Listing** (`app/opportunities/page.tsx`)
- **Current**: Static mock data
- **Needed**:
  ```tsx
  useEffect(() => {
    const fetchMissions = async () => {
      const res = await fetch(`/api/missions?category=${category}&search=${search}`);
      const { missions } = await res.json();
      setMissions(missions);
    };
    fetchMissions();
  }, [category, search]);
  ```

#### 3. **Opportunity Detail** (`app/opportunities/[id]/page.tsx`)
- **Current**: Mock mission data
- **Needed**:
  ```tsx
  useEffect(() => {
    const fetchMission = async () => {
      const res = await fetch(`/api/missions/${id}`);
      const mission = await res.json();
      setMission(mission);
    };
    fetchMission();
  }, [id]);
  ```

#### 4. **Dashboard Pages**
- **Volunteer Dashboard**: Fetch `GET /api/users/me`, `GET /api/applications`
- **NGO Dashboard**: Fetch `GET /api/organizations/:id/stats`, `GET /api/missions`

#### 5. **Contact Form** (`app/contact/page.tsx`)
- **Current**: Simulated 2-second delay
- **Needed**: `POST /api/contact` → Save to database or email service

---

## 🔐 Authentication & Security

### Implementation Strategy

#### Option 1: Next.js API Routes + JWT (Simple)
```
1. User registers → POST /api/auth/register
2. Server hashes password with bcrypt
3. Store user in DB
4. Generate JWT token (expires in 1 hour)
5. Return token to frontend
6. Frontend stores in localStorage or cookie
7. For authenticated requests, include `Authorization: Bearer <token>`
8. Middleware verifies JWT on protected routes
```

#### Option 2: Supabase Auth (Recommended for MVP)
```
- Supabase handles auth, password reset, email verification
- Frontend uses @supabase/auth-helpers-nextjs
- Real-time database (PostgreSQL)
- Built-in RLS (Row Level Security) for data isolation
- Example: Only volunteer can see their own applications
```

### JWT Token Structure
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "volunteer",
  "iat": 1701432000,
  "exp": 1701435600
}
```

### Security Checklist
- [ ] Hash passwords with bcrypt (min 10 rounds)
- [ ] Never store plain passwords
- [ ] Use HTTPS for all API calls
- [ ] Implement rate limiting on /api/auth/login (max 5 attempts/5min)
- [ ] Add CSRF protection (Next.js middleware)
- [ ] Validate & sanitize all inputs server-side
- [ ] Use environment variables for secrets (not in git)
- [ ] Implement CORS if backend is separate domain
- [ ] Add email verification before account activation
- [ ] Implement password reset (token expires in 30 min)
- [ ] Use secure cookies (HttpOnly, Secure, SameSite)

---

## 🚀 Deployment & Scaling

### Development Environment
```bash
# .env.local
DATABASE_URL=postgresql://user:pass@localhost:5432/volunteerconnect
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Production Environment
```
Database: AWS RDS PostgreSQL (highly available)
Backend: Vercel serverless functions or Railway
Frontend: Vercel (auto-deploys from main branch)
CDN: Cloudflare
Object Storage: AWS S3 (for mission images, profiles)
Email Service: SendGrid or Mailgun
Analytics: Plausible or GA4
Error Monitoring: Sentry
```

### Database Migrations
```bash
# Using Prisma (recommended)
npx prisma migrate dev --name initial_schema
npx prisma migrate deploy # Production

# Or raw SQL with version control
sql/001_create_users_table.sql
sql/002_create_missions_table.sql
```

### Performance Optimizations
- [ ] Add database indexes on frequently queried fields (done in schema above)
- [ ] Cache mission listings (Redis or Next.js cache)
- [ ] Paginate API responses (default 20 per page)
- [ ] Use CDN for static assets
- [ ] Compress images before storing in S3
- [ ] Add query timeouts (30 sec max)
- [ ] Monitor slow queries and optimize
- [ ] Use connection pooling for database

### Scaling Strategy
- **Phase 1** (MVP): All in Vercel, shared PostgreSQL
- **Phase 2** (10k users): Separate backend service, database replicas
- **Phase 3** (100k users): Microservices, message queue (Bull/RabbitMQ), read replicas
- **Phase 4** (1M users): Sharding, dedicated infrastructure

---

## 📝 Implementation Roadmap

### Week 1-2: Backend Setup & Database
- [ ] Set up PostgreSQL on Railway or AWS RDS
- [ ] Create database schema (SQL scripts)
- [ ] Set up Next.js API routes
- [ ] Implement authentication endpoints (/api/auth/*)
- [ ] Add JWT middleware

### Week 3-4: Core API
- [ ] Implement mission endpoints (/api/missions/*)
- [ ] Implement user endpoints (/api/users/*)
- [ ] Implement application endpoints (/api/applications/*)
- [ ] Add input validation with Zod
- [ ] Add error handling & logging

### Week 5-6: Frontend Integration
- [ ] Wire registration to backend
- [ ] Wire mission listing to backend
- [ ] Wire dashboard to backend
- [ ] Add loading states & error handling
- [ ] Implement token refresh logic

### Week 7-8: Testing & Polish
- [ ] Write API tests (Jest)
- [ ] Write E2E tests (Playwright)
- [ ] Security audit
- [ ] Performance testing
- [ ] Deploy to production

---

## 📚 Quick Reference: Key Files to Create/Modify

### Backend Files to Create
```
/api
  /auth
    - register.ts
    - login.ts
    - refresh.ts
    - verify-email.ts
  /missions
    - index.ts (GET, POST)
    - [id].ts (GET, PUT, DELETE)
    - [id]/applications.ts
  /users
    - me.ts
    - [id]/profile.ts
  /applications
    - index.ts
    - [id].ts
  /notifications
    - index.ts
    - [id].ts

/lib
  - db.ts (database connection)
  - auth.ts (JWT utilities)
  - validation.ts (Zod schemas)
  - errors.ts (custom errors)

/middleware
  - auth.ts (JWT verification)

/types
  - index.ts (TypeScript interfaces)
```

### Frontend Files to Update
```
/app
  /register/page.tsx → Call /api/auth/register
  /opportunities/page.tsx → Call /api/missions
  /opportunities/[id]/page.tsx → Call /api/missions/[id]
  /dashboard/volunteer/page.tsx → Call /api/users/me
  /dashboard/ngo/page.tsx → Call /api/organizations/[id]/stats

/hooks
  - useAuth.ts (login, logout, user state)
  - useMissions.ts (fetch missions with caching)
  - useApplications.ts (manage applications)

/utils
  - api.ts (fetch wrapper with auth header)
```

---

## 🎓 Summary

This documentation provides:
1. **Database Schema**: 10 tables covering all entities (users, missions, applications, etc.)
2. **API Contracts**: Detailed endpoints for frontend integration
3. **User Flows**: Step-by-step flows for all major features
4. **Security Guidelines**: Best practices for auth, data protection
5. **Deployment Guide**: Production setup and scaling strategy
6. **Implementation Roadmap**: 8-week plan to build the backend

### Next Steps for Backend Development
1. Choose tech stack (Prisma + PostgreSQL recommended)
2. Set up PostgreSQL database
3. Create schema using the SQL above
4. Build auth API endpoints
5. Implement middleware for JWT verification
6. Build CRUD endpoints for missions/applications
7. Add input validation & error handling
8. Test thoroughly before frontend integration

Good luck with the backend! Feel free to reference this doc as you build. 🚀
