# Tabeeb AI - Admin Panel

## 🎯 Overview

A modern, professional admin panel for managing the Tabeeb AI healthcare platform. Built with React 19, Vite, and Tailwind CSS 4, featuring data visualization, user management, and doctor approval workflows.

## ✨ Features

### 🔐 Authentication
- Secure admin-only login
- JWT token-based authentication
- Automatic token refresh
- Session management
- Protected routes

### 📊 Dashboard
- **Statistics Cards**: Total users, patients, doctors, and pending approvals
- **User Growth Chart**: Bar chart showing user registration trends
- **Activity Chart**: Line chart displaying weekly platform activity
- **Recent Users**: Quick overview of latest registrations
- Real-time data updates

### 👥 User Management
- View all users (patients, doctors, admins)
- **Advanced Filtering**:
  - By role (Patient/Doctor/Admin)
  - By approval status
  - By email verification status
- **Pagination**: Navigate through large user lists
- **User Actions**: Delete users (with protection for admins)
- Detailed user information display

### ⚕️ Doctor Approval System
- View pending doctor registration requests
- **Approve doctors**: Grants access + sends approval email
- **Reject doctors**: Deletes account + sends rejection email
- Detailed confirmation modals
- Email verification status display

### 📈 Data Visualization
- **Recharts Integration**: Professional charts and graphs
- Customizable data displays
- Responsive chart sizing
- Clean, modern design

### 🎨 UI/UX
- **Consistent Theme**: Matches main web application
- **Responsive Design**: Works on all screen sizes
- **Modern Components**: Cards, tables, modals, badges, buttons
- **Sidebar Navigation**: Easy access to all features
- **Clean Layout**: Professional admin interface
- **Loading States**: Spinner components for async operations
- **Error Handling**: User-friendly error messages

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI Library |
| **Vite** | 7.1.7 | Build Tool & Dev Server |
| **React Router** | 7.9.5 | Routing |
| **Tailwind CSS** | 4.1.16 | Styling |
| **Recharts** | 2.13.3 | Charts & Graphs |
| **Axios** | 1.13.1 | HTTP Client |
| **Lucide React** | 0.552.0 | Icons |
| **date-fns** | 3.3.1 | Date Formatting |

## 📁 Project Structure

```
TabeebAi-admin/
├── docs/
│   └── API_INTEGRATION.md     # API documentation
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   │   ├── Header.jsx            # Top header bar
│   │   │   └── AdminLayout.jsx       # Main layout wrapper
│   │   ├── ui/
│   │   │   ├── Button.jsx            # Button component
│   │   │   ├── Card.jsx              # Card components
│   │   │   ├── Input.jsx             # Input field
│   │   │   ├── Select.jsx            # Dropdown select
│   │   │   ├── Table.jsx             # Table components
│   │   │   ├── Badge.jsx             # Status badges
│   │   │   ├── Modal.jsx             # Modal dialogs
│   │   │   └── Spinner.jsx           # Loading spinners
│   │   ├── charts/
│   │   │   ├── UserStatsChart.jsx    # User growth bar chart
│   │   │   └── ActivityChart.jsx     # Activity line chart
│   │   ├── ProtectedRoute.jsx        # Route protection
│   │   └── StatCard.jsx              # Statistics card
│   ├── contexts/
│   │   └── AuthContext.jsx           # Authentication state
│   ├── hooks/                         # Custom React hooks
│   ├── lib/
│   │   └── api.js                    # Axios configuration
│   ├── pages/
│   │   ├── LoginPage.jsx             # Admin login
│   │   ├── DashboardPage.jsx         # Main dashboard
│   │   ├── UsersPage.jsx             # User management
│   │   ├── PendingDoctorsPage.jsx    # Doctor approvals
│   │   ├── ActivityPage.jsx          # Activity log (coming soon)
│   │   └── ApiDocsPage.jsx           # API documentation
│   ├── services/
│   │   ├── authService.js            # Auth API calls
│   │   └── adminService.js           # Admin API calls
│   ├── utils/
│   │   └── helpers.js                # Utility functions
│   ├── App.jsx                       # Main app component
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles
├── .env                              # Environment variables
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── index.html                        # HTML template
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
├── postcss.config.js                 # PostCSS configuration
├── eslint.config.js                  # ESLint rules
├── jsconfig.json                     # JavaScript config
├── README.md                         # Project documentation
└── QUICKSTART.md                     # Setup guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Running backend server (TabeebAi-backendNode)

### Installation

1. **Navigate to admin directory:**
   ```bash
   cd TabeebAi-admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access admin panel:**
   - URL: `http://localhost:3001`
   - Email: `admin@tabeebaai.com`
   - Password: `Admin@123456`

## 📡 API Integration

### Base Configuration
- **Base URL**: `http://localhost:5000/api`
- **Required Header**: `x-platform: web`
- **Authentication**: Bearer token in Authorization header

### Integrated Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/auth/login` | Admin login | ✅ |
| POST | `/auth/logout` | Logout | ✅ |
| POST | `/auth/refresh-token` | Refresh access token | ✅ |
| GET | `/admin/users` | Get all users | ✅ |
| GET | `/admin/doctors/pending` | Get pending doctors | ✅ |
| PATCH | `/admin/doctors/:id/approve` | Approve doctor | ✅ |
| PATCH | `/admin/doctors/:id/reject` | Reject doctor | ✅ |
| DELETE | `/admin/users/:id` | Delete user | ✅ |

See `docs/API_INTEGRATION.md` for detailed API documentation.

## 🎨 Design System

### Color Palette
- **Primary**: #008080 (Teal)
- **Primary Variants**: #006666 to #E6F2F2
- **Success**: #4CAF50
- **Error**: #E11D3A
- **Warning**: #F59E0B
- **Info**: #3B82F6
- **Neutrals**: #F5F5F5 to #111827

### Components
All components follow the same design system as the main web application for consistency.

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server (port 3001)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🔒 Security Features

- **Admin-only access**: Role verification at login
- **Token management**: Secure JWT handling
- **Auto-refresh**: Seamless token renewal
- **Protected routes**: Route-level authentication
- **Admin protection**: Cannot delete admin accounts
- **Session management**: Multiple session support

## 🎯 Future Enhancements

### Phase 2
- [ ] Advanced analytics dashboard
- [ ] Real-time activity monitoring
- [ ] Audit logs and tracking
- [ ] User activity timeline
- [ ] Export functionality (CSV, PDF)

### Phase 3
- [ ] Patient-Doctor chat monitoring
- [ ] Appointment management
- [ ] Content management system
- [ ] Email template editor
- [ ] System settings panel

### Phase 4
- [ ] Notification system
- [ ] Report generation
- [ ] Billing management
- [ ] Multi-admin support with permissions
- [ ] Mobile app for admin

## 🐛 Known Issues

None currently. This is a fresh, production-ready setup.

## 📚 Documentation

- **QUICKSTART.md**: Quick setup guide
- **docs/API_INTEGRATION.md**: Complete API documentation
- **README.md**: This file

## 🤝 Contributing

This is a private project for Tabeeb AI. For any issues or suggestions, contact the development team.

## 📄 License

Private - Tabeeb AI Project

---

## 📞 Support

For technical support or questions:
- Backend Repo: `TabeebAi-backendNode`
- Web App Repo: `TabeebAi-web`

---

**Built with ❤️ for Tabeeb AI**
