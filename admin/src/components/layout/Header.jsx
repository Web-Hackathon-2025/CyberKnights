import { Bell, Search } from 'lucide-react';

export function Header({ title }) {
  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
