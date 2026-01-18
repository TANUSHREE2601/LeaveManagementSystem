# API Endpoints Documentation

## Base URL
```
Production: https://api.yourdomain.com/api
Development: http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### 1.1 Employee Signup
```
POST /api/auth/employee/signup
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "employeeId": "EMP001",
  "department": "Engineering"
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Employee registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee"
    }
  }
}
```

### 1.2 Employer Signup
```
POST /api/auth/employer/signup
```
**Request Body:**
```json
{
  "name": "Jane Manager",
  "email": "jane@company.com",
  "password": "SecurePass123!",
  "companyName": "Tech Corp"
}
```
**Response (201):** Similar to employee signup with `"role": "employer"`

### 1.3 Login (Both Roles)
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee"
    }
  }
}
```

### 1.4 Get Current User
```
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee"
  }
}
```

### 1.5 Logout (Optional - Client-side token removal)
```
POST /api/auth/logout
```
**Headers:** `Authorization: Bearer <token>`
**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. Leave Endpoints

### 2.1 Apply for Leave (Employee)
```
POST /api/leaves
```
**Headers:** `Authorization: Bearer <token>`
**Request Body:**
```json
{
  "startDate": "2024-02-15",
  "endDate": "2024-02-17",
  "leaveType": "sick",
  "reason": "Medical appointment",
  "days": 3
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Leave application submitted successfully",
  "data": {
    "_id": "leave_id",
    "employee": "employee_id",
    "startDate": "2024-02-15",
    "endDate": "2024-02-17",
    "leaveType": "sick",
    "reason": "Medical appointment",
    "days": 3,
    "status": "pending",
    "createdAt": "2024-01-10T10:00:00.000Z"
  }
}
```

### 2.2 Get Employee's Leave Requests
```
GET /api/leaves/me
```
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**
- `status` (optional): `pending|approved|rejected`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leaves": [
      {
        "_id": "leave_id",
        "startDate": "2024-02-15",
        "endDate": "2024-02-17",
        "leaveType": "sick",
        "reason": "Medical appointment",
        "days": 3,
        "status": "pending",
        "createdAt": "2024-01-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalLeaves": 50
    }
  }
}
```

### 2.3 Get Single Leave Request (Employee)
```
GET /api/leaves/:id
```
**Headers:** `Authorization: Bearer <token>`
**Response (200):** Single leave object

---

## 3. Employer Endpoints

### 3.1 Get All Leave Requests
```
GET /api/employer/leaves
```
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**
- `status` (optional): `pending|approved|rejected`
- `employeeId` (optional): Filter by employee
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leaves": [
      {
        "_id": "leave_id",
        "employee": {
          "_id": "employee_id",
          "name": "John Doe",
          "email": "john@example.com",
          "employeeId": "EMP001"
        },
        "startDate": "2024-02-15",
        "endDate": "2024-02-17",
        "leaveType": "sick",
        "reason": "Medical appointment",
        "days": 3,
        "status": "pending",
        "createdAt": "2024-01-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalLeaves": 100
    }
  }
}
```

### 3.2 Approve Leave Request
```
PATCH /api/employer/leaves/:id/approve
```
**Headers:** `Authorization: Bearer <token>`
**Request Body (optional):**
```json
{
  "comments": "Approved for medical treatment"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Leave request approved",
  "data": {
    "_id": "leave_id",
    "status": "approved",
    "approvedBy": "employer_id",
    "approvedAt": "2024-01-11T09:00:00.000Z"
  }
}
```

### 3.3 Reject Leave Request
```
PATCH /api/employer/leaves/:id/reject
```
**Headers:** `Authorization: Bearer <token>`
**Request Body (optional):**
```json
{
  "comments": "Insufficient leave balance"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Leave request rejected",
  "data": {
    "_id": "leave_id",
    "status": "rejected",
    "rejectedBy": "employer_id",
    "rejectedAt": "2024-01-11T09:00:00.000Z"
  }
}
```

### 3.4 Get Dashboard Statistics (Employer)
```
GET /api/employer/dashboard
```
**Headers:** `Authorization: Bearer <token>`
**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalPending": 15,
    "totalApproved": 120,
    "totalRejected": 8,
    "pendingLeaves": [
      // Array of pending leave requests
    ]
  }
}
```

---

## 4. Employee Profile Endpoints

### 4.1 Get Employee Profile
```
GET /api/employee/profile
```
**Headers:** `Authorization: Bearer <token>`
**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "employee_id",
    "name": "John Doe",
    "email": "john@example.com",
    "employeeId": "EMP001",
    "department": "Engineering",
    "totalLeaves": 25,
    "usedLeaves": 10,
    "remainingLeaves": 15
  }
}
```

### 4.2 Update Employee Profile
```
PATCH /api/employee/profile
```
**Headers:** `Authorization: Bearer <token>`
**Request Body:**
```json
{
  "name": "John Updated",
  "department": "Product"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Status Codes Summary

- `200` - Success (GET, PATCH, PUT)
- `201` - Created (POST)
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Invalid/missing token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
