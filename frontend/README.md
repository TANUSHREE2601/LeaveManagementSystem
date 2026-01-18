# Leave Management System - Frontend

Modern React frontend for the Leave Management System with Tailwind CSS, React Router, and Context API.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Context API** - State management

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Navbar.jsx
│   │   ├── auth/            # Auth-related components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── employee/        # Employee-specific components
│   │   │   ├── ApplyLeaveForm.jsx
│   │   │   └── LeaveStatusTable.jsx
│   │   └── employer/        # Employer-specific components
│   │       └── LeaveManagementTable.jsx
│   ├── context/             # Context providers
│   │   └── AuthContext.jsx
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── EmployeeDashboard.jsx
│   │   └── EmployerDashboard.jsx
│   ├── services/            # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── leaveService.js
│   ├── utils/               # Utilities
│   │   └── constants.js
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env

# Start development server
npm run dev
```

The application will start at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📱 Features

### Authentication
- ✅ User signup with role selection
- ✅ User login with JWT
- ✅ Protected routes based on authentication
- ✅ Role-based route protection

### Employee Features
- ✅ Employee dashboard with statistics
- ✅ Apply for leave form
- ✅ View leave status table
- ✅ Filter leaves by status
- ✅ Responsive design

### Employer Features
- ✅ Employer dashboard with statistics
- ✅ View all employee leave requests
- ✅ Approve/reject leave requests
- ✅ Filter leaves by status
- ✅ Responsive design

## 🎨 UI Components

### Common Components

- **Button** - Reusable button with variants (primary, secondary, danger)
- **Input** - Form input with label and error handling
- **Select** - Dropdown select with options
- **Card** - Container component with shadow
- **Navbar** - Navigation bar with user info and logout

### Page Components

- **LoginPage** - User login form
- **SignupPage** - User registration form
- **EmployeeDashboard** - Employee dashboard with stats and leave management
- **EmployerDashboard** - Employer dashboard with leave approval/rejection

## 🔐 Authentication Flow

1. User signs up or logs in
2. JWT token stored in localStorage
3. Token attached to all API requests via Axios interceptor
4. Protected routes check authentication status
5. Invalid/expired tokens redirect to login

## 🛣️ Routes

- `/login` - Login page (public)
- `/signup` - Signup page (public)
- `/` - Home page (protected, redirects based on role)
- `/employee` - Employee dashboard (protected, employee only)
- `/employer` - Employer dashboard (protected, employer only)

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Mobile-friendly tables and forms

### Error Handling
- Form validation
- API error handling
- Toast notifications for user feedback

### State Management
- Context API for global auth state
- Local state for component-specific data
- Service layer for API calls

## 🚀 Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist` directory.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

The application uses Tailwind CSS with custom utilities:

- Primary color: Blue (#0ea5e9)
- Responsive breakpoints: sm, md, lg, xl
- Custom component classes in `index.css`

## 📦 Dependencies

### Core
- `react` - React library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing

### UI & Styling
- `tailwindcss` - CSS framework
- `react-hot-toast` - Toast notifications

### HTTP & State
- `axios` - HTTP client
- Context API (built-in) - State management

## 🔗 API Integration

All API calls are made through service files:

- `authService.js` - Authentication endpoints
- `leaveService.js` - Leave management endpoints

Axios is configured with:
- Base URL from environment variables
- JWT token in Authorization header
- Automatic token refresh handling
- Error interceptors for 401 redirects

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Built with React, Tailwind CSS, and Vite** 🚀
