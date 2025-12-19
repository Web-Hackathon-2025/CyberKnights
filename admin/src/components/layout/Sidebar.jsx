import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText,
  LogOut,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/helpers';

export function Sidebar() {
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Pending Doctors', href: '/doctors/pending', icon: UserCheck },
    { name: 'Sync Jobs', href: '/sync-jobs', icon: RefreshCw },
    { name: 'Activity Log', href: '/activity', icon: Activity },
    { name: 'API Docs', href: '/api-docs', icon: FileText },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="font-semibold text-neutral-900">Tabeeb AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary font-medium'
                    : 'text-neutral-700 hover:bg-neutral-100'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary font-semibold">
              {user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {user?.name || 'Admin'}
            </p>
            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
