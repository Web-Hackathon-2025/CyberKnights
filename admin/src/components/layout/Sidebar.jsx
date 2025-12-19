import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText,
  LogOut,
  Briefcase,
  Grid3X3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/helpers';

export function Sidebar() {
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Pending Providers', href: '/providers/pending', icon: UserCheck },
    { name: 'All Providers', href: '/providers', icon: Briefcase },
    { name: 'Categories', href: '/categories', icon: Grid3X3 },
    { name: 'API Docs', href: '/api-docs', icon: FileText },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <div>
            <span className="font-bold text-neutral-900 text-lg">Karigar</span>
            <span className="text-xs text-neutral-500 block -mt-1">Admin Panel</span>
          </div>
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
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                  isActive
                    ? 'bg-primary text-white font-medium shadow-md shadow-primary/20'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
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
        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-neutral-50 rounded-xl">
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
