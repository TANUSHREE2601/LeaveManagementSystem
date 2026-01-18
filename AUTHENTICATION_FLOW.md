# Authentication & Authorization Flow

## Overview

The system uses **JWT (JSON Web Tokens)** for authentication and **Role-Based Access Control (RBAC)** for authorization.

---

## 1. Authentication Flow

### 1.1 Signup Flow

```
┌─────────┐                    ┌──────────┐                    ┌─────────┐
│ Client  │                    │ Backend  │                    │ MongoDB │
└────┬────┘                    └────┬─────┘                    └────┬────┘
     │                              │                               │
     │ POST /api/auth/employee/     │                               │
     │ signup                       │                               │
     ├─────────────────────────────>│                               │
     │                              │                               │
     │                              │ Validate input                │
     │                              │ Check if email exists         │
     │                              ├──────────────────────────────>│
     │                              │<──────────────────────────────┤
     │                              │                               │
     │                              │ Hash password (bcrypt)        │
     │                              │ Create employee record        │
     │                              ├──────────────────────────────>│
     │                              │<──────────────────────────────┤
     │                              │                               │
     │                              │ Generate JWT token            │
     │                              │ (payload: {id, email, role})  │
     │                              │                               │
     │<─────────────────────────────┤                               │
     │ 201: {token, user}           │                               │
     │                              │                               │
     │ Store token in localStorage  │                               │
     │                              │                               │
```

**Steps:**
1. Client sends signup request with user details
2. Backend validates input (email format, password strength, required fields)
3. Backend checks if email already exists
4. Backend hashes password using bcrypt (10+ rounds)
5. Backend creates employee/employer record in MongoDB
6. Backend generates JWT token with payload: `{id, email, role}`
7. Client receives token and stores it in localStorage
8. Client redirects to dashboard based on role

---

### 1.2 Login Flow

```
┌─────────┐                    ┌──────────┐                    ┌─────────┐
│ Client  │                    │ Backend  │                    │ MongoDB │
└────┬────┘                    └────┬─────┘                    └────┬────┘
     │                              │                               │
     │ POST /api/auth/login         │                               │
     │ {email, password}            │                               │
     ├─────────────────────────────>│                               │
     │                              │                               │
     │                              │ Find user by email            │
     │                              ├──────────────────────────────>│
     │                              │<──────────────────────────────┤
     │                              │                               │
     │                              │ Compare password (bcrypt)     │
     │                              │                               │
     │                              │ Generate JWT token            │
     │                              │                               │
     │<─────────────────────────────┤                               │
     │ 200: {token, user}           │                               │
     │                              │                               │
     │ Store token in localStorage  │                               │
     │                              │                               │
```

**Steps:**
1. Client sends login request with email and password
2. Backend finds user by email
3. Backend compares provided password with hashed password using bcrypt
4. If passwords match, backend generates JWT token
5. Client receives token and stores it in localStorage
6. Client redirects to appropriate dashboard

---

### 1.3 Token Generation

**JWT Payload Structure:**
```javascript
{
  id: "user_id",          // User ObjectId
  email: "user@email.com", // User email
  role: "employee"        // "employee" or "employer"
}
```

**Token Configuration:**
```javascript
// Secret key stored in environment variables
JWT_SECRET = "your_super_secret_key_min_32_chars"

// Token expiration (recommended: 1 hour for access token)
JWT_EXPIRES_IN = "1h"

// Optional: Refresh token expiration (7 days)
REFRESH_TOKEN_EXPIRES_IN = "7d"
```

**Example Token Generation:**
```javascript
const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    role: user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
);
```

---

## 2. Authorization Flow

### 2.1 Protected Route Access

```
┌─────────┐                    ┌──────────┐                    ┌─────────┐
│ Client  │                    │ Backend  │                    │ MongoDB │
└────┬────┘                    └────┬─────┘                    └────┬────┘
     │                              │                               │
     │ GET /api/leaves/me           │                               │
     │ Authorization: Bearer <token>│                               │
     ├─────────────────────────────>│                               │
     │                              │                               │
     │                              │ Extract token from header     │
     │                              │ Verify JWT signature          │
     │                              │ Check token expiration        │
     │                              │                               │
     │                              │ Extract user info from token  │
     │                              │ (id, email, role)             │
     │                              │                               │
     │                              │ Query database for leaves     │
     │                              │ (using employee ID)           │
     │                              ├──────────────────────────────>│
     │                              │<──────────────────────────────┤
     │                              │                               │
     │<─────────────────────────────┤                               │
     │ 200: {leaves: [...]}         │                               │
     │                              │                               │
```

**Steps:**
1. Client includes JWT token in Authorization header
2. Backend middleware extracts token from header
3. Backend verifies token signature using JWT_SECRET
4. Backend checks token expiration
5. If valid, backend extracts user info (id, email, role) from token
6. Backend attaches user info to `req.user`
7. Route handler processes request with user context

---

### 2.2 Role-Based Access Control (RBAC)

**Middleware: `auth.middleware.js`**
```javascript
// Verifies JWT token and attaches user to request
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // {id, email, role}
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};
```

**Middleware: `role.middleware.js`**
```javascript
// Checks if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions' 
      });
    }

    next();
  };
};
```

**Usage in Routes:**
```javascript
// Employee-only route
router.get('/leaves/me', authenticate, authorize('employee'), getMyLeaves);

// Employer-only route
router.get('/employer/leaves', authenticate, authorize('employer'), getAllLeaves);

// Both roles can access
router.get('/auth/me', authenticate, getCurrentUser);
```

---

## 3. Token Storage Strategy

### 3.1 Client-Side Storage (Recommended for this project)

**Implementation:**
- Store JWT token in `localStorage`
- Send token in Authorization header for each API request
- Clear token on logout

**Pros:**
- Simple implementation
- Works across browser tabs
- Survives page refresh

**Cons:**
- Vulnerable to XSS attacks
- Must ensure proper input sanitization

**Code Example:**
```javascript
// Store token
localStorage.setItem('token', token);

// Retrieve token
const token = localStorage.getItem('token');

// Send with requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Clear on logout
localStorage.removeItem('token');
```

### 3.2 Alternative: HttpOnly Cookies (More Secure)

**Implementation:**
- Backend sets JWT in httpOnly cookie
- Cookie automatically sent with each request
- Not accessible via JavaScript (XSS protection)

**Pros:**
- More secure (XSS protection)
- Automatic cookie handling

**Cons:**
- More complex setup
- CSRF protection needed

---

## 4. Token Refresh Strategy (Optional Enhancement)

For production, consider implementing refresh tokens:

```
Access Token (short-lived: 1 hour)
├── Used for API requests
└── Stored in memory or localStorage

Refresh Token (long-lived: 7 days)
├── Used to get new access tokens
└── Stored in httpOnly cookie
```

**Flow:**
1. Login returns both access token and refresh token
2. Access token expires after 1 hour
3. Client uses refresh token to get new access token
4. Refresh token expires after 7 days, user must login again

---

## 5. Error Handling

### 5.1 Authentication Errors

**No Token:**
```json
{
  "success": false,
  "message": "Unauthorized. No token provided"
}
```
Status: `401`

**Invalid Token:**
```json
{
  "success": false,
  "message": "Unauthorized. Invalid token"
}
```
Status: `401`

**Expired Token:**
```json
{
  "success": false,
  "message": "Unauthorized. Token expired"
}
```
Status: `401`

### 5.2 Authorization Errors

**Insufficient Permissions:**
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions"
}
```
Status: `403`

---

## 6. Security Best Practices

1. **Password Hashing:**
   - Use bcrypt with 10+ rounds
   - Never store plain text passwords

2. **JWT Secret:**
   - Use strong, random secret (min 32 characters)
   - Store in environment variables
   - Never commit to version control

3. **Token Expiration:**
   - Keep access tokens short-lived (1 hour)
   - Implement refresh token mechanism for production

4. **HTTPS:**
   - Always use HTTPS in production
   - Prevents token interception

5. **Input Validation:**
   - Validate all inputs on both client and server
   - Sanitize user inputs to prevent XSS

6. **Rate Limiting:**
   - Implement rate limiting on auth endpoints
   - Prevent brute force attacks

7. **CORS:**
   - Configure CORS properly
   - Only allow trusted origins

---

## 7. Implementation Checklist

- [ ] Set up JWT secret in environment variables
- [ ] Implement password hashing (bcrypt)
- [ ] Create JWT token generation utility
- [ ] Create authentication middleware
- [ ] Create role-based authorization middleware
- [ ] Implement token extraction from headers
- [ ] Handle token expiration errors
- [ ] Implement logout (client-side token removal)
- [ ] Add rate limiting to auth endpoints
- [ ] Configure CORS for frontend domain
- [ ] Add input validation for auth routes
- [ ] Test token generation and verification
- [ ] Test role-based access control
