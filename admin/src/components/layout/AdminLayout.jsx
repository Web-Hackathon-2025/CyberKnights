import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AdminLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Sidebar />
      <div className="ml-64">
        <Header title={title} />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
