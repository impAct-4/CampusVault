# CampusVault - Placement & Career Development Platform

![Status](https://img.shields.io/badge/status-active-success)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-blue)

## 📋 Table of Contents
- [Overview](#overview)
- [Project Architecture](#project-architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running Development Servers](#running-development-servers)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

CampusVault is a comprehensive placement and career development platform designed for college students. It connects students with mentors, tracks market analytics, provides company-specific interview preparation, and maintains a Q&A forum for peer-to-peer learning.

### Key Objectives
- Facilitate mentorship between students and industry professionals
- Provide real-time market analytics and salary data
- Enable targeted preparation for company-specific placements
- Create a community-driven Q&A platform
- Manage placement applications and track outcomes

## 🏗️ Project Architecture

### System Design Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (React + Vite)                  │
│                    Port: 5173 (Development)                 │
│  • Firebase Authentication                                  │
│  • UI Components (shadcn/ui + Tailwind CSS)                │
│  • Real-time Updates & Routing                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  SERVER (Express + TypeScript)              │
│                    Port: 5000 (Development)                 │
│  • RESTful API Endpoints                                   │
│  • Error Handling Middleware                               │
│  • Firebase Admin SDK Integration                          │
│  • LLM Integration (OpenAI)                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ ORM Layer
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                      │
│              Port: 5432 (Development)                       │
│  • User Management (Students & Mentors)                   │
│  • Placement Data & Applications                          │
│  • Mentorship Sessions                                     │
│  • Q&A Forum & Transactions                               │
└─────────────────────────────────────────────────────────────┘
```

### Application Flow

1. **Authentication**: Users sign up/login via Firebase
2. **Dashboard**: View personalized analytics and recommendations
3. **Market Analysis**: Explore company data and salary trends
4. **Mentorship**: Browse mentors and schedule sessions
5. **Company Prep**: Access targeted preparation resources
6. **Q&A Forum**: Ask questions and purchase answers
7. **Placement**: Apply to jobs and track applications

## ✨ Features

### 1. **User Management**
- Student profiles with academic details (CGPA, branch, college)
- Mentor profiles with expertise and verification
- Resume uploads and skill categorization
- Credit system for premium features

### 2. **Mentorship System**
- Browse and filter mentors by expertise
- Schedule mentorship sessions
- Session feedback and ratings
- Real-time notifications

### 3. **Market Analytics**
- Real-time company placement data
- Salary trends and package ranges
- Branch-wise placement analysis
- Skill demand forecasting using AI

### 4. **Company Preparation**
- Company-specific interview resources
- Mock preparation sessions
- Topic-based study materials
- Difficulty-level categorization

### 5. **Q&A Forum**
- Post questions about companies and interviews
- Monetized answer system (creator can charge credits)
- Credit-based access control
- Community-driven knowledge sharing

### 6. **Placement Management**
- Browse placement opportunities
- Track application status
- View company details and requirements
- Eligibility checking

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **Firebase** - Authentication & Authorization
- **Axios** - HTTP client
- **React Router v7** - Navigation
- **Sonner** - Toast notifications

### Backend
- **Node.js & Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM (PostgreSQL)
- **Firebase Admin SDK** - User management
- **PostgreSQL** - Primary database
- **OpenAI API** - AI/LLM integration

### Development Tools
- **ts-node** - TypeScript execution
- **Nodemon** - Development auto-reload
- **ESLint** - Code linting
- **Prisma CLI** - Database migrations

## 📋 Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **PostgreSQL**: v12 or higher
- **Git**: For version control

### Required Accounts
- **Firebase Console**: For authentication setup
- **OpenAI Account**: For LLM features (optional for testing)
- **PostgreSQL Database**: Local or cloud-based

## 🚀 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/campusvault.git
cd campusvault
```

### Step 2: Install Client Dependencies
```bash
cd client
npm install
cd ..
```

### Step 3: Install Server Dependencies
```bash
cd server
npm install
cd ..
```

### Step 4: Copy Environment Files
```bash
# Copy the example env file and update with your values
cp .env.example .env

# For development, also create local .env files
cp .env.example client/.env.local
cp .env.example server/.env
```

## ⚙️ Configuration

### 1. Firebase Setup

#### Firebase Console Configuration
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable "Authentication" → Sign-in method → Email/Password
4. Go to Project Settings → Service Accounts
5. Generate new private key (JSON format)

#### Client Configuration (Firebase SDK)
1. In Firebase Console, go to Project Settings
2. Copy the Web API credentials:
   ```json
   {
     "apiKey": "YOUR_API_KEY",
     "authDomain": "your-project.firebaseapp.com",
     "projectId": "your-project",
     "storageBucket": "your-project.appspot.com",
     "messagingSenderId": "SENDER_ID",
     "appId": "APP_ID"
   }
   ```

#### Server Configuration (Firebase Admin SDK)
1. Download the service account JSON from Firebase Console
2. Save as `server/firebase-admin-sdk.json`
3. Update `FIREBASE_ADMIN_SDK_PATH` in server `.env`

### 2. PostgreSQL Database Setup

#### Local PostgreSQL Installation

**Windows (using PostgreSQL installer):**
```bash
# Download and run installer from https://www.postgresql.org/download/windows/
# During installation:
# - Set port: 5432
# - Set password: (remember this)
# - Username: postgres
```

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql prompt:
CREATE DATABASE campusvault;
\c campusvault
\q
```

#### Update DATABASE_URL in `.env`
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/campusvault
```

### 3. OpenAI API Configuration (Optional)

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create API key in Account → API Keys
3. Add to server `.env`:
   ```
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-4-turbo-preview
   ```

### 4. Update Configuration Files

Create/update these files with your credentials:

**`client/.env.local`:**
```env
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000/api
```

**`server/.env`:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/campusvault
FIREBASE_ADMIN_SDK_PATH=./firebase-admin-sdk.json
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4-turbo-preview
```

## 📊 Database Setup

### Step 1: Generate Prisma Client
```bash
cd server
npm run prisma:generate
```

### Step 2: Push Database Schema
This creates all tables based on the Prisma schema:
```bash
npm run prisma:push
```

### Step 3: Create a Migration (for future schema changes)
```bash
# Create a named migration
npm run prisma:migrate -- init

# Or for specific changes:
npm run prisma:migrate -- add_new_feature
```

### Step 4: Verify Database Setup
```bash
# Open Prisma Studio to view/manage data
npm run prisma:studio
```

### Database Schema Overview

The Prisma schema includes:
- **Student**: User profile with academic info
- **Mentor**: Professional profiles with expertise
- **MentorshipSession**: Session bookings and feedback
- **Company**: Company information and metadata
- **Placement**: Job postings
- **PlacementApplication**: Student applications
- **MarketAnalytics**: Personalized market data
- **MarketData**: Company placement statistics
- **CompanyPrepResource**: Interview preparation materials
- **CompanyPrepSession**: Prep session records
- **Question**: Q&A forum posts
- **QuestionPurchase**: Transaction records

## 🏃 Running Development Servers

### Terminal 1: Start PostgreSQL (if not running as service)
```bash
# Windows (if not running as service):
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# macOS:
brew services start postgresql@15

# Linux:
sudo systemctl start postgresql
```

### Terminal 2: Start Backend Server
```bash
cd server
npm run dev
```

Expected output:
```
✓ TypeScript compilation successful
🚀 Server running on http://localhost:5000
📊 Database connected
🔐 Firebase Admin initialized
```

### Terminal 3: Start Frontend Development Server
```bash
cd client
npm run dev
```

Expected output:
```
  VITE v8.0.1  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Verify Everything is Working
1. Open http://localhost:5173 in your browser
2. You should see the CampusVault landing page
3. Test Firebase login (sign up a new account)
4. Check backend logs for API requests

## 🏗️ Building for Production

### Step 1: Build Frontend
```bash
cd client
npm run build:prod
```

This generates optimized files in `client/dist/`.

### Step 2: Build Backend
```bash
cd server
npm run build
```

This compiles TypeScript to JavaScript in `server/dist/`.

### Step 3: Set Production Environment Variables
Update `.env` files with production values:
```env
NODE_ENV=production
VITE_API_BASE_URL=https://api.yourdomain.com
DATABASE_URL=postgresql://prod_user:prod_password@prod-db.example.com:5432/campusvault
```

### Step 4: Deploy Frontend (Example: Vercel)
```bash
cd client
npm install -g vercel
vercel
```

### Step 5: Deploy Backend (Example: Render/Railway)
```bash
cd server
# Push to GitHub, then connect to Render/Railway
# Add environment variables in platform dashboard
npm run prisma:deploy  # Run migrations on production DB
npm run start
```

## 📁 Project Structure

```
campusvault/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── CompanyDetailsPage.tsx
│   │   │   ├── CompanyMatcher.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── QuestionForum.tsx
│   │   │   └── ...
│   │   ├── config/
│   │   │   └── firebase.ts         # Firebase initialization
│   │   ├── api/                    # API calls
│   │   │   ├── companyAPI.ts
│   │   │   └── questionAPI.ts
│   │   ├── utils/
│   │   │   ├── api.ts              # Axios instance
│   │   │   └── toastService.ts
│   │   ├── App.tsx                 # Main app component
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts   # JWT/Firebase verification
│   │   │   └── errorHandler.ts     # Global error handling
│   │   ├── routes/
│   │   │   ├── assessmentRoutes.ts
│   │   │   ├── companyRoutes.ts
│   │   │   ├── dashboardRoutes.ts
│   │   │   └── questionRoutes.ts
│   │   ├── utils/                  # Utility functions
│   │   └── index.ts                # Server entry point
│   ├── prisma/
│   │   └── schema.prisma           # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                        # Environment variables
│
├── .env.example                     # Environment template
├── README.md                        # This file
└── .gitignore
```

## 🔑 Environment Variables

### Client Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `campusvault-123` |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |

### Server Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@localhost/db` |
| `FIREBASE_ADMIN_SDK_PATH` | Path to service account JSON | `./firebase-admin-sdk.json` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |

See `.env.example` for complete variable list.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Company Endpoints
- `GET /api/companies` - List all companies
- `GET /api/companies/:id` - Get company details
- `POST /api/companies` - Create company (admin)

### Mentorship Endpoints
- `GET /api/mentors` - List mentors
- `POST /api/mentorship/sessions` - Book session
- `GET /api/mentorship/sessions/:id` - Get session details

### Question/Forum Endpoints
- `GET /api/questions` - List questions
- `POST /api/questions` - Create question
- `POST /api/questions/:id/purchase` - Purchase answer

### Dashboard Endpoints
- `GET /api/dashboard` - Get user dashboard data
- `GET /api/dashboard/analytics` - Get market analytics

For detailed API docs, see generated Swagger/OpenAPI documentation.

## 🔧 Troubleshooting

### Issue: Port 5000 Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: Database Connection Failed
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Verify DATABASE_URL in .env
# Test connection: psql <DATABASE_URL>
```

### Issue: Firebase Authentication Not Working
- Verify `VITE_FIREBASE_API_KEY` in client `.env`
- Check Firebase console for enabled auth methods
- Ensure CORS is configured on backend

### Issue: Prisma Migration Conflicts
```bash
# Reset database (warning: deletes all data)
npm run prisma:push -- --force-reset

# Or manually:
npm run prisma:migrate -- --name reset_db
```

### Issue: TypeScript Compilation Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 Development Workflow

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request
```

### Code Standards
- Use TypeScript for type safety
- Follow ESLint rules: `npm run lint`
- Run type check: `npm run type-check`
- Format code: `npm run format`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or suggestions:
- Open a GitHub Issue
- Create a Discussion
- Contact the development team

## 🎉 Acknowledgments

- Firebase for authentication
- Prisma for database ORM
- OpenAI for AI capabilities
- Community contributors

---

**Happy Coding! 🚀**

Last Updated: April 2, 2026
