import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  LogOut,
  BarChart3,
  Users,
  Mail,
  FileText,
  BookOpen,
  ClipboardList,
  Newspaper,
  Gauge,
  LayoutDashboard,
} from 'lucide-react';

type AdminSection = 'dashboard' | 'analytics' | 'leads' | 'profiles' | 'contact' | 'workshops' | 'brochures' | 'exercises' | 'assessments' | 'newsletter' | 'learning';

interface AdminLayoutProps {
  currentSection: AdminSection;
  onSectionChange: (s: AdminSection) => void;
  onLogout: () => void;
  userEmail: string;
  stats?: {
    totalLeads: number;
    newToday: number;
    conversionRate: number;
    activeWorkshops: number;
  };
  children: React.ReactNode;
}

const navItems: { key: AdminSection; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { key: 'leads', label: 'Leads', icon: <Gauge className="w-4 h-4" /> },
  { key: 'profiles', label: 'Profiles', icon: <Users className="w-4 h-4" /> },
  { key: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  { key: 'workshops', label: 'Workshops', icon: <BookOpen className="w-4 h-4" /> },
  { key: 'brochures', label: 'Brochures', icon: <FileText className="w-4 h-4" /> },
  { key: 'exercises', label: 'Exercises', icon: <ClipboardList className="w-4 h-4" /> },
  { key: 'assessments', label: 'Assessments', icon: <ClipboardList className="w-4 h-4" /> },
  { key: 'newsletter', label: 'Newsletter', icon: <Newspaper className="w-4 h-4" /> },
  { key: 'learning', label: 'Learning', icon: <BookOpen className="w-4 h-4" /> },
];

export function AdminLayout({ currentSection, onSectionChange, onLogout, userEmail, stats, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-black" />
            <div className="font-medium">AI Workshop — Admin</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 h-max">
          <Card className="p-2">
            <nav className="flex flex-col">
              {navItems.map((item) => {
                const active = currentSection === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onSectionChange(item.key)}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm text-left transition-colors
                    ${active ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>

          {stats && (
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Card className="p-3 text-center">
                <div className="text-lg font-semibold text-gray-900">{stats.totalLeads}</div>
                <div className="text-xs text-gray-500">Total Leads</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-lg font-semibold text-blue-600">{stats.newToday}</div>
                <div className="text-xs text-gray-500">New Today</div>
              </Card>
            </div>
          )}
        </aside>

        {/* Content */}
        <main className="min-h-[70vh]">{children}</main>
      </div>
    </div>
  );
}
