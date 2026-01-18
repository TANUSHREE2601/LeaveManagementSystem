# Leave Management System (LMS)

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18+-61dafb.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

A full-stack **Leave Management System** with role-based access control, built with React, Node.js, Express, and MongoDB Atlas.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [API Documentation](#-api-endpoints) • [Deployment](#-deployment)

</div>

---

## 📋 Project Overview

The **Leave Management System (LMS)** is a comprehensive web application designed to streamline leave request management for organizations. The system supports two distinct user roles:

- **Employees**: Can apply for leaves and track their leave status
- **Employers**: Can view, approve, or reject leave requests from employees

Built with modern web technologies and best practices, the application features secure authentication, role-based access control, and a responsive user interface.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Employee/Employer)
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Automatic token expiration handling

### 👤 Employee Features
- User registration and login
- Apply for leave requests with detailed information
- View personal leave history and status
- Filter leaves by status (Pending, Approved, Rejected)
- Real-time leave application tracking

### 🏢 Employer Features
- User registration and login
- View all employee leave requests
- Approve or reject leave applications
- Dashboard with leave statistics
- Filter leaves by status
- Employee information display

### 🎨 User Experience
- Modern, responsive UI with Tailwind CSS
- Intuitive dashboard design
- Real-time status updates
- Toast notifications for user feedback
- Loading states and empty states
- Form validation with error messages

### 🔒 Security Features
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- Environment variable protection
- Error handling without exposing sensitive data

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Context API** - State management
- **Vite** - Build tool and dev server

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet** - Security headers
- **Morgan** - HTTP request logger

### DevOps & Deployment
- **Docker** - Containerization
- **AWS EC2** - Backend hosting
- **AWS S3** - Frontend static hosting
- **CloudFront** - CDN distribution
- **MongoDB Atlas** - Database hosting

---

## 📁 Project Structure

```
LMS/
├── backend/                      # Node.js Backend API
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   ├── database.js      # MongoDB connection
│   │   │   ├── env.js           # Environment variables
│   │   │   └── constants.js     # App constants
│   │   ├── models/              # Mongoose models
│   │   │   ├── User.js          # User schema
│   │   │   └── Leave.js         # Leave schema
│   │   ├── routes/              # API routes
│   │   │   ├── auth.routes.js   # Authentication routes
│   │   │   ├── leave.routes.js  # Leave routes
│   │   │   ├── employer.routes.js
│   │   │   ├── employee.routes.js
│   │   │   └── index.js
│   │   ├── controllers/         # Route handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── leave.controller.js
│   │   │   └── employee.controller.js
│   │   ├── middleware/          # Custom middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── errorHandler.middleware.js
│   │   │   └── notFound.middleware.js
│   │   ├── validators/          # Validation schemas
│   │   │   ├── auth.validator.js
│   │   │   ├── leave.validator.js
│   │   │   └── validation.middleware.js
│   │   ├── utils/               # Utility functions
│   │   │   ├── jwt.js           # JWT utilities
│   │   │   └── logger.js        # Logger setup
│   │   ├── app.js               # Express app configuration
│   │   └── server.js            # Server entry point
│   ├── Dockerfile               # Docker configuration
│   ├── docker-compose.yml       # Docker Compose config
│   ├── .dockerignore
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── README.md
│
├── frontend/                     # React Frontend Application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── common/          # Reusable components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── auth/            # Auth components
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── employee/        # Employee components
│   │   │   │   ├── ApplyLeaveForm.jsx
│   │   │   │   └── LeaveStatusTable.jsx
│   │   │   └── employer/        # Employer components
│   │   │       └── LeaveManagementTable.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   └── EmployerDashboard.jsx
│   │   ├── context/             # Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── services/            # API services
│   │   │   ├── api.js           # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── leaveService.js
│   │   │   └── errorHandler.js
│   │   ├── utils/               # Utilities
│   │   │   └── constants.js
│   │   ├── App.jsx              # Main App component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── ARCHITECTURE.md               # System architecture
├── API_ENDPOINTS.md              # Complete API documentation
├── DATABASE_SCHEMA.md            # Database schema details
├── AUTHENTICATION_FLOW.md        # Auth flow documentation
├── DEPLOYMENT.md                 # Deployment guide
├── ERROR_HANDLING.md             # Error handling documentation
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)
- **Git** (optional)

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd LMS
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# - MONGODB_URI (from MongoDB Atlas)
# - JWT_SECRET (at least 32 characters)

# Start development server
npm run dev
```

The backend API will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

#### 4. Verify Setup

- Backend Health Check: `http://localhost:5000/api/health`
- Frontend: `http://localhost:3000`

---

## 🌐 API Endpoints

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://api.yourdomain.com/api`

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/auth/signup` | User registration | Public |
| `POST` | `/auth/login` | User login | Public |
| `GET` | `/auth/me` | Get current user | Private |

### Leave Endpoints (Employee)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/leaves/apply` | Apply for leave | Employee |
| `GET` | `/leaves/my-leaves` | Get my leaves | Employee |

### Leave Endpoints (Employer)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/leaves/all` | Get all leaves | Employer |
| `PATCH` | `/leaves/:id/approve` | Approve leave | Employer |
| `PATCH` | `/leaves/:id/reject` | Reject leave | Employer |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/health` | API health check | Public |

### Request Example

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Apply for Leave (with token)
curl -X POST http://localhost:5000/api/leaves/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "leaveType":"sick",
    "startDate":"2024-02-15",
    "endDate":"2024-02-17",
    "reason":"Medical appointment"
  }'
```

For complete API documentation, see [API_ENDPOINTS.md](./API_ENDPOINTS.md)

---

## 🔧 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

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

**Required Variables:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT signing (minimum 32 characters)

**Optional Variables (with defaults):**
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (default: development)
- `JWT_EXPIRES_IN` - Token expiration (default: 1h)
- `CORS_ORIGIN` - Frontend URL (default: http://localhost:3000)

### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

**Note:** Vite requires the `VITE_` prefix for environment variables.

---

## 🐳 Docker Usage

### Backend with Docker

#### Build Docker Image

```bash
cd backend
docker build -t lms-backend:latest .
```

#### Run Docker Container

```bash
# Using Docker run
docker run -d \
  --name lms-backend \
  -p 5000:5000 \
  --env-file .env \
  lms-backend:latest

# Or using Docker Compose
docker-compose up -d
```

#### Docker Commands

```bash
# View logs
docker logs -f lms-backend

# Stop container
docker stop lms-backend

# Remove container
docker rm lms-backend

# Restart container
docker restart lms-backend

# Using Docker Compose
docker-compose logs -f    # View logs
docker-compose down       # Stop and remove
docker-compose restart    # Restart services
```

### Health Check

```bash
# Check if container is healthy
docker ps

# Test API health endpoint
curl http://localhost:5000/api/health
```

---

## ☁️ AWS Deployment

### Overview

This application is designed to be deployed on AWS Free Tier:

- **Backend**: AWS EC2 (t2.micro) with Docker
- **Frontend**: AWS S3 + CloudFront
- **Database**: MongoDB Atlas (M0 free cluster)

### Quick Deployment Steps

#### Backend Deployment (EC2)

1. **Launch EC2 Instance**
   - AMI: Amazon Linux 2023
   - Instance Type: t2.micro (Free Tier)
   - Security Group: Allow ports 22, 80, 443, 5000

2. **Connect to EC2**
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-ip
   ```

3. **Install Docker**
   ```bash
   sudo yum update -y
   sudo yum install docker -y
   sudo systemctl start docker
   sudo usermod -aG docker ec2-user
   ```

4. **Deploy Application**
   ```bash
   # Transfer files to EC2 (use SCP or Git)
   cd /home/ec2-user/lms-backend/backend
   
   # Create .env file with production values
   nano .env
   
   # Build and run container
   docker-compose up -d --build
   ```

#### Frontend Deployment (S3)

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   - Bucket name: `lms-frontend`
   - Enable static website hosting
   - Set bucket policy for public access

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://lms-frontend --delete
   ```

4. **Set Up CloudFront** (Optional but Recommended)
   - Create distribution pointing to S3 bucket
   - Configure error pages (403/404 → index.html)
   - Set up custom domain and SSL

### Detailed Deployment Guide

For step-by-step deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📊 Database Schema

### Collections

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('employee' | 'employer'),
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Leaves Collection
```javascript
{
  _id: ObjectId,
  employee: ObjectId (ref: User),
  leaveType: String ('sick' | 'casual' | 'vacation' | ...),
  startDate: Date,
  endDate: Date,
  reason: String,
  status: String ('Pending' | 'Approved' | 'Rejected'),
  days: Number (calculated),
  createdAt: Date,
  updatedAt: Date
}
```

For detailed schema documentation, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: express-validator on all endpoints
- **Rate Limiting**: Prevents brute force attacks
- **CORS Configuration**: Restricted to allowed origins
- **Helmet.js**: Security headers
- **Error Handling**: No sensitive data exposed
- **Environment Variables**: Sensitive data not in code

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

### Manual Testing

1. **Test Authentication**
   - Register new user
   - Login with credentials
   - Verify JWT token received

2. **Test Employee Flow**
   - Login as employee
   - Apply for leave
   - View leave status

3. **Test Employer Flow**
   - Login as employer
   - View all leaves
   - Approve/reject leaves

---

## 📚 Documentation

Comprehensive documentation is available:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and architecture
- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Complete API reference
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database structure
- **[AUTHENTICATION_FLOW.md](./AUTHENTICATION_FLOW.md)** - Auth implementation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide
- **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** - Error handling documentation

---

## 🛠️ Development

### Project Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server (with nodemon)
```

#### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Code Style

- ES6+ JavaScript
- RESTful API conventions
- Clean code principles
- Meaningful variable names
- Commented complex logic

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- MongoDB Atlas for free tier database hosting
- AWS for free tier cloud services
- React and Node.js communities for excellent documentation

---

<div align="center">

**Built with ❤️ using React, Node.js, Express, and MongoDB**

[⬆ Back to Top](#leave-management-system-lms)

</div>
