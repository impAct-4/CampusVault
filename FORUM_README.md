# Question Forum Implementation Guide

## Overview

This is a complete implementation of a Q&A forum with a credit-based payment system. The system allows students to post questions and purchase answers from other students using credits, with secure SQL transactions ensuring data integrity.

## Features

### Backend Features
- ✅ **Protected Routes**: All question and purchase endpoints require Firebase authentication
- ✅ **SQL Transactions**: Credit transfers use Serializable isolation level for data integrity
- ✅ **Credit System**: 
  - Deduct credits from buyer
  - Add credits to author
  - All-or-nothing transaction (rollback on failure)
- ✅ **Validations**:
  - Verify buyer has enough credits
  - Check for duplicate purchases
  - Prevent authors from buying their own questions
  - Validate question data before creation

### Frontend Features
- ✅ **Blurred Answer Text**: Paid questions show blurred answers
- ✅ **Unlock Button**: One-click purchase to unlock answers
- ✅ **Real-time Updates**: Credit balance updates reflected immediately
- ✅ **Question Form**: Post free or paid questions
- ✅ **Filters**: Search by company and paid/free questions
- ✅ **Purchase Status**: Track which questions user has purchased
- ✅ **Responsive Design**: Works on desktop and mobile

## Database Schema

### Question Model
```prisma
model Question {
  id            String    @id @default(cuid())
  title         String
  company       String
  text          String
  isPaid        Boolean   @default(false)
  cost          Int?
  answer        String?
  authorId      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  author        Student   @relation("QuestionAuthor", fields: [authorId], references: [id], onDelete: Cascade)
  purchases     QuestionPurchase[]

  @@index([authorId])
  @@index([company])
  @@index([isPaid])
}
```

### QuestionPurchase Model (Transaction Record)
```prisma
model QuestionPurchase {
  id            String    @id @default(cuid())
  questionId    String
  buyerId       String
  amount        Int
  status        String    @default("completed")
  createdAt     DateTime  @default(now())

  question      Question  @relation(fields: [questionId], references: [id], onDelete: Cascade)
  buyer         Student   @relation("BuyerPurchases", fields: [buyerId], references: [id], onDelete: Cascade)

  @@unique([questionId, buyerId])
  @@index([questionId])
  @@index([buyerId])
}
```

### Student Model (Extended)
```prisma
model Student {
  // ...existing fields...
  creditBalance Int       @default(100)
  
  questions          Question[] @relation("QuestionAuthor")
  purchasedQuestions QuestionPurchase[] @relation("BuyerPurchases")
}
```

## API Endpoints

### Questions

#### POST `/api/questions` (Protected)
Create a new question
```json
{
  "title": "String",
  "company": "String",
  "text": "String",
  "isPaid": Boolean,
  "cost": Number (optional, required if isPaid=true)
}
```

#### GET `/api/questions`
Fetch all questions with optional filters
```
Query Parameters:
- company: String (filter by company)
- isPaid: Boolean (filter paid/free questions)
```

#### GET `/api/questions/:id`
Fetch a specific question by ID

#### POST `/api/questions/:id/purchase` (Protected)
**Transaction Endpoint** - Purchase an answer

Flow:
1. Verify question exists and is marked as paid
2. Prevent author from buying their own question
3. Check if user already purchased
4. Verify buyer has sufficient credits
5. Deduct cost from buyer's creditBalance
6. Add cost to author's creditBalance
7. Create QuestionPurchase record
8. Return answer text and updated credit balance

**Error Codes:**
- `402`: Insufficient credits
- `403`: Cannot purchase own question
- `404`: Question not found
- `409`: Already purchased

#### POST `/api/questions/:id/answer` (Protected)
Add an answer to a question (author only)
```json
{
  "answer": "String"
}
```

#### GET `/api/questions/:id/has-purchased` (Protected)
Check if current user has purchased a question
```json
{
  "hasPurchased": Boolean
}
```

## Backend Implementation Details

### Transaction Safety

The purchase endpoint uses **Prisma's transaction API** with **Serializable isolation level** to prevent:
- Race conditions during concurrent purchases
- Lost updates to credit balances
- Double spending

```typescript
const result = await prisma.$transaction(async (tx) => {
  // 1. Fetch question
  // 2. Verify payment conditions
  // 3. Update buyer credits (decrement)
  // 4. Update author credits (increment)
  // 5. Create purchase record
}, {
  isolationLevel: 'Serializable',
});
```

### Error Handling

All endpoints validate:
- Firebase token validity (auth middleware)
- Required fields presence
- Data type correctness
- Business logic constraints
- Sufficient credits for purchases

## Frontend Implementation

### Components

#### QuestionForum
Main component that orchestrates the entire forum experience
- Fetches and displays questions
- Manages purchase status for current user
- Handles form submission and purchase flow
- Manages filters and search

#### QuestionForm
Allows users to post new questions
- Title, company, description inputs
- Toggle for paid/free
- Dynamic cost input (shown only for paid)
- Form validation

#### QuestionCard
Displays a single question
- Shows question title, company, author
- Displays question text
- Conditionally blurs answer for paid questions
- Shows unlock button
- Displays purchase count
- Identifies question author

### State Management

The QuestionForum component manages:
- `questions`: List of all questions
- `purchasedQuestions`: Set of question IDs user has purchased
- `loading`: Loading state for fetches
- `error`: Error messages
- `successMessage`: Success notifications
- `isPurchasing`: Loading state for purchase operations

### Purchase Flow

```
User clicks "Unlock for X Credits"
  ↓
Frontend validates auth token
  ↓
POST /api/questions/:id/purchase with Bearer token
  ↓
Backend transaction:
  - Verify credits
  - Deduct from buyer
  - Add to author
  - Create record
  ↓
Frontend receives answer + updated balances
  ↓
UI updates: blur removed, success message shown
  ↓
User can now see answer
```

## Usage Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Firebase project set up

### Backend Setup

```bash
cd server
npm install

# Set up environment variables
# Create .env file with:
# DATABASE_URL=postgresql://...
# FIREBASE_PROJECT_ID=...
# FIREBASE_PRIVATE_KEY=...
# FIREBASE_CLIENT_EMAIL=...

# Run migrations
npx prisma migrate dev

# Start server
npm run dev
```

### Frontend Setup

```bash
cd client
npm install

# Create .env.local with:
# VITE_API_URL=http://localhost:5000/api
# VITE_FIREBASE_CONFIG=...

npm run dev
```

### Integration in App

```typescript
import QuestionForum from '@/components/QuestionForum';

// In your main app or page:
<QuestionForum 
  authToken={firebaseToken}
  currentUserId={userId}
/>
```

## Testing the System

### Test Scenario 1: Post Free Question
1. Click "Post a Question"
2. Fill title, company, description
3. Leave "Paid question" unchecked
4. Click "Post Question"
5. Question appears in list

### Test Scenario 2: Post Paid Question
1. Click "Post a Question"
2. Fill all fields
3. Check "Paid question"
4. Enter cost (e.g., 50 credits)
5. Click "Post Question"
6. Answer shows as blurred with unlock button

### Test Scenario 3: Purchase Answer
1. Find a paid question posted by another user
2. Click "Unlock for X Credits" button
3. System deducts credits from buyer
4. System adds credits to author
5. Answer becomes visible
6. Success message shows updated balance

### Test Scenario 4: Error Cases
- Try to purchase with insufficient credits → Error: "Insufficient credits"
- Try to purchase twice → Error: "Already purchased"
- Try to purchase own question → Error: "Cannot purchase own question"

## Security Considerations

1. **Authentication**: Firebase token required for all protected endpoints
2. **Authorization**: Only authors can add answers, only non-authors can purchase
3. **Transaction Isolation**: Serializable isolation prevents race conditions
4. **Credit Validation**: System verifies sufficient balance before deduction
5. **Data Integrity**: All-or-nothing transaction ensures consistency

## Performance Optimizations

1. **Database Indexes**: 
   - authorId, company, isPaid on questions
   - questionId, buyerId on purchases

2. **Query Optimization**:
   - Include only necessary fields in selects
   - Use indexes for filters

3. **Frontend Optimization**:
   - Lazy load questions
   - Cache purchase status
   - Debounce filter inputs

## Future Enhancements

- [ ] Pagination for large question lists
- [ ] Search functionality
- [ ] Rating/review system
- [ ] Question categories
- [ ] Admin moderation tools
- [ ] Analytics dashboard
- [ ] WebSocket for real-time updates
- [ ] Email notifications for new answers

## Troubleshooting

### "Unauthorized" Error
- Ensure Firebase token is valid
- Check Authorization header format: `Bearer <token>`

### "Insufficient credits" on Purchase
- Check student's creditBalance in database
- Ensure cost is less than available balance

### Transaction Failures
- Check database connection
- Verify Prisma is installed and updated
- Check PostgreSQL is running

### CORS Errors
- Verify CORS_ORIGIN matches frontend URL
- Check server is running on correct port

## File Structure

```
server/
├── src/
│   ├── routes/
│   │   └── questionRoutes.ts    ← All question endpoints
│   ├── middleware/
│   │   └── authMiddleware.ts    ← Firebase auth
│   └── index.ts                 ← Server entry
└── prisma/
    └── schema.prisma            ← Database schema

client/
├── src/
│   ├── components/
│   │   ├── QuestionForum.tsx    ← Main component
│   │   ├── QuestionForm.tsx     ← Form component
│   │   ├── QuestionCard.tsx     ← Card component
│   │   └── QuestionForum.css    ← Styles
│   ├── api/
│   │   └── questionAPI.ts       ← API utilities
│   └── App.tsx                  ← Main app
└── .env.local                   ← Environment variables
```

## Support

For issues or questions, refer to:
- Backend: Check server console logs
- Frontend: Check browser console
- Database: Check Prisma logs with `DEBUG=prisma:*`