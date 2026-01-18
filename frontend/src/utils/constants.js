// Use relative path when in development (Vite proxy handles it)
// Use full URL in production or if VITE_API_URL is explicitly set
export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api');


export const ROLES = {
  EMPLOYEE: 'employee',
  EMPLOYER: 'employer',
};

export const LEAVE_TYPES = [
  { value: 'sick', label: 'Sick Leave' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'personal', label: 'Personal Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
];

export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const STATUS_COLORS = {
  Pending: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  Approved: 'bg-green-50 text-green-800 border border-green-200',
  Rejected: 'bg-red-50 text-red-800 border border-red-200',
};
