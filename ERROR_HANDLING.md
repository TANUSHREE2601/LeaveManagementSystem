# Error Handling & Environment Variables Documentation

## ✅ Implementation Summary

This document outlines the comprehensive error handling and environment variable management implemented in the Leave Management System.

---

## 🔐 Backend: Environment Variable Handling

### Location: `backend/src/config/env.js`

### Features:
- ✅ **Environment variable validation** before server startup
- ✅ **Required variables check** with clear error messages
- ✅ **Security warnings** for weak JWT secrets
- ✅ **URI format validation** for MongoDB connection
- ✅ **Centralized configuration** with default values

### Required Environment Variables:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT token signing (min 32 characters)

### Optional Environment Variables (with defaults):
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (default: development)
- `JWT_EXPIRES_IN` - JWT expiration time (default: 1h)
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiration (default: 7d)
- `CORS_ORIGIN` - Frontend URL for CORS (default: http://localhost:3000)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window (default: 900000ms = 15min)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

### Usage:
```javascript
// server.js
const { validateEnv, PORT, NODE_ENV } = require('./config/env');
validateEnv(); // Validates before server starts

// app.js
const { CORS_ORIGIN, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = require('./config/env');
```

---

## 🔧 Backend: Global Error Handling

### Location: `backend/src/middleware/errorHandler.middleware.js`

### HTTP Status Codes Used:

| Status | Code | Usage |
|--------|------|-------|
| **Bad Request** | 400 | Validation errors, invalid input |
| **Unauthorized** | 401 | Invalid/expired JWT tokens |
| **Forbidden** | 403 | Insufficient permissions |
| **Not Found** | 404 | Invalid resource IDs, missing resources |
| **Conflict** | 409 | Duplicate records (unique constraint violations) |
| **Too Many Requests** | 429 | Rate limiting |
| **Internal Server Error** | 500 | Unexpected server errors |
| **Service Unavailable** | 503 | Database connection failures |

### Error Types Handled:

1. **Mongoose CastError** (Invalid ObjectId)
   - Status: 404
   - Message: "Invalid resource ID format: {value}"

2. **Mongoose Duplicate Key** (Code 11000)
   - Status: 409 Conflict
   - Message: "{Field} already exists. Please use a different value."

3. **Mongoose ValidationError**
   - Status: 400 Bad Request
   - Message: "Validation Error: {errors}"
   - Includes errors array with field-specific messages

4. **JWT Errors**
   - `JsonWebTokenError`: Status 401 - "Invalid authentication token. Please log in again."
   - `TokenExpiredError`: Status 401 - "Your session has expired. Please log in again."

5. **MongoDB Connection Errors**
   - Status: 503 Service Unavailable
   - Message: "Database connection error. Please try again later."

6. **Rate Limiting**
   - Status: 429 Too Many Requests
   - Message: "Too many requests. Please try again later."

### Error Response Format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Validation error 1", "Validation error 2"], // Optional
  "stack": "...", // Only in development
  "error": "ErrorType" // Only in development
}
```

### Production Safety:
- Stack traces only shown in development
- Generic messages for 500 errors in production
- Detailed logging in development mode

---

## 🌐 Frontend: API Error Handling

### Location: `frontend/src/services/errorHandler.js`

### Features:
- ✅ **Centralized error handling** utility
- ✅ **Error type categorization** (network, authentication, validation, etc.)
- ✅ **Message extraction** from API responses
- ✅ **Validation error array handling**

### Error Types Categorized:

| Type | HTTP Status | Description |
|------|-------------|-------------|
| `network` | 0 | Network errors, no response |
| `authentication` | 401 | Authentication failures |
| `authorization` | 403 | Permission denied |
| `not_found` | 404 | Resource not found |
| `conflict` | 409 | Resource conflict |
| `validation` | 422 | Validation errors |
| `client_error` | 400-499 | Other client errors |
| `server_error` | 500+ | Server errors |

### Functions:

1. **`handleApiError(error)`**
   - Processes axios errors
   - Extracts error messages
   - Categorizes error types
   - Returns structured error object

2. **`formatErrorMessage(error)`**
   - Formats error for display
   - Returns user-friendly message

### Usage:
```javascript
import { handleApiError, formatErrorMessage } from '../services/errorHandler';

try {
  await api.post('/endpoint', data);
} catch (error) {
  const message = formatErrorMessage(error); // "User-friendly message"
  toast.error(message);
}
```

---

## 🔑 Frontend: Token Expiration Handling

### Location: `frontend/src/services/api.js`

### Features:
- ✅ **Automatic token detection** from localStorage
- ✅ **Token attachment** to all requests via interceptor
- ✅ **401 response handling** for expired/invalid tokens
- ✅ **Automatic cleanup** of auth data
- ✅ **Smart redirect** to login with return URL
- ✅ **Prevents redirect loops** on login/signup pages
- ✅ **30-second timeout** for requests

### Flow:

1. **Request Interceptor:**
   - Reads token from localStorage
   - Attaches to Authorization header: `Bearer {token}`

2. **Response Interceptor:**
   - Detects 401 (Unauthorized) responses
   - Clears token and user from localStorage
   - Redirects to login with return URL
   - Skips redirect if already on login/signup

3. **Error Enhancement:**
   - Adds `handledError` property to error object
   - Includes structured error information

### Example:
```javascript
// Automatic handling in interceptors
// On 401 response:
// 1. Clear auth: localStorage.removeItem('token')
// 2. Redirect: window.location.href = '/login?redirect=/dashboard'
```

---

## 📋 Environment Variable Files

### Backend `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_min_32_chars
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Implementation Checklist

### Backend:
- [x] Environment variable validation
- [x] Centralized env config
- [x] Global error middleware
- [x] Meaningful HTTP status codes
- [x] Error response formatting
- [x] Production-safe error handling
- [x] Development vs production logging

### Frontend:
- [x] Centralized error handling utility
- [x] API error interceptor
- [x] Token expiration detection
- [x] Automatic auth cleanup
- [x] Smart login redirect
- [x] Error type categorization
- [x] User-friendly error messages

---

## 🚀 Best Practices Implemented

1. **Centralized Error Handling**: Single source of truth for error processing
2. **Meaningful Status Codes**: Proper HTTP semantics
3. **User-Friendly Messages**: Clear, actionable error messages
4. **Security**: No sensitive data leaked in errors
5. **Environment Validation**: Fails fast with clear errors
6. **Token Management**: Automatic cleanup and redirect
7. **Error Categorization**: Type-based error handling
8. **Production Safety**: Generic messages in production

---

## 📝 Notes

- All environment variables are validated before server startup
- Error middleware is the last middleware in the chain
- Frontend error handler is used consistently across all API calls
- Token expiration is handled automatically without user action required
- Error messages are user-friendly and actionable
