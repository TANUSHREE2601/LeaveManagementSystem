# Leave Management System - Backend API

Node.js + Express backend for the Leave Management System with MongoDB Atlas, JWT authentication, and role-based access control.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## 📁 Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js         # MongoDB connection
│   │   └── constants.js        # Application constants
│   ├── models/
│   │   ├── Employee.js         # Employee model
│   │   ├── Employer.js         # Employer model
│   │   └── Leave.js            # Leave model
│   ├── routes/
│   │   ├── auth.routes.js      # Authentication routes
│   │   ├── leave.routes.js     # Leave routes (employee)
│   │   ├── employer.routes.js  # Employer routes
│   │   ├── employee.routes.js  # Employee profile routes
│   │   └── index.js            # Route aggregator
│   ├── controllers/
│   │   ├── auth.controller.js  # Authentication logic
│   │   ├── leave.controller.js # Leave management logic
│   │   └── employee.controller.js # Employee profile logic
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT authentication
│   │   ├── role.middleware.js  # Role-based access control
│   │   ├── errorHandler.middleware.js # Global error handler
│   │   └── notFound.middleware.js # 404 handler
│   ├── validators/
│   │   ├── auth.validator.js   # Auth validation rules
│   │   ├── leave.validator.js  # Leave validation rules
│   │   └── validation.middleware.js # Validation error handler
│   ├── utils/
│   │   ├── jwt.js              # JWT utilities
│   │   └── logger.js           # Morgan logger
│   ├── app.js                  # Express app configuration
│   └── server.js               # Server entry point
├── .env.example                # Environment variables example
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Run the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/employee/signup` - Employee signup
- `POST /api/auth/employer/signup` - Employer signup
- `POST /api/auth/login` - Login (both roles)
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

### Employee Routes
- `GET /api/employee/profile` - Get employee profile (protected)
- `PATCH /api/employee/profile` - Update employee profile (protected)

### Leave Routes (Employee)
- `POST /api/leaves` - Create leave request (protected)
- `GET /api/leaves/me` - Get employee's leaves (protected)
- `GET /api/leaves/:id` - Get single leave request (protected)

### Employer Routes
- `GET /api/employer/dashboard` - Get dashboard statistics (protected)
- `GET /api/employer/leaves` - Get all leave requests (protected)
- `PATCH /api/employer/leaves/:id/approve` - Approve leave (protected)
- `PATCH /api/employer/leaves/:id/reject` - Reject leave (protected)

### Health Check
- `GET /api/health` - API health check

## 🔐 Authentication

All protected routes require JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Models

### Employee
- name, email, password, employeeId, department
- role, totalLeaves, usedLeaves, remainingLeaves
- isActive, timestamps

### Employer
- name, email, password, companyName
- role, isActive, timestamps

### Leave
- employee (reference), startDate, endDate
- leaveType, reason, days, status
- approvedBy, rejectedBy, comments
- timestamps

## 🛡️ Security Features

- **Password Hashing**: bcrypt with 10 rounds
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access Control**: Employee and Employer roles
- **Input Validation**: express-validator for all inputs
- **Rate Limiting**: Prevents brute force attacks
- **Helmet**: Security headers
- **CORS**: Configurable origin restrictions

## 🧪 Error Handling

All errors are handled by the global error handler middleware:

- **400**: Bad Request (Validation errors)
- **401**: Unauthorized (Invalid/missing token)
- **403**: Forbidden (Insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

## 📝 Validation Rules

### Employee Signup
- Name: 2-100 characters
- Email: Valid email format, unique
- Password: Min 8 chars, at least one uppercase, lowercase, and number
- Employee ID: 3-20 characters, unique
- Department: Must be from allowed list

### Employer Signup
- Name: 2-100 characters
- Email: Valid email format, unique
- Password: Min 8 chars, at least one uppercase, lowercase, and number
- Company Name: 2-100 characters

### Leave Request
- Start Date: Must be today or future
- End Date: Must be >= start date
- Leave Type: Must be from allowed types
- Reason: 10-500 characters

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

## 📚 Documentation

For complete API documentation, see [API_ENDPOINTS.md](../API_ENDPOINTS.md)

For database schema details, see [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md)

---

**Built with Node.js, Express, and MongoDB**
