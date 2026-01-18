# Leave Management System - Architecture Design

## 1. High-Level System Design

### 1.1 System Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │──────│   Express   │──────│  MongoDB    │
│  Frontend   │      │   Backend   │      │   Atlas     │
│  (AWS S3)   │      │   (EC2)     │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
       │                    │                    │
       │                    │                    │
   JWT Token           JWT Middleware      Mongoose ODM
   (localStorage)      (Authentication)
```

### 1.2 Architecture Components

#### Frontend Layer (React + Tailwind CSS)
- **Purpose**: User interface for both Employee and Employer
- **Deployment**: AWS S3 + CloudFront
- **State Management**: React Context API / Redux (for scalability)
- **Routing**: React Router v6
- **HTTP Client**: Axios

#### Backend Layer (Node.js + Express)
- **Purpose**: RESTful API server
- **Deployment**: AWS EC2 with Docker
- **Framework**: Express.js
- **Validation**: Joi / express-validator
- **Security**: Helmet, CORS, rate limiting

#### Database Layer (MongoDB Atlas)
- **Purpose**: Persistent data storage
- **ODM**: Mongoose
- **Collections**: employees, employers, leaves

#### Authentication Layer (JWT)
- **Token Type**: Bearer Token
- **Storage**: Frontend localStorage / httpOnly cookies (optional)
- **Refresh Strategy**: Access token + Refresh token (recommended)

### 1.3 Data Flow

1. **User Registration/Login**:
   ```
   Client → POST /api/auth/signup → Backend → MongoDB → JWT Token → Client
   ```

2. **Leave Request Flow**:
   ```
   Employee → POST /api/leaves → Backend (validate JWT) → MongoDB → Response
   ```

3. **Leave Approval Flow**:
   ```
   Employer → PATCH /api/leaves/:id/approve → Backend (validate role) → MongoDB → Notification
   ```

### 1.4 Security Considerations

- JWT tokens with expiration
- Password hashing (bcrypt, 10+ rounds)
- Role-based access control (RBAC)
- CORS configuration
- Input validation and sanitization
- Rate limiting on auth endpoints
- HTTPS in production

### 1.5 Scalability Considerations

- Stateless backend architecture
- Database indexing on frequently queried fields
- Environment-based configuration
- Docker containerization for easy scaling
- Separation of concerns (MVC pattern)
