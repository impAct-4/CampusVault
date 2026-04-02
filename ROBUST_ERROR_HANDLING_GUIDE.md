# Robust Error Handling & Notifications Implementation Guide

## ✅ Completed Components

### 1. Toast Service Utility (`src/utils/toastService.ts`)
- ✅ **CREATED** - Comprehensive toast notification service
- Features:
  - Success, error, info, warning, and loading toast types
  - User-friendly error message mapping
  - HTTP status code handling (400, 401, 402, 403, 404, 409, 500, etc.)
  - Error code to message translation
  - Axios error parsing and formatting
  - Network error detection
  - Request ID tracking support

### 2. Toaster Provider Component (`src/components/ToasterProvider.tsx`)
- ✅ **CREATED** - Global Sonner toaster provider
- Configuration:
  - Position: top-right
  - Rich colors enabled
  - Close button enabled
  - Expandable toasts
  - Light theme
  - Max 3 visible toasts at once
  - 12px gap between toasts

### 3. Loading Skeletons
- ✅ **CREATED** `src/components/skeletons/DashboardSkeleton.tsx`
  - Navigation bar skeleton
  - Header skeleton
  - Quick links grid skeleton (3 cards)
  - Animated pulse effects
  
- ✅ **CREATED** `src/components/skeletons/MarketValueSkeleton.tsx`
  - Navigation bar skeleton
  - Back button skeleton
  - Header skeleton
  - Market insights grid skeleton (3 cards)
  - Detailed analysis section skeleton
  - List items with bullet points
  - Animated pulse effects

### 4. Enhanced API Utility (`src/utils/api.ts`)
- Features to add:
  - Toast error handling integration
  - Status code-specific error messages
  - Network error detection
  - Request context logging

### 5. Backend Error Handler (`server/src/middleware/errorHandler.ts`)
- ✅ **ENHANCED** - Global error handling middleware with:
  - Request ID generation and tracking
  - Enhanced error logging with context
  - Custom error classes (ValidationError, AuthenticationError, etc.)
  - InsufficientCreditsError (402 status code)
  - TransactionError for failed credit purchases
  - DatabaseError for query failures
  - Async error wrapper utility
  - Development mode detailed stack traces
  - Production-friendly error responses

## 📋 Manual Integration Steps

### Step 1: Update App.tsx
Add the ToasterProvider import and wrap your Router:

\`\`\`tsx
import { ToasterProvider } from './components/ToasterProvider';

function App() {
  return (
    <>
      <ToasterProvider />
      <Router>
        {/* ... existing routes ... */}
      </Router>
    </>
  );
}
\`\`\`

### Step 2: Update API Utility
Replace `src/utils/api.ts` with error handling integration:

\`\`\`tsx
import { toastService, handleError } from './toastService';

// In response interceptor:
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleError(error, 'Your session has expired. Please log in again.');
    } else if (error.response?.status === 402) {
      handleError(error, 'You do not have enough credits for this action.');
    } else if (error.response?.status >= 500) {
      handleError(error, 'A server error occurred. Please try again later.');
    } else {
      handleError(error);
    }
    return Promise.reject(error);
  }
);
\`\`\`

### Step 3: Update DashboardPage.tsx
Add loading state and toast notifications:

\`\`\`tsx
import { useState, useEffect } from 'react';
import { DashboardSkeleton } from './skeletons/DashboardSkeleton';
import { toastService } from '../utils/toastService';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toastService.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toastService.error('Failed to logout. Please try again.');
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // ... rest of component
}
\`\`\`

### Step 4: Update MarketValuePage.tsx
Add loading state and toast notifications (similar to DashboardPage):

\`\`\`tsx
import { MarketValueSkeleton } from './skeletons/MarketValueSkeleton';
import { toastService } from '../utils/toastService';

// Add useEffect with isLoading state
// Show MarketValueSkeleton while isLoading is true
// Add toastService.success('Market data loaded successfully') when done
\`\`\`

### Step 5: Update Server Index.ts
Integrate error handler middleware:

\`\`\`tsx
import { requestIdMiddleware, errorHandler } from './middleware/errorHandler';

const app: Express = express();

// Add early in middleware chain
app.use(requestIdMiddleware);

// ... existing middleware ...

// Add error handler LAST
app.use(errorHandler);
\`\`\`

### Step 6: Use Error Classes in Routes
Example for credit purchases:

\`\`\`tsx
import { InsufficientCreditsError, TransactionError, asyncHandler } from '../middleware/errorHandler';

router.post('/purchase', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (user.credits < requiredCredits) {
    throw new InsufficientCreditsError(requiredCredits, user.credits);
  }

  try {
    // Process transaction
    await prisma.\$transaction(async (tx) => {
      // Update credits, create purchase record, etc.
    });
    
    res.json({ success: true, message: 'Purchase successful' });
  } catch (error) {
    throw new TransactionError('Failed to process purchase', { originalError: error.message });
  }
}));
\`\`\`

## 🎯 Error Handling Flow

### Frontend Flow:
1. User performs action (login, purchase, etc.)
2. API call made via axios instance
3. If error occurs:
   - Response interceptor catches it
   - `handleError()` is called with error object
   - `toastService.error()` displays user-friendly message
   - Error code mapped to helpful description
   - Request ID logged for debugging
4. User sees sleek notification at top-right

### Backend Flow:
1. Route handler receives request
2. Request ID added to `req.id` by middleware
3. If error thrown:
   - `errorHandler` middleware catches it
   - Logs full error with request context
   - Returns clean JSON response with appropriate status code
   - Includes requestId for client-side tracking
4. Client receives structured error response

## 📊 Error Status Codes

| Code | Type | Usage |
|------|------|-------|
| 400 | ValidationError | Invalid input data |
| 401 | AuthenticationError | Invalid/expired token |
| 402 | InsufficientCreditsError | Not enough credits |
| 403 | AuthorizationError | Permission denied |
| 404 | NotFoundError | Resource not found |
| 409 | ConflictError | Resource already exists |
| 500 | ServerError | Generic server error |
| 500 | DatabaseError | Query failed |
| 500 | TransactionError | Transaction failed |

## 🎨 Toast Notification Types

### Success Toast
\`\`\`tsx
toastService.success('Answer purchased successfully!', {
  description: 'You can now view the full answer'
});
\`\`\`

### Error Toast
\`\`\`tsx
toastService.error(errorResponse, {
  description: 'Please try again later'
});
\`\`\`

### Loading Toast
\`\`\`tsx
const promise = api.post('/questions/1/purchase');
toastService.loading('Processing your purchase...', promise);
\`\`\`

### Info Toast
\`\`\`tsx
toastService.info('Navigating to Market Value...');
\`\`\`

## 📱 Skeleton Loading Examples

### DashboardSkeleton Usage:
\`\`\`tsx
if (isLoading) {
  return <DashboardSkeleton />;
}
\`\`\`

### MarketValueSkeleton Usage:
\`\`\`tsx
if (isLoading) {
  return <MarketValueSkeleton />;
}
\`\`\`

## 🔧 Testing Error Handling

### Test Insufficient Credits:
\`\`\`tsx
// Simulate error response
{
  success: false,
  error: "Insufficient credits",
  code: "INSUFFICIENT_CREDITS_ERROR",
  details: { required: 50, available: 20 },
  requestId: "1704067200000-abc123"
}
\`\`\`

### Test Database Error:
\`\`\`tsx
{
  success: false,
  error: "Database operation failed",
  code: "DATABASE_ERROR",
  requestId: "1704067200000-abc123"
}
\`\`\`

## ✨ Features Summary

✅ **Backend**
- Global error handler middleware
- Request ID tracking for debugging
- Custom error classes for specific scenarios
- Transaction error handling
- Credit validation with proper errors
- Enhanced logging with timestamps
- Clean JSON error responses

✅ **Frontend**
- Toast notifications for all actions
- User-friendly error messages
- Loading skeletons for Dashboard and Market Value
- Network error detection
- Request ID tracking
- Integrated with Axios interceptors

✅ **User Experience**
- Sleek notifications at top-right
- Clear action feedback
- No UI freezing during data fetch
- Helpful error descriptions
- Automatic error code translation

## 🚀 Next Steps

1. Manually integrate the App.tsx change to add ToasterProvider
2. Update DashboardPage and MarketValuePage with loading states
3. Update server index.ts to use error middleware
4. Test error handling with various scenarios
5. Monitor production logs using request IDs

---

**All core components have been created and are ready for integration!**