# Backend Folder Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── jwt.js           # JWT configuration
│   │   ├── cloudinary.js    # If using file uploads
│   │   └── constants.js     # App constants
│   │
│   ├── models/              # Mongoose models
│   │   ├── Employee.js
│   │   ├── Employer.js
│   │   └── Leave.js
│   │
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── employee.routes.js
│   │   ├── employer.routes.js
│   │   ├── leave.routes.js
│   │   └── index.js         # Route aggregator
│   │
│   ├── controllers/         # Route handlers (business logic)
│   │   ├── auth.controller.js
│   │   ├── employee.controller.js
│   │   ├── employer.controller.js
│   │   └── leave.controller.js
│   │
│   ├── middleware/          # Custom middleware
│   │   ├── auth.middleware.js     # JWT verification
│   │   ├── role.middleware.js     # Role-based access control
│   │   ├── validation.middleware.js  # Request validation
│   │   ├── errorHandler.middleware.js # Error handling
│   │   └── logger.middleware.js   # Request logging
│   │
│   ├── validators/          # Validation schemas (Joi/express-validator)
│   │   ├── auth.validator.js
│   │   ├── leave.validator.js
│   │   └── employee.validator.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── bcrypt.js        # Password hashing helpers
│   │   ├── jwt.js           # JWT token generation/verification
│   │   ├── logger.js        # Winston/morgan logger
│   │   ├── email.js         # Email service (if needed)
│   │   └── helpers.js       # General helpers
│   │
│   ├── services/            # Business logic services (optional layer)
│   │   ├── auth.service.js
│   │   ├── leave.service.js
│   │   └── notification.service.js
│   │
│   ├── types/               # TypeScript types (if using TS)
│   │   └── index.d.ts
│   │
│   ├── app.js               # Express app configuration
│   ├── server.js            # Server entry point
│   └── index.js             # App initialization
│
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env                     # Environment variables (not in git)
├── .env.example             # Example env file
├── .gitignore
├── .dockerignore
├── package.json
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # For local development
├── jest.config.js           # Test configuration
└── README.md
```

## Key Files Description

### src/server.js
- Server initialization
- Environment variable loading
- Database connection
- Error handling

### src/app.js
- Express app setup
- Middleware configuration
- Route mounting
- Global error handler

### src/middleware/auth.middleware.js
- JWT token verification
- User extraction from token
- Error handling for invalid tokens

### src/middleware/role.middleware.js
- Role-based access control
- Permission checking

### src/config/database.js
- MongoDB connection setup
- Connection error handling
- Reconnection logic
