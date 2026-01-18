# Frontend Folder Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Input/
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Input.module.css
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Spinner/
│   │   │   └── Alert/
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── Layout.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── employee/
│   │   │   ├── LeaveApplicationForm.jsx
│   │   │   ├── LeaveList.jsx
│   │   │   └── LeaveStatusCard.jsx
│   │   │
│   │   └── employer/
│   │       ├── LeaveRequestTable.jsx
│   │       ├── LeaveActionButtons.jsx
│   │       └── DashboardStats.jsx
│   │
│   ├── pages/               # Route-level page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── EmployeeDashboard.jsx
│   │   ├── EmployerDashboard.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── context/             # React Context for state management
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── services/            # API service layer
│   │   ├── api.js           # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── leaveService.js
│   │   └── employeeService.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── formatDate.js
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useLeaves.js
│   │   └── useLocalStorage.js
│   │
│   ├── styles/              # Global styles
│   │   ├── globals.css
│   │   └── tailwind.config.js
│   │
│   ├── App.jsx              # Main App component with routing
│   ├── App.css
│   ├── index.js             # Entry point
│   └── index.css
│
├── .env                     # Environment variables (not in git)
├── .env.example             # Example env file
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js           # or webpack.config.js
└── README.md
```

## Key Files Description

### src/App.jsx
- Main router configuration
- Route guards
- Global error boundaries

### src/services/api.js
- Axios instance with base URL
- Request/response interceptors
- JWT token attachment

### src/context/AuthContext.jsx
- Authentication state management
- Login/logout functions
- User role checking

### src/components/auth/ProtectedRoute.jsx
- Route protection based on authentication
- Role-based route access
