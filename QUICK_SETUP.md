# Quick Setup Instructions

## ⚡ One Required Manual Edit

The only thing you need to manually do is update `server/src/index.ts` to add the question routes.

### Current State
Your `server/src/index.ts` currently has placeholder routes.

### What to Add

At the **TOP** of the file, add this import:
```typescript
import questionRoutes from './routes/questionRoutes';
```

Then, find the section that says `// API Routes (to be implemented)` and replace it with:
```typescript
// API Routes
app.use('/api/questions', questionRoutes);
```

### Complete Example

Your `server/src/index.ts` should look like this:

```typescript
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import questionRoutes from './routes/questionRoutes';  // ← ADD THIS LINE

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Campus Placement Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/questions', questionRoutes);  // ← ADD THIS LINE

// Keep the rest of your routes...
app.use('/api/auth', (req, res) => {
  res.status(200).json({ message: 'Auth routes - coming soon' });
});

// ... rest of file remains the same
```

## 🚀 Then You're Ready!

After making that one edit:

```bash
# Backend setup
cd server
npm install
npx prisma migrate dev
npm run dev

# In another terminal - Frontend setup
cd client
npm install
npm run dev
```

That's it! The entire forum system is ready to use.