import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  LogOut, 
  BarChart3, 
  User, 
  Users, 
  Mail, 
  Calendar, 
  FileText, 
  BookOpen, 
  ClipboardList,
  Newspaper,
  Bell,
  Search,
  Settings
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  userEmail: string;
  stats?: {
    totalLeads: number;
    newToday: number;
    conversionRate: number;
    activeWorkshops: number;
  };
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
  { id: 'profiles', label: 'Lead Profiles', icon: User, badge: null },
  { id: 'leads', label: 'All Leads', icon: Users, badge: null },
  { id: 'contact', label: 'Contact', icon: Mail, badge: null },
  { id: 'workshops', label: 'Workshops', icon: Calendar, badge: null },
  { id: 'brochures', label: 'Brochures', icon: FileText, badge: null },
  { id: 'exercises', label: 'Exercises', icon: BookOpen, badge: null },
  { id: 'assessments', label: 'Assessments', icon: ClipboardList, badge: null },
  { id: 'newsletter', label: 'Newsletter', icon: Newspaper, badge: null },
];

export function AdminLayout({ 
  children, 
  currentSection, 
  onSectionChange, 
  onLogout, 
  userEmail,
  stats 
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Modern Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-apple-sm">
          {/* Logo & Brand */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-apple flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
               <div>
                 <h1 className="text-lg font-semibold text-gray-900 tracking-tight">AI Workshop</h1>
                 <p className="text-xs text-gray-500 font-medium">Admin Dashboard</p>
               </div>
            </div>
            
            {/* Quick Stats */}
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
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`group w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-apple transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-apple-sm'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:scale-102'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" size="sm">{item.badge}</Badge>
                  )}
                </button>
              );
            })}
          </nav>
          
          {/* User Profile & Actions */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Button variant="ghost" size="icon-sm" className="text-gray-500 hover:text-gray-700">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onLogout} 
              className="w-full gap-2 text-gray-700 hover:text-gray-900 border-gray-200 hover:bg-gray-50"
              size="sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-4 h-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                </Button>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-8 bg-gray-50">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
