import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Wrench, CalendarOff, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
  { label: 'Services', href: '/admin/services', icon: Wrench },
  { label: 'Block Dates', href: '/admin/blocked', icon: CalendarOff },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-border">
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-navy rounded-xl flex items-center justify-center text-sm">🦷</div>
          <div>
            <p className="font-display font-800 text-slate text-sm leading-none">SmileCare</p>
            <p className="font-body text-slate-muted text-xs">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <NavLink key={item.href} to={item.href} end={item.end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-500 transition-colors ${
                isActive ? 'bg-steel-pale text-navy border border-steel/20' : 'text-slate-mid hover:bg-page hover:text-slate'
              }`
            }>
            <item.icon size={16} /> {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-border">
        <div className="px-3 py-2 mb-1">
          <p className="font-body text-slate text-xs font-500">{admin?.name || 'Admin'}</p>
          <p className="font-body text-slate-muted text-xs truncate">{admin?.email}</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-slate-mid hover:bg-page hover:text-slate transition-colors">
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-page overflow-hidden">
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0"><SidebarContent /></aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-navy/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56"><SidebarContent /></aside>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-white border-b border-border px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-mid p-1"><Menu size={20} /></button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-navy rounded-lg flex items-center justify-center text-xs">🦷</div>
            <span className="font-display font-700 text-slate text-sm">SmileCare Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}
