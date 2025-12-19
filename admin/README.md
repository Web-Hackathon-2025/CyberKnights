# Tabeeb AI - Admin Panel

Modern, data-driven admin panel for managing the Tabeeb AI platform.

## Features

- 🔐 Secure admin authentication
- 👥 User management (Patients & Doctors)
- ✅ Doctor approval system
- 📊 Data visualization with charts and graphs
- 📱 Responsive design
- 🎨 Consistent theme with main web app

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS 4** - Styling
- **Recharts** - Charts and data visualization
- **Axios** - API calls
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The admin panel will be available at `http://localhost:3001`

### Default Admin Credentials

```
Email: admin@tabeebaai.com
Password: Admin@123456
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── layout/         # Layout components (Sidebar, Header)
│   ├── ui/             # UI components (Card, Table, etc.)
│   └── charts/         # Chart components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom hooks
├── lib/                # API configuration
├── pages/              # Page components
├── services/           # API services
├── utils/              # Utility functions
└── App.jsx             # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

API endpoints are documented in `docs/API.admin.md`

Base URL: `http://localhost:5000/api`

All requests require:
- `x-platform: web` header
- `Authorization: Bearer <token>` header (after login)

## Features Roadmap

### Current (Phase 1)
- ✅ Admin authentication
- ✅ Users management
- ✅ Doctors approval
- ✅ Basic statistics

### Future (Phase 2+)
- 📊 Advanced analytics
- 📈 Usage statistics
- 💬 Patient-Doctor chat monitoring
- 🔔 Notifications system
- 📧 Email templates management
- ⚙️ System settings
- 📝 Content management
- 🚨 Incident reports
- 💰 Billing management

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## License

Private - Tabeeb AI Project
