# PlacementOS — Full-Stack Campus Placement Platform
## Master Claude Prompt (Copy this exactly)

---

## PROJECT OVERVIEW

Build a complete, production-ready full-stack web application called **PlacementOS** — a campus placement preparation platform for engineering college students. The platform acts as a combined Glassdoor + LeetCode + AI Career Coach tailored for campus placements.

---

## DESIGN SYSTEM & UI AESTHETIC

### Visual Direction: "Aether Flow" — Dark Cosmic Minimalism
- **Theme**: Deep dark backgrounds (near-black `#050508`, `#0a0a12`) with luminous accent glows
- **Primary Accent**: Electric indigo/violet (`#6366f1` → `#818cf8`)
- **Secondary Accent**: Cyan/teal glow (`#06b6d4`, `#22d3ee`)
- **Text**: Crisp white `#f8fafc` for headings, `#94a3b8` for body
- **Surfaces**: Glass morphism cards — `backdrop-filter: blur(20px)`, `background: rgba(255,255,255,0.03)`, `border: 1px solid rgba(255,255,255,0.08)`
- **Fonts**: `Sora` (headings, display), `DM Sans` (body), `JetBrains Mono` (code/stats)
- **Motion**: Subtle particle/orb background animations, smooth staggered page-load reveals, hover glow lifts on cards
- **Backgrounds**: Animated radial gradient orbs that slowly drift — one violet, one cyan — creating depth without noise
- **Micro-interactions**: Button hover → glow pulse; Card hover → border brightens + slight Y lift; Input focus → inner glow ring

### Apply this aesthetic consistently across ALL pages:
- Floating nav with frosted glass effect
- Animated gradient hero sections per page
- Glowing stat counters / metric cards
- Consistent border-radius: `16px` for cards, `12px` for inputs, `8px` for tags
- Section dividers: subtle horizontal gradient lines

---

## TECH STACK

### Frontend
- **React 18** + **TypeScript**
- **Vite** as build tool
- **Tailwind CSS** (with custom design tokens)
- **Framer Motion** for animations
- **React Router v6** for routing
- **React Hook Form** + **Zod** for forms
- **TanStack Query** for data fetching
- **Recharts** for data visualizations on dashboard
- **shadcn/ui** as component base (heavily restyled to match Aether aesthetic)
- **Lucide React** for icons

### Backend
- **Node.js** + **Express.js** (TypeScript)
- **PostgreSQL** with **Prisma ORM**
- **Redis** for session caching and credit transaction queuing
- **JWT** (access + refresh token pattern) for auth
- **Multer** + **Cloudinary** for resume/image uploads
- **OpenAI API** (GPT-4o) for AI Market Value Analyzer and assessment question generation
- **GitHub API** for repo analysis
- **Socket.io** for real-time mentorship booking notifications

### Infrastructure
- **Docker** + **Docker Compose** for local dev
- **Environment**: `.env` files with full variable documentation

---

## DATABASE SCHEMA (Prisma)

```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  passwordHash    String
  name            String
  phone           String?
  avatarUrl       String?
  credits         Int      @default(100)
  tier            Tier     @default(BEGINNER)
  gpa             Float?
  course          String?
  branch          String?
  year            Int?
  college         String?
  linkedinUrl     String?
  githubUrl       String?
  leetcodeUrl     String?
  targetRoles     String[]
  languages       String[]
  strongConcepts  String[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  projects        Project[]
  certifications  Certification[]
  assessments     Assessment[]
  answers         Answer[]
  mentorSessions  MentorSession[] @relation("mentee")
  hostedSessions  MentorSession[] @relation("mentor")
  creditTxns      CreditTransaction[]
  resume          Resume?
}

enum Tier {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  PLACEMENT_READY
}

model Project {
  id          String   @id @default(cuid())
  userId      String
  title       String
  description String
  techStack   String[]
  repoUrl     String?
  liveUrl     String?
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

model Certification {
  id        String   @id @default(cuid())
  userId    String
  name      String
  issuer    String
  url       String?
  issuedAt  DateTime?
  user      User     @relation(fields: [userId], references: [id])
}

model Assessment {
  id          String   @id @default(cuid())
  userId      String
  score       Int
  totalQ      Int
  topics      String[]
  tier        Tier
  takenAt     DateTime @default(now())
  answers     Json
  user        User     @relation(fields: [userId], references: [id])
}

model Company {
  id              String   @id @default(cuid())
  name            String
  logoUrl         String?
  minGpa          Float?
  eligibleBranches String[]
  roles           String[]
  requiredSkills  String[]
  placementDate   DateTime?
  package         String?
  description     String?
  questions       Question[]
}

model Question {
  id          String   @id @default(cuid())
  companyId   String
  postedById  String
  content     String
  round       String   // "Technical", "HR", "System Design", etc.
  year        Int
  isPremium   Boolean  @default(false)
  creditsToUnlock Int  @default(0)
  answers     Answer[]
  company     Company  @relation(fields: [companyId], references: [id])
}

model Answer {
  id          String   @id @default(cuid())
  questionId  String
  userId      String
  content     String
  isPremium   Boolean  @default(false)
  creditsEarned Int    @default(0)
  upvotes     Int      @default(0)
  question    Question @relation(fields: [questionId], references: [id])
  user        User     @relation(fields: [userId], references: [id])
}

model MentorSession {
  id          String   @id @default(cuid())
  menteeId    String
  mentorId    String
  scheduledAt DateTime
  durationMin Int      @default(30)
  creditsUsed Int      @default(0)
  isFree      Boolean  @default(false)
  status      SessionStatus @default(PENDING)
  meetLink    String?
  mentee      User     @relation("mentee", fields: [menteeId], references: [id])
  mentor      User     @relation("mentor", fields: [mentorId], references: [id])
}

enum SessionStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}

model CreditTransaction {
  id        String   @id @default(cuid())
  userId    String
  amount    Int      // positive = earned, negative = spent
  reason    String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model Resume {
  id          String   @id @default(cuid())
  userId      String   @unique
  fileUrl     String
  analysisJson Json?
  salaryEst   String?
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## PAGES & FEATURES (Build All)

### 1. LANDING PAGE (`/`)
**Hero Section:**
- Full-screen with animated floating orb background (violet + cyan)
- Headline: `"Your Placement. Engineered."` in large Sora font
- Sub-headline: `"AI-powered prep, senior insights, and real market value — all in one platform."`
- Two CTAs: `[Get Started Free]` (primary glow button) + `[Watch Demo]` (ghost button)
- Animated stat row: `2,400+ Students` · `180+ Companies` · `₹18 LPA Avg Package`

**Features Grid (Bento Layout):**
- 6 cards in an asymmetric bento grid layout showing: Skill Assessment, Company Q&A, AI Salary Estimator, 1-on-1 Mentorship, Credit System, Eligibility Matcher
- Each card has icon + title + 2-line desc + a subtle animated border on hover

**Social Proof:**
- Scrolling marquee of company logos (TCS, Infosys, Google, Microsoft, etc.)
- 3 testimonial cards from "placed seniors" with photo, name, company, package

**Footer:**
- Minimal dark footer with logo, links, social icons

---

### 2. REGISTRATION — MULTI-STEP FORM (`/register`)
**Step 1 — Personal Details:**
- Full Name, Email, Password, Phone, College Name, Profile Photo upload
- Progress indicator at top (Step 1 of 4)

**Step 2 — Academic Info:**
- Course (B.Tech / B.E. / MCA / etc.), Branch (CS / IT / ECE / etc.), Year (1/2/3/4)
- GPA/CGPA input, Expected Graduation Year

**Step 3 — Skills & Target Roles:**
- Checkbox grid: Target Roles (SWE, Data Analyst, DevOps, ML Engineer, Frontend Dev, etc.)
- Checkbox grid: Programming Languages (Python, Java, C++, JavaScript, Go, etc.)
- Checkbox grid: Strong Concepts (DSA, DBMS, OS, CN, System Design, ML, etc.)
- Work Experience toggle → if yes: company name, role, duration

**Step 4 — Portfolio & Projects:**
- GitHub URL, LinkedIn URL, LeetCode URL, Certifications (add multiple)
- Add Projects section: Title, Description, Tech Stack tags, Repo URL, Live URL
- On submit → auto-redirect to take Initial Assessment

Each step should animate in/out with Framer Motion slide transitions. Form state persists across steps.

---

### 3. INITIAL SKILL ASSESSMENT (`/assessment`)
- Generates 15 MCQ questions via OpenAI API based on the user's selected `strongConcepts`
- Timer: 20 minutes countdown (shown as shrinking circular arc)
- One question at a time with previous/next navigation
- Questions have 4 options, user selects one
- On submit → calculate score → determine Tier → save to DB → redirect to Dashboard

**Tier Logic:**
- 0-4 correct → BEGINNER
- 5-9 → INTERMEDIATE
- 10-12 → ADVANCED
- 13-15 → PLACEMENT_READY

---

### 4. MAIN DASHBOARD (`/dashboard`)
**Left Sidebar:**
- User avatar, name, tier badge (color-coded: red/orange/blue/green)
- Credit balance with coin icon
- Navigation links to all sections

**Top Stats Row (Animated Counters):**
- Current Tier · Credits Balance · Assessment Score · Eligible Companies Count

**Eligibility Matcher Panel:**
- Auto-queries companies where `minGpa <= user.gpa` AND `eligibleBranches includes user.branch`
- Shows as a filtered list of company cards with name, logo, package, date, required skills

**Roadmap Widget:**
- Based on tier + selected roles, shows a visual step-by-step roadmap
- E.g., for INTERMEDIATE targeting SWE: "Complete 150 LeetCode" → "Build 2 full-stack projects" → "Apply to mock interviews"

**Activity Feed:**
- Recent credit transactions, answers posted, sessions booked

---

### 5. COMPANY DIRECTORY (`/companies`)
- Search + filter bar: by branch, GPA, package range, date
- Grid of Company Cards: logo, name, package, roles, placement date, required skills
- Clicking a company → Company Detail Page (`/companies/:id`)

**Company Detail Page:**
- Overview tab: description, eligibility criteria, required skills, process rounds
- Interview Q&A tab: list of questions from seniors, filterable by round
- Each question shows: content, round label, year, answer count
- Locked premium answers show a blurred preview with "Unlock for X credits" button
- Preparation tab: curated resources, most-asked topics

---

### 6. INTERVIEW Q&A FORUM (`/forum`)
- All companies' questions aggregated
- Filter by: Company, Round, Year, Topic
- Users can post new questions (costs 0 credits)
- Users can post answers (earn 10 credits per answer)
- Premium Answer: mark answer as premium → set unlock cost (10-50 credits)
- Upvote system for answers

---

### 7. MENTORSHIP (`/mentorship`)
**Browse Mentors:**
- Grid of placed seniors who opted in as mentors
- Card: photo, name, company, role, package, topics they help with
- Filter by: company, role, availability

**Booking Flow:**
- Select mentor → view available slots → choose slot → choose: Free session or Credit-based
- Confirmation page with Google Meet link (mocked or real via Google Calendar API)
- Notifications via Socket.io toast when mentor confirms

**My Sessions:**
- Upcoming and past sessions with status badges

---

### 8. AI MARKET VALUE ANALYZER (`/analyzer`)
**Input Section:**
- Upload Resume (PDF) 
- Auto-pulls: GitHub URL, LinkedIn URL, Certifications from profile
- "Analyze Now" button

**Results Section (3 cards):**
1. **Profile Score Card**: Radar chart (Recharts) showing scores across: Projects, Skills, DSA, Communication, Experience
2. **Salary Estimator Card**: Big number display of estimated package range (e.g., `₹8 - 14 LPA`) with breakdown by company tier
3. **Skill Gap Roadmap**: List of gaps with priority labels (Critical / Important / Nice-to-have)

**Deep-Dive (Premium — costs 50 credits):**
- Detailed analysis per company the user is targeting
- Specific resume bullet point rewrites
- Suggested certifications and projects to add

---

### 9. PROFILE PAGE (`/profile`)
- Edit all info from registration
- Add/remove projects, certifications
- Credit history table
- Assessment history with retake option (costs 20 credits after first attempt)

---

## API ROUTES (Express)

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/me

GET    /api/users/:id
PUT    /api/users/:id
POST   /api/users/:id/avatar

POST   /api/assessment/generate   → calls OpenAI, returns questions
POST   /api/assessment/submit     → scores, saves, updates tier

GET    /api/companies
GET    /api/companies/:id
GET    /api/companies/:id/questions

GET    /api/questions
POST   /api/questions
GET    /api/questions/:id/answers
POST   /api/questions/:id/answers
POST   /api/answers/:id/unlock    → deduct credits, return content
POST   /api/answers/:id/upvote

GET    /api/mentors
GET    /api/mentors/:id/slots
POST   /api/sessions/book
GET    /api/sessions/my

POST   /api/analyzer/run          → OpenAI analysis of resume+profile
POST   /api/analyzer/deep-dive    → costs 50 credits

GET    /api/credits/history
POST   /api/credits/award         → internal use
```

---

## CREDIT SYSTEM RULES

| Action | Credit Change |
|--------|--------------|
| Registration (welcome bonus) | +100 |
| Posting an answer | +10 |
| Answer gets 10 upvotes | +5 bonus |
| Unlock a premium answer | -10 to -50 (set by author) |
| Book a credit-based mentor session | -30 to -100 |
| Retake assessment | -20 |
| Deep-Dive AI analysis | -50 |

All transactions logged in `CreditTransaction` table with reason string.

---

## OPENAI INTEGRATION

### Assessment Question Generation
```javascript
// System prompt
"You are an expert technical interviewer for campus placements. Generate exactly 15 multiple-choice questions for a student preparing for software engineering roles. Topics: {topics}. Each question must have exactly 4 options (A, B, C, D) with one correct answer. Return ONLY valid JSON array."

// Response format
[{ "question": "...", "options": ["A)...", "B)...", "C)...", "D)..."], "correct": "A", "topic": "..." }]
```

### AI Market Value Analyzer
```javascript
// System prompt
"You are a career strategist specializing in Indian campus placements. Analyze the following student profile and provide: 1) A score (0-100) for each category: DSA, Projects, Skills, Communication potential, Experience. 2) An estimated salary range for Indian tech companies. 3) Top 5 specific gaps to address. 4) A 3-month action plan. Return ONLY valid JSON."

// Input includes: resume text, github repos, certifications, skills, gpa, projects, targetRoles
```

---

## COMPONENT LIBRARY (Build these reusable components)

```
components/
  ui/
    GlowButton.tsx         → primary action button with shimmer
    GlassCard.tsx          → frosted glass card container
    TierBadge.tsx          → colored badge for BEGINNER/INTERMEDIATE/etc.
    CreditChip.tsx         → coin icon + balance
    ProgressRing.tsx       → circular progress / timer
    StatCard.tsx           → animated counter card
    CompanyCard.tsx        → company listing card
    QuestionCard.tsx       → forum question card
    MentorCard.tsx         → mentor profile card
    SkillTag.tsx           → pill tag for skills
    StepIndicator.tsx      → multi-step form progress
    OrbBackground.tsx      → animated floating gradient orbs
    GlowInput.tsx          → styled input with focus glow
    RadarChart.tsx         → Recharts radar for profile scores
  layout/
    Navbar.tsx             → frosted glass floating nav
    Sidebar.tsx            → dashboard sidebar
    PageWrapper.tsx        → page with orb background + fade-in
```

---

## ANIMATIONS & MOTION SPEC

```typescript
// Page enter animation (apply to every page)
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

// Staggered children
const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } }
}

// Card hover
const cardHover = {
  y: -4,
  boxShadow: "0 0 30px rgba(99, 102, 241, 0.15)",
  borderColor: "rgba(99, 102, 241, 0.4)"
}

// Orb background (CSS keyframes)
@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
```

---

## FOLDER STRUCTURE

```
placementos/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Assessment.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Companies.tsx
│   │   │   ├── CompanyDetail.tsx
│   │   │   ├── Forum.tsx
│   │   │   ├── Mentorship.tsx
│   │   │   ├── Analyzer.tsx
│   │   │   └── Profile.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/          → Zustand for auth + credits
│   │   ├── api/            → TanStack Query hooks
│   │   └── lib/            → utils, zod schemas
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/       → openai.ts, github.ts, credits.ts
│   │   └── prisma/
├── docker-compose.yml
└── README.md
```

---

## IMPLEMENTATION INSTRUCTIONS FOR CLAUDE

1. **Start with the design system**: Create `tailwind.config.ts` with custom tokens, CSS variables for the Aether color palette, and global styles first.

2. **Build reusable components before pages**: Implement all components in the UI library section before building full pages.

3. **OrbBackground component is mandatory on every page** — it's the signature visual element.

4. **The Navbar** must be sticky, frosted glass, with logo + nav links + credits chip + avatar menu. Collapse to hamburger on mobile.

5. **Landing page must be pixel-perfect**: The hero needs the animated orbs, staggered text reveal, and the bento grid features section.

6. **Assessment uses a streaming OpenAI call** with a loading skeleton while questions generate.

7. **Credit transactions must be atomic** — use a DB transaction to deduct credits + create the unlock record simultaneously.

8. **All forms use React Hook Form + Zod** — never use uncontrolled inputs.

9. **Error states, loading states, and empty states** must be designed — never leave a blank screen.

10. **Mobile-first responsive design** — dashboard sidebar collapses to bottom nav on mobile.

11. **Seed the database** with: 20 realistic companies, 100 sample questions, 5 mentor profiles, sample assessment data.

12. **Add a demo mode** — a "Try Demo" button on landing that logs in with a pre-seeded demo account so anyone can explore without registering.

---

## ENVIRONMENT VARIABLES NEEDED

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
OPENAI_API_KEY=...
GITHUB_TOKEN=...
CLOUDINARY_URL=...
CLIENT_URL=http://localhost:5173
PORT=3001
```

---

## WHAT SUCCESS LOOKS LIKE

When complete, PlacementOS should feel like a premium SaaS product — not a student project. The dark cosmic UI, smooth animations, and thoughtful feature design should make a student feel like they're using a tool built specifically to get them placed. Every interaction should feel fast, polished, and purposeful.
