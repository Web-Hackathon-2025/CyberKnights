# Tabeeb AI Admin Panel - Quick Start

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

The admin panel will be available at `http://localhost:3001`

### 4. Login
Use the default admin credentials:
- **Email:** admin@tabeebaai.com
- **Password:** Admin@123456

## Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, Header, AdminLayout
│   ├── ui/              # Reusable UI components
│   ├── charts/          # Chart components (Recharts)
│   ├── ProtectedRoute.jsx
│   └── StatCard.jsx
├── contexts/
│   └── AuthContext.jsx  # Authentication context
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── UsersPage.jsx
│   ├── PendingDoctorsPage.jsx
│   ├── ActivityPage.jsx
│   └── ApiDocsPage.jsx
├── services/
│   ├── authService.js   # Authentication API
│   └── adminService.js  # Admin API
├── lib/
│   └── api.js           # Axios configuration
└── utils/
    └── helpers.js       # Utility functions
```

## Features Implemented

✅ **Authentication**
- Admin login
- Token-based auth with refresh
- Protected routes
- Auto logout on token expiry

✅ **Dashboard**
- Statistics cards (Users, Patients, Doctors, Pending)
- User growth chart (Recharts)
- Weekly activity chart
- Recent users list

✅ **Users Management**
- View all users (patients, doctors, admins)
- Filter by role, approval status, email verification
- Pagination
- Delete users (except admins)

✅ **Doctor Approval**
- View pending doctor approvals
- Approve doctors (sends email)
- Reject doctors (deletes account, sends email)

✅ **UI Components**
- Modern, clean design
- Consistent with web app theme
- Fully responsive
- Tailwind CSS 4

## API Integration

All API endpoints from `API.admin.md` are integrated:
- ✅ POST /auth/login
- ✅ POST /auth/logout
- ✅ GET /admin/users
- ✅ GET /admin/doctors/pending
- ✅ PATCH /admin/doctors/:id/approve
- ✅ PATCH /admin/doctors/:id/reject
- ✅ DELETE /admin/users/:id

## Tech Stack

- React 19
- Vite
- React Router v7
- Tailwind CSS 4
- Recharts (charts/graphs)
- Axios
- Lucide React (icons)
- date-fns

## Build for Production

```bash
npm run build
npm run preview
```

## Future Enhancements

The admin panel is designed to scale. Planned features:
- Advanced analytics dashboard
- Real-time notifications
- Audit logs and activity tracking
- Patient-Doctor chat monitoring
- Content management
- Email template management
- System settings
- Report generation
- Export functionality
