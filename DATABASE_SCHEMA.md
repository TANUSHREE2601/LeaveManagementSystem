# Database Schema Documentation

## MongoDB Collections

### 1. Employees Collection

```javascript
{
  _id: ObjectId("..."),
  name: String (required, min: 2, max: 100),
  email: String (required, unique, lowercase, trim),
  password: String (required, hashed with bcrypt),
  employeeId: String (required, unique, uppercase),
  department: String (required, enum: ["Engineering", "HR", "Finance", "Sales", "Marketing", "Operations"]),
  role: String (default: "employee", enum: ["employee"]),
  totalLeaves: Number (default: 25), // Annual leave balance
  usedLeaves: Number (default: 0),
  remainingLeaves: Number (default: 25), // Calculated field
  isActive: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `email`: unique
- `employeeId`: unique
- `email + role`: compound index

**Mongoose Schema Example:**
```javascript
const employeeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Engineering', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations']
  },
  role: {
    type: String,
    default: 'employee',
    enum: ['employee']
  },
  totalLeaves: {
    type: Number,
    default: 25
  },
  usedLeaves: {
    type: Number,
    default: 0
  },
  remainingLeaves: {
    type: Number,
    default: 25
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes
employeeSchema.index({ email: 1 });
employeeSchema.index({ employeeId: 1 });
```

---

### 2. Employers Collection

```javascript
{
  _id: ObjectId("..."),
  name: String (required, min: 2, max: 100),
  email: String (required, unique, lowercase, trim),
  password: String (required, hashed with bcrypt),
  companyName: String (required, trim),
  role: String (default: "employer", enum: ["employer"]),
  isActive: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `email`: unique
- `email + role`: compound index

**Mongoose Schema Example:**
```javascript
const employerSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  role: {
    type: String,
    default: 'employer',
    enum: ['employer']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
employerSchema.index({ email: 1 });
```

---

### 3. Leaves Collection

```javascript
{
  _id: ObjectId("..."),
  employee: ObjectId (required, ref: "Employee"),
  startDate: Date (required),
  endDate: Date (required, must be >= startDate),
  leaveType: String (required, enum: ["sick", "casual", "vacation", "personal", "maternity", "paternity"]),
  reason: String (required, min: 10, max: 500),
  days: Number (required, min: 1), // Calculated from dates
  status: String (default: "pending", enum: ["pending", "approved", "rejected"]),
  approvedBy: ObjectId (ref: "Employer"), // Set when approved
  rejectedBy: ObjectId (ref: "Employer"), // Set when rejected
  approvedAt: Date, // Timestamp when approved
  rejectedAt: Date, // Timestamp when rejected
  comments: String (max: 500), // Comments from employer
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `employee`: for employee leave queries
- `status`: for filtering by status
- `createdAt`: for sorting
- `employee + status`: compound index
- `status + createdAt`: compound index for employer queries

**Mongoose Schema Example:**
```javascript
const leaveSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Start date cannot be in the past'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  leaveType: {
    type: String,
    required: [true, 'Leave type is required'],
    enum: ['sick', 'casual', 'vacation', 'personal', 'maternity', 'paternity']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    minlength: [10, 'Reason must be at least 10 characters'],
    maxlength: [500, 'Reason cannot exceed 500 characters'],
    trim: true
  },
  days: {
    type: Number,
    required: [true, 'Days is required'],
    min: [1, 'Days must be at least 1']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Employer'
  },
  rejectedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Employer'
  },
  approvedAt: Date,
  rejectedAt: Date,
  comments: {
    type: String,
    maxlength: [500, 'Comments cannot exceed 500 characters'],
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
leaveSchema.index({ employee: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ createdAt: -1 });
leaveSchema.index({ employee: 1, status: 1 });
leaveSchema.index({ status: 1, createdAt: -1 });

// Pre-save hook to calculate days
leaveSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    this.days = diffDays;
  }
  next();
});
```

---

## Relationships

1. **Employee ↔ Leave**: One-to-Many
   - One employee can have many leave requests
   - Leave document references Employee via `employee` field

2. **Employer ↔ Leave**: One-to-Many (indirect)
   - One employer can approve/reject many leaves
   - Leave document references Employer via `approvedBy` or `rejectedBy` fields

---

## Data Integrity Rules

1. **Employee Leave Balance**:
   - `remainingLeaves = totalLeaves - usedLeaves`
   - When leave is approved, increment `usedLeaves` and decrement `remainingLeaves`
   - Cannot apply for leave if `remainingLeaves < requested days`

2. **Date Validation**:
   - `startDate` cannot be in the past
   - `endDate` must be >= `startDate`
   - Calculate `days` automatically from dates

3. **Status Transitions**:
   - Initial: `pending`
   - Can transition to: `approved` or `rejected`
   - Once `approved` or `rejected`, cannot be changed (unless you want to implement a revision workflow)

4. **Cascade Operations**:
   - If employee is deleted (soft delete), mark `isActive: false` instead of hard delete
   - Maintain referential integrity for leave history

---

## Sample Data

### Employee
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$hashedpassword...",
  "employeeId": "EMP001",
  "department": "Engineering",
  "role": "employee",
  "totalLeaves": 25,
  "usedLeaves": 5,
  "remainingLeaves": 20,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

### Employer
```json
{
  "_id": "507f191e810c19729de860ea",
  "name": "Jane Manager",
  "email": "jane@company.com",
  "password": "$2b$10$hashedpassword...",
  "companyName": "Tech Corp",
  "role": "employer",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Leave
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "employee": "507f1f77bcf86cd799439011",
  "startDate": "2024-02-15T00:00:00.000Z",
  "endDate": "2024-02-17T00:00:00.000Z",
  "leaveType": "sick",
  "reason": "Medical appointment and recovery",
  "days": 3,
  "status": "approved",
  "approvedBy": "507f191e810c19729de860ea",
  "approvedAt": "2024-01-11T09:00:00.000Z",
  "comments": "Approved for medical treatment",
  "createdAt": "2024-01-10T10:00:00.000Z",
  "updatedAt": "2024-01-11T09:00:00.000Z"
}
```
