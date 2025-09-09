import React, { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { ResponsiveTable } from './ResponsiveTable';
import { AnalyticsDashboard } from '../AnalyticsDashboard';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  Calendar,
  FileText,
  BookOpen,
  ClipboardList,
  Newspaper,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Send,
  Eye,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { 
  adminLogin, 
  adminLogout, 
  verifyAdminToken, 
  getAdminWorkshopBookings,
  getAdminContactSubmissions,
  getAdminBrochureRequests,
  getAdminExerciseResponses,
  getAdminAssessments,
  getAdminNewsletterSubscribers,
  updateWorkshopBookingStatus
} from '../../utils/supabaseApi';

type AdminSection = 'dashboard' | 'analytics' | 'leads' | 'profiles' | 'contact' | 'workshops' | 'brochures' | 'exercises' | 'assessments' | 'newsletter';

interface WorkshopBooking {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  team_size?: number;
  workshop_type: string;
  preferred_date?: string;
  preferred_time?: string;
  language: string;
  location_preference?: string;
  budget_range?: string;
  message?: string;
  status: 'draft' | 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

// Helper functions for CSV generation and download
const generateLeadProfilesCSV = () => {
  const headers = ['Name', 'Email', 'Company', 'Phone', 'Position', 'Lead Quality', 'Engagement Score', 'Activities Count', 'Last Activity', 'Lead Source', 'Conversion Probability'];
  return headers.join(',') + '\n';
};

const generateNewsletterCSV = () => {
  const headers = ['Name', 'Email', 'Company', 'Status', 'Subscribed Date', 'Updated Date'];
  return headers.join(',') + '\n';
};

const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function AdminDashboard() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [me, setMe] = useState<{ email: string } | null>(null);
  const [error, setError] = useState<string>('');
  const [currentSection, setCurrentSection] = useState<AdminSection>('workshops');
  
  // Data state
  const [workshopBookings, setWorkshopBookings] = useState<WorkshopBooking[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [brochureRequests, setBrochureRequests] = useState<any[]>([]);
  const [exerciseResponses, setExerciseResponses] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<any[]>([]);
  
  // Loading state
  const [workshopBookingsLoading, setWorkshopBookingsLoading] = useState(false);
  const [contactSubmissionsLoading, setContactSubmissionsLoading] = useState(false);
  const [brochureRequestsLoading, setBrochureRequestsLoading] = useState(false);
  const [exerciseResponsesLoading, setExerciseResponsesLoading] = useState(false);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);
  const [newsletterSubscribersLoading, setNewsletterSubscribersLoading] = useState(false);
  
  // Selection state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  // Dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const verify = async (tok: string) => {
    try {
      if (verifyAdminToken()) {
        setMe({ email: 'admin@aiworkshop.ch' });
        setError('');
        return true;
      } else {
        throw new Error('not authed');
      }
    } catch {
      setMe(null); 
      setError('');
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      if (token) {
        const ok = await verify(token);
        if (!ok) { 
          localStorage.removeItem('admin_token'); 
          setToken(null); 
        }
      }
    })();
  }, []);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await adminLogin(email, password);
      
      if (response.success && response.data) {
        setToken(response.data.token);
        setMe({ email: response.data.email });
        setError('');
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const logout = () => {
    adminLogout();
    setToken(null);
    setMe(null);
  };

  const loadWorkshopBookings = async () => {
    setWorkshopBookingsLoading(true);
    try {
      const response = await getAdminWorkshopBookings();
      if (response.success && response.data) {
        setWorkshopBookings(response.data.bookings || []);
      }
    } catch (err: any) {
      console.error('Failed to load workshop bookings:', err);
    } finally {
      setWorkshopBookingsLoading(false);
    }
  };

  const loadContactSubmissions = async () => {
    setContactSubmissionsLoading(true);
    try {
      const response = await getAdminContactSubmissions();
      if (response.success && response.data) {
        setContactSubmissions(response.data.submissions || []);
      }
    } catch (err: any) {
      console.error('Failed to load contact submissions:', err);
    } finally {
      setContactSubmissionsLoading(false);
    }
  };

  const loadBrochureRequests = async () => {
    setBrochureRequestsLoading(true);
    try {
      const response = await getAdminBrochureRequests();
      if (response.success && response.data) {
        setBrochureRequests(response.data.requests || []);
      }
    } catch (err: any) {
      console.error('Failed to load brochure requests:', err);
    } finally {
      setBrochureRequestsLoading(false);
    }
  };

  const loadExerciseResponses = async () => {
    setExerciseResponsesLoading(true);
    try {
      const response = await getAdminExerciseResponses();
      if (response.success && response.data) {
        setExerciseResponses(response.data.responses || []);
      }
    } catch (err: any) {
      console.error('Failed to load exercise responses:', err);
    } finally {
      setExerciseResponsesLoading(false);
    }
  };

  const loadAssessments = async () => {
    setAssessmentsLoading(true);
    try {
      const response = await getAdminAssessments();
      if (response.success && response.data) {
        setAssessments(response.data.assessments || []);
      }
    } catch (err: any) {
      console.error('Failed to load assessments:', err);
    } finally {
      setAssessmentsLoading(false);
    }
  };

  const loadNewsletterSubscribers = async () => {
    setNewsletterSubscribersLoading(true);
    try {
      const response = await getAdminNewsletterSubscribers();
      if (response.success && response.data) {
        setNewsletterSubscribers(response.data.subscribers || []);
      }
    } catch (err: any) {
      console.error('Failed to load newsletter subscribers:', err);
    } finally {
      setNewsletterSubscribersLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const response = await updateWorkshopBookingStatus(id, status);
      if (response.success) {
        // Update local state
        setWorkshopBookings(prev => 
          prev.map(booking => 
            booking.id === id ? { ...booking, status } : booking
          )
        );
      }
    } catch (err: any) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSelectItem = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === workshopBookings.length);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(new Set(workshopBookings.map(booking => booking.id)));
    } else {
      setSelectedItems(new Set());
    }
    setSelectAll(selected);
  };

  const exportCsv = () => {
    // CSV export logic here
    console.log('Export CSV');
  };

  const loadAll = () => {
    switch (currentSection) {
      case 'workshops':
        loadWorkshopBookings();
        break;
      case 'contact':
        loadContactSubmissions();
        break;
      case 'brochures':
        loadBrochureRequests();
        break;
      case 'exercises':
        loadExerciseResponses();
        break;
      case 'assessments':
        loadAssessments();
        break;
      case 'newsletter':
        loadNewsletterSubscribers();
        break;
      case 'leads':
      case 'profiles':
        // Load all data for leads and profiles views
        loadWorkshopBookings();
        loadContactSubmissions();
        loadBrochureRequests();
        loadExerciseResponses();
        loadAssessments();
        loadNewsletterSubscribers();
        break;
      case 'dashboard':
        // Load all data for dashboard statistics
        loadWorkshopBookings();
        loadContactSubmissions();
        loadBrochureRequests();
        loadExerciseResponses();
        loadAssessments();
        loadNewsletterSubscribers();
        break;
    }
  };

  useEffect(() => {
    loadAll();
  }, [currentSection]);

  if (!token || !me) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-sm w-full">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light text-black tracking-wide">AI Workshop</h1>
            <p className="text-gray-500 mt-2 font-light">Admin Dashboard</p>
          </div>
          
          {error && (
            <div className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={onLogin} className="space-y-6">
            <div>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black placeholder-gray-400 font-light"
                placeholder="Email"
              />
            </div>
            
            <div>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black placeholder-gray-400 font-light"
                placeholder="Password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none transition-colors font-light"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Delete functionality
  const handleDeleteEntry = async (item: any) => {
    // Implementation would depend on the API endpoints
    console.log('Delete entry:', item);
    // Refresh data after deletion
    loadAll();
  };

  const handleDeleteSelected = async (items: any[]) => {
    // Implementation would depend on the API endpoints  
    console.log('Delete selected entries:', items);
    // Refresh data after deletion
    loadAll();
  };

  const handleViewDetails = (item: any) => {
    setSelectedEntry(item);
    setDetailsDialogOpen(true);
  };

  // Calculate stats
  const stats = {
    totalLeads: workshopBookings.length + contactSubmissions.length + brochureRequests.length + exerciseResponses.length + assessments.length + newsletterSubscribers.length,
    newToday: workshopBookings.filter(b => new Date(b.created_at).toDateString() === new Date().toDateString()).length +
              contactSubmissions.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length,
    conversionRate: workshopBookings.filter(b => b.status === 'confirmed').length / Math.max(workshopBookings.length, 1) * 100,
    activeWorkshops: workshopBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-light text-black tracking-wide">Analytics Dashboard</h2>
                <p className="text-gray-500 font-light">Comprehensive analytics and tracking insights</p>
              </div>
              <Button 
                onClick={() => setAnalyticsOpen(true)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Open Analytics
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Page Views</p>
                    <p className="text-2xl font-light text-black">1,247</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Unique Visitors</p>
                    <p className="text-2xl font-light text-black">892</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conversions</p>
                    <p className="text-2xl font-light text-black">147</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Engagement</p>
                    <p className="text-2xl font-light text-black">68%</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <Card className="p-6">
              <h3 className="text-lg font-light text-black mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setAnalyticsOpen(true)}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  View Full Analytics
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {/* Export analytics data */}}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export Data
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {/* Refresh analytics */}}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
            </Card>
          </div>
        );
        
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                   <div>
                     <p className="text-sm text-gray-500">Total Leads</p>
                     <h2 className="text-2xl font-semibold text-gray-900">{stats.totalLeads}</h2>
                   </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                   <div>
                     <p className="text-sm text-gray-500">New Today</p>
                     <h2 className="text-2xl font-semibold text-gray-900">{stats.newToday}</h2>
                   </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                   <div>
                     <p className="text-sm text-gray-500">Conversion Rate</p>
                     <h2 className="text-2xl font-semibold text-gray-900">{stats.conversionRate.toFixed(1)}%</h2>
                   </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                   <div>
                     <p className="text-sm text-gray-500">Active Workshops</p>
                     <h2 className="text-2xl font-semibold text-gray-900">{stats.activeWorkshops}</h2>
                   </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
             <Card className="p-6">
               <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[...workshopBookings.slice(0, 5)].map(booking => (
                  <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                     <div className="flex-1">
                       <p className="font-medium">{booking.first_name} {booking.last_name}</p>
                       <p className="text-sm text-gray-500">Workshop booking • {new Date(booking.created_at).toLocaleDateString()}</p>
                     </div>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
        
      case 'workshops':
        return (
          <ResponsiveTable
            title="Workshop Bookings"
            subtitle="Manage workshop registrations and track attendance"
            data={workshopBookings}
            loading={workshopBookingsLoading}
            onViewDetails={handleViewDetails}
            onDeleteItem={handleDeleteEntry}
            onDeleteSelected={handleDeleteSelected}
            onExport={exportCsv}
            onRefresh={loadWorkshopBookings}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            selectAll={selectAll}
            columns={[
              {
                key: 'created_at',
                label: 'Date',
                sortable: true,
                render: (value: string) => new Date(value).toLocaleDateString('en-GB')
              },
              {
                key: 'name',
                label: 'Name',
                sortable: true,
                render: (_, row: any) => `${row.first_name} ${row.last_name}`
              },
              {
                key: 'email',
                label: 'Email',
                sortable: true,
                render: (value: string) => (
                  <a href={`mailto:${value}`} className="text-primary hover:underline">
                    {value}
                  </a>
                )
              },
              {
                key: 'phone',
                label: 'Phone',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'company',
                label: 'Company',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'position',
                label: 'Position',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'team_size',
                label: 'Team Size',
                sortable: true,
                render: (value: number) => value || '-'
              },
              {
                key: 'workshop_type',
                label: 'Workshop Type',
                sortable: true
              },
              {
                key: 'preferred_date',
                label: 'Preferred Date',
                sortable: true,
                render: (value: string) => value ? new Date(value).toLocaleDateString('en-GB') : '-'
              },
              {
                key: 'preferred_time',
                label: 'Preferred Time',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'language',
                label: 'Language',
                sortable: true,
                render: (value: string) => (
                  <Badge variant="outline">
                    {value?.toUpperCase()}
                  </Badge>
                )
              },
              {
                key: 'location_preference',
                label: 'Location',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'budget_range',
                label: 'Budget Range',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'status',
                label: 'Status',
                render: (value: string) => (
                  <Badge variant={value === 'confirmed' ? 'default' : value === 'pending' ? 'secondary' : 'outline'}>
                    {value}
                  </Badge>
                )
              }
            ]}
          />
        );
      case 'contact':
        return (
          <ResponsiveTable
            title="Contact Submissions"
            subtitle="Manage and respond to customer inquiries"
            data={contactSubmissions}
            loading={contactSubmissionsLoading}
            onViewDetails={handleViewDetails}
            onDeleteItem={handleDeleteEntry}
            onDeleteSelected={handleDeleteSelected}
            onExport={exportCsv}
            onRefresh={loadContactSubmissions}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            selectAll={selectAll}
            columns={[
              {
                key: 'created_at',
                label: 'Date',
                sortable: true,
                render: (value: string) => new Date(value).toLocaleDateString('en-GB')
              },
              {
                key: 'name',
                label: 'Name',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'email',
                label: 'Email',
                sortable: true,
                render: (value: string) => (
                  <a href={`mailto:${value}`} className="text-primary hover:underline">
                    {value}
                  </a>
                )
              },
              {
                key: 'phone',
                label: 'Phone',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'company',
                label: 'Company',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'service',
                label: 'Service',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'form_type',
                label: 'Form Type',
                sortable: true,
                render: (value: string) => (
                  <Badge variant="outline">
                    {value?.replace('_', ' ')}
                  </Badge>
                )
              },
              {
                key: 'message',
                label: 'Message',
                render: (value: string) => (
                  <div className="max-w-xs truncate">{value || '-'}</div>
                )
              }
            ]}
          />
        );
      case 'brochures':
        return (
          <ResponsiveTable
            title="Brochure Requests"
            subtitle="Manage brochure download requests"
            data={brochureRequests}
            loading={brochureRequestsLoading}
            onViewDetails={handleViewDetails}
            onDeleteItem={handleDeleteEntry}
            onDeleteSelected={handleDeleteSelected}
            onExport={exportCsv}
            onRefresh={loadBrochureRequests}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            selectAll={selectAll}
            columns={[
              {
                key: 'created_at',
                label: 'Date',
                sortable: true,
                render: (value: string) => new Date(value).toLocaleDateString('en-GB')
              },
              {
                key: 'name',
                label: 'Name',
                sortable: true,
                render: (_, row: any) => `${row.first_name} ${row.last_name}`
              },
              {
                key: 'email',
                label: 'Email',
                sortable: true,
                render: (value: string) => (
                  <a href={`mailto:${value}`} className="text-primary hover:underline">
                    {value}
                  </a>
                )
              },
              {
                key: 'company',
                label: 'Company',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'position',
                label: 'Position',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'team_size',
                label: 'Team Size',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'city',
                label: 'City',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'industry',
                label: 'Industry',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'specific_interests',
                label: 'Interests',
                render: (value: string) => (
                  <div className="max-w-xs truncate">{value || '-'}</div>
                )
              }
            ]}
          />
        );
      case 'exercises':
        return (
          <ResponsiveTable
            title="Exercise Responses"
            subtitle="Manage exercise submissions and track progress"
            data={exerciseResponses}
            loading={exerciseResponsesLoading}
            onViewDetails={handleViewDetails}
            onDeleteItem={handleDeleteEntry}
            onDeleteSelected={handleDeleteSelected}
            onExport={exportCsv}
            onRefresh={loadExerciseResponses}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            selectAll={selectAll}
            columns={[
              {
                key: 'created_at',
                label: 'Date',
                sortable: true,
                render: (value: string) => new Date(value).toLocaleDateString('en-GB')
              },
              {
                key: 'name',
                label: 'Name',
                sortable: true,
                render: (_, row: any) => `${row.first_name} ${row.last_name}`
              },
              {
                key: 'email',
                label: 'Email',
                sortable: true,
                render: (value: string) => (
                  <a href={`mailto:${value}`} className="text-primary hover:underline">
                    {value}
                  </a>
                )
              },
              {
                key: 'exercise_type',
                label: 'Exercise',
                sortable: true,
                render: (value: string) => (
                  <Badge variant="outline">
                    {value}
                  </Badge>
                )
              },
              {
                key: 'completion_percentage',
                label: 'Progress',
                sortable: true,
                render: (value: number) => (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${value || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{value || 0}%</span>
                  </div>
                )
              }
            ]}
          />
        );
      case 'assessments':
        return (
          <ResponsiveTable
            title="Assessments"
            subtitle="Manage assessment completions and results"
            data={assessments}
            loading={assessmentsLoading}
            onViewDetails={handleViewDetails}
            onDeleteItem={handleDeleteEntry}
            onDeleteSelected={handleDeleteSelected}
            onExport={exportCsv}
            onRefresh={loadAssessments}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            selectAll={selectAll}
            columns={[
              {
                key: 'created_at',
                label: 'Date',
                sortable: true,
                render: (value: string) => new Date(value).toLocaleDateString('en-GB')
              },
              {
                key: 'email',
                label: 'Email',
                sortable: true,
                render: (value: string) => value ? (
                  <a href={`mailto:${value}`} className="text-primary hover:underline">
                    {value}
                  </a>
                ) : '-'
              },
              {
                key: 'user_session_id',
                label: 'Session ID',
                sortable: true,
                render: (value: string) => value ? (
                  <div className="max-w-24 truncate text-xs">{value}</div>
                ) : '-'
              },
              {
                key: 'completion_status',
                label: 'Status',
                sortable: true,
                render: (value: string) => (
                  <Badge variant={value === 'completed' ? 'default' : value === 'in_progress' ? 'secondary' : 'outline'}>
                    {value?.replace('_', ' ')}
                  </Badge>
                )
              },
              {
                key: 'completion_percentage',
                label: 'Completion',
                sortable: true,
                render: (value: number) => (
                  <Badge variant={value === 100 ? 'default' : 'secondary'}>
                    {value || 0}%
                  </Badge>
                )
              },
              {
                key: 'time_spent_minutes',
                label: 'Time Spent',
                sortable: true,
                render: (value: number) => value ? `${value} min` : '-'
              }
            ]}
          />
        );
      case 'newsletter':
        return (
          <ResponsiveTable
            title="Newsletter Subscribers"
            subtitle="Manage newsletter subscribers and subscriptions"
            data={newsletterSubscribers}
            loading={newsletterSubscribersLoading}
            onViewDetails={handleViewDetails}
            onDeleteItem={handleDeleteEntry}
            onDeleteSelected={handleDeleteSelected}
            onExport={exportCsv}
            onRefresh={loadNewsletterSubscribers}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            selectAll={selectAll}
            columns={[
              {
                key: 'created_at',
                label: 'Date',
                sortable: true,
                render: (value: string) => new Date(value).toLocaleDateString('en-GB')
              },
              {
                key: 'name',
                label: 'Name',
                sortable: true,
                render: (_, row: any) => row.first_name && row.last_name ? `${row.first_name} ${row.last_name}` : 'Newsletter Subscriber'
              },
              {
                key: 'email',
                label: 'Email',
                sortable: true,
                render: (value: string) => (
                  <a href={`mailto:${value}`} className="text-primary hover:underline">
                    {value}
                  </a>
                )
              },
              {
                key: 'company',
                label: 'Company',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'subscription_source',
                label: 'Source',
                sortable: true,
                render: (value: string) => (
                  <Badge variant="outline">
                    {value || 'Unknown'}
                  </Badge>
                )
              },
              {
                key: 'is_active',
                label: 'Status',
                sortable: true,
                render: (value: boolean) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                )
              },
              {
                key: 'preferences',
                label: 'Preferences',
                render: (value: any) => value ? (
                  <div className="max-w-32 truncate text-xs">
                    {JSON.stringify(value).substring(0, 20)}...
                  </div>
                ) : '-'
              }
            ]}
          />
        );
      case 'leads':
        return (
          <ResponsiveTable
            title="All Leads"
            subtitle="Comprehensive view of all lead data across all sources"
            data={[
              ...workshopBookings.map(booking => ({
                id: `workshop-${booking.id}`,
                type: 'Workshop Booking',
                name: `${booking.first_name} ${booking.last_name}`,
                email: booking.email,
                company: booking.company,
                created_at: booking.created_at,
                status: booking.status,
                source: 'Workshop'
              })),
              ...contactSubmissions.map(submission => ({
                id: `contact-${submission.id}`,
                type: 'Contact Submission',
                name: `${submission.first_name} ${submission.last_name}`,
                email: submission.email,
                company: submission.company,
                created_at: submission.created_at,
                status: 'submitted',
                source: 'Contact Form'
              })),
              ...brochureRequests.map(request => ({
                id: `brochure-${request.id}`,
                type: 'Brochure Request',
                name: `${request.first_name} ${request.last_name}`,
                email: request.email,
                company: request.company,
                created_at: request.created_at,
                status: 'requested',
                source: 'Brochure'
              })),
              ...exerciseResponses.map(response => ({
                id: `exercise-${response.id}`,
                type: 'Exercise Response',
                name: `${response.first_name} ${response.last_name}`,
                email: response.email,
                company: response.company,
                created_at: response.created_at,
                status: 'completed',
                source: 'Exercise'
              })),
              ...assessments.map(assessment => ({
                id: `assessment-${assessment.id}`,
                type: 'Assessment',
                name: `${assessment.first_name} ${assessment.last_name}`,
                email: assessment.email,
                company: assessment.company,
                created_at: assessment.created_at,
                status: 'completed',
                source: 'Assessment'
              })),
              ...newsletterSubscribers.map(subscriber => ({
                id: `newsletter-${subscriber.id}`,
                type: 'Newsletter Subscription',
                name: `${subscriber.first_name || ''} ${subscriber.last_name || ''}`.trim() || 'Newsletter Subscriber',
                email: subscriber.email,
                company: subscriber.company,
                created_at: subscriber.created_at,
                status: subscriber.is_active ? 'active' : 'inactive',
                source: 'Newsletter'
              }))
            ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}
            loading={workshopBookingsLoading || contactSubmissionsLoading || brochureRequestsLoading || exerciseResponsesLoading || assessmentsLoading || newsletterSubscribersLoading}
            onViewDetails={handleViewDetails}
            onDeleteItem={handleDeleteEntry}
            onDeleteSelected={handleDeleteSelected}
            onExport={exportCsv}
            onRefresh={() => {
              loadWorkshopBookings();
              loadContactSubmissions();
              loadBrochureRequests();
              loadExerciseResponses();
              loadAssessments();
              loadNewsletterSubscribers();
            }}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            selectAll={selectAll}
            columns={[
              {
                key: 'created_at',
                label: 'Date',
                sortable: true,
                render: (value: string) => new Date(value).toLocaleDateString('en-GB')
              },
              {
                key: 'type',
                label: 'Type',
                sortable: true,
                render: (value: string) => (
                  <Badge variant="secondary" size="sm">
                    {value}
                  </Badge>
                )
              },
              {
                key: 'name',
                label: 'Name',
                sortable: true,
                render: (value: string) => value
              },
              {
                key: 'email',
                label: 'Email',
                sortable: true,
                render: (value: string) => (
                  <a href={`mailto:${value}`} className="text-primary hover:underline">
                    {value}
                  </a>
                )
              },
              {
                key: 'company',
                label: 'Company',
                sortable: true,
                render: (value: string) => value || '-'
              },
              {
                key: 'source',
                label: 'Source',
                sortable: true,
                render: (value: string) => (
                  <Badge variant="outline" size="sm">
                    {value}
                  </Badge>
                )
              },
              {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (value: string) => (
                  <Badge 
                    variant={
                      value === 'confirmed' ? 'default' :
                      value === 'active' ? 'default' :
                      value === 'completed' ? 'apple' : 'secondary'
                    }
                    size="sm"
                  >
                    {value}
                  </Badge>
                )
              }
            ]}
          />
        );
      case 'profiles':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-light text-black tracking-wide mb-2">Lead Profiles</h3>
                  <p className="text-gray-500 font-light">Unified lead profiles with advanced scoring and analytics</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const csvData = generateLeadProfilesCSV();
                      downloadCSV(csvData, 'lead-profiles.csv');
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      loadWorkshopBookings();
                      loadContactSubmissions();
                      loadBrochureRequests();
                      loadExerciseResponses();
                      loadAssessments();
                      loadNewsletterSubscribers();
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              {/* Lead Analytics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {(() => {
                  const leadMap = new Map();
                  [...workshopBookings, ...contactSubmissions, ...brochureRequests, ...exerciseResponses, ...assessments, ...newsletterSubscribers].forEach(lead => {
                    const email = lead.email;
                    if (!leadMap.has(email)) {
                      leadMap.set(email, {
                        email,
                        activities: [],
                        totalValue: 0
                      });
                    }
                    
                    const activityType = lead.workshop_type ? 'Workshop Booking' : 
                                       lead.message ? 'Contact Submission' :
                                       lead.position ? 'Brochure Request' :
                                       lead.exercise_type ? 'Exercise Response' : 
                                       lead.is_active !== undefined ? 'Newsletter Subscription' : 'Assessment';
                    
                    let activityValue = 0;
                    if (activityType === 'Workshop Booking') activityValue = 50;
                    else if (activityType === 'Contact Submission') activityValue = 30;
                    else if (activityType === 'Brochure Request') activityValue = 20;
                    else if (activityType === 'Assessment') activityValue = 40;
                    else if (activityType === 'Exercise Response') activityValue = 25;
                    else if (activityType === 'Newsletter Subscription') activityValue = 10;
                    
                    leadMap.get(email).totalValue += activityValue;
                  });
                  
                  const profiles = Array.from(leadMap.values());
                  const hotLeads = profiles.filter(p => p.totalValue >= 80).length;
                  const warmLeads = profiles.filter(p => p.totalValue >= 50 && p.totalValue < 80).length;
                  const coolLeads = profiles.filter(p => p.totalValue >= 20 && p.totalValue < 50).length;
                  const coldLeads = profiles.filter(p => p.totalValue < 20).length;
                  
                  return (
                    <>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <div className="text-2xl font-light text-red-600 mb-1">{hotLeads}</div>
                        <div className="text-sm text-red-500 font-light">Hot Leads</div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                        <div className="text-2xl font-light text-orange-600 mb-1">{warmLeads}</div>
                        <div className="text-sm text-orange-500 font-light">Warm Leads</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <div className="text-2xl font-light text-blue-600 mb-1">{coolLeads}</div>
                        <div className="text-sm text-blue-500 font-light">Cool Leads</div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <div className="text-2xl font-light text-gray-600 mb-1">{coldLeads}</div>
                        <div className="text-sm text-gray-500 font-light">Cold Leads</div>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              <div className="space-y-4">
                {(() => {
                  // Group leads by email to create unified profiles
                  const leadMap = new Map();
                  
                  [...workshopBookings, ...contactSubmissions, ...brochureRequests, ...exerciseResponses, ...assessments, ...newsletterSubscribers].forEach(lead => {
                    const email = lead.email;
                    if (!leadMap.has(email)) {
                      leadMap.set(email, {
                        email,
                        name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown',
                        company: lead.company,
                        phone: lead.phone,
                        position: lead.position,
                        activities: [],
                        lastActivity: lead.created_at,
                        totalValue: 0,
                        engagementScore: 0,
                        leadQuality: 'Cold',
                        leadSource: 'Unknown',
                        conversionProbability: 0
                      });
                    }
                    
                    const activityType = lead.workshop_type ? 'Workshop Booking' : 
                                       lead.message ? 'Contact Submission' :
                                       lead.position ? 'Brochure Request' :
                                       lead.exercise_type ? 'Exercise Response' : 
                                       lead.is_active !== undefined ? 'Newsletter Subscription' : 'Assessment';
                    
                    // Enhanced activity value calculation
                    let activityValue = 0;
                    if (activityType === 'Workshop Booking') activityValue = 50;
                    else if (activityType === 'Contact Submission') activityValue = 30;
                    else if (activityType === 'Brochure Request') activityValue = 20;
                    else if (activityType === 'Assessment') activityValue = 40;
                    else if (activityType === 'Exercise Response') activityValue = 25;
                    else if (activityType === 'Newsletter Subscription') activityValue = 10;
                    
                    // Determine lead source
                    if (activityType === 'Workshop Booking') leadMap.get(email).leadSource = 'Workshop';
                    else if (activityType === 'Contact Submission') leadMap.get(email).leadSource = 'Contact Form';
                    else if (activityType === 'Brochure Request') leadMap.get(email).leadSource = 'Brochure';
                    else if (activityType === 'Assessment') leadMap.get(email).leadSource = 'Assessment';
                    else if (activityType === 'Exercise Response') leadMap.get(email).leadSource = 'Exercise';
                    else if (activityType === 'Newsletter Subscription') leadMap.get(email).leadSource = 'Newsletter';
                    
                    leadMap.get(email).activities.push({
                      type: activityType,
                      date: lead.created_at,
                      details: lead,
                      value: activityValue
                    });
                    
                    leadMap.get(email).totalValue += activityValue;
                    leadMap.get(email).lastActivity = lead.created_at > leadMap.get(email).lastActivity ? lead.created_at : leadMap.get(email).lastActivity;
                  });
                  
                  // Enhanced lead scoring algorithm
                  leadMap.forEach((profile) => {
                    profile.engagementScore = Math.min(100, profile.totalValue);
                    
                    // Time-based scoring (recent activity gets bonus)
                    const daysSinceLastActivity = Math.floor((Date.now() - new Date(profile.lastActivity).getTime()) / (1000 * 60 * 60 * 24));
                    if (daysSinceLastActivity <= 7) profile.engagementScore += 10;
                    else if (daysSinceLastActivity <= 30) profile.engagementScore += 5;
                    
                    // Activity frequency bonus
                    if (profile.activities.length >= 5) profile.engagementScore += 15;
                    else if (profile.activities.length >= 3) profile.engagementScore += 10;
                    else if (profile.activities.length >= 2) profile.engagementScore += 5;
                    
                    // Company size bonus (if available)
                    const hasCompany = profile.company && profile.company.trim() !== '';
                    if (hasCompany) profile.engagementScore += 5;
                    
                    profile.engagementScore = Math.min(100, profile.engagementScore);
                    
                    // Lead quality classification
                    if (profile.engagementScore >= 80) profile.leadQuality = 'Hot';
                    else if (profile.engagementScore >= 60) profile.leadQuality = 'Warm';
                    else if (profile.engagementScore >= 30) profile.leadQuality = 'Cool';
                    else profile.leadQuality = 'Cold';
                    
                    // Conversion probability estimation
                    profile.conversionProbability = Math.min(95, Math.max(5, profile.engagementScore));
                  });
                  
                  // Sort by engagement score (highest first)
                  const profiles = Array.from(leadMap.values()).sort((a, b) => 
                    b.engagementScore - a.engagementScore
                  );
                  
                  return profiles.map((profile, index) => (
                    <div key={profile.email} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-light text-black">{profile.name}</h4>
                            <span className={`px-2 py-1 text-xs font-light rounded border ${
                              profile.leadQuality === 'Hot' ? 'bg-red-100 text-red-600 border-red-200' :
                              profile.leadQuality === 'Warm' ? 'bg-orange-100 text-orange-600 border-orange-200' :
                              profile.leadQuality === 'Cool' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                              'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              {profile.leadQuality}
                            </span>
                            <span className="px-2 py-1 text-xs font-light rounded border bg-gray-100 text-gray-600 border-gray-200">
                              {profile.leadSource}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500 font-light">
                            <div>
                              <p className="mb-1">{profile.email}</p>
                              {profile.company && <p className="mb-1">{profile.company}</p>}
                              {profile.position && <p className="mb-1">{profile.position}</p>}
                            </div>
                            <div>
                              {profile.phone && <p className="mb-1">{profile.phone}</p>}
                              <p className="text-xs text-gray-400">
                                Last activity: {new Date(profile.lastActivity).toLocaleDateString('en-GB')}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 font-light mb-1">Engagement Score</div>
                          <div className="text-3xl font-light text-black mb-2">{profile.engagementScore}</div>
                          <div className="text-xs text-gray-400 font-light mb-2">
                            {profile.activities.length} activities
                          </div>
                          <div className="text-xs text-gray-500 font-light">
                            {profile.conversionProbability}% conversion probability
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-sm text-gray-500 font-light">Recent Activity Timeline</div>
                        <div className="space-y-2">
                          {profile.activities.slice(0, 5).map((activity, activityIndex) => (
                            <div key={activityIndex} className="flex items-center gap-3 text-sm">
                              <div className={`w-2 h-2 rounded-full ${
                                activity.type === 'Workshop Booking' ? 'bg-red-500' :
                                activity.type === 'Contact Submission' ? 'bg-orange-500' :
                                activity.type === 'Assessment' ? 'bg-blue-500' :
                                activity.type === 'Brochure Request' ? 'bg-green-500' :
                                activity.type === 'Exercise Response' ? 'bg-purple-500' :
                                'bg-gray-400'
                              }`}></div>
                              <span className="font-light flex-1">{activity.type}</span>
                              <span className="text-gray-400 font-light text-xs">
                                {new Date(activity.date).toLocaleDateString('en-GB')}
                              </span>
                              <span className="text-xs text-gray-500 font-light">
                                +{activity.value}pts
                              </span>
                            </div>
                          ))}
                          {profile.activities.length > 5 && (
                            <div className="text-sm text-gray-400 font-light pl-5">
                              +{profile.activities.length - 5} more activities
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="text-sm font-light text-gray-500 mb-2">Workshop Bookings</h3>
                <p className="text-3xl font-light text-black">{workshopBookings.length}</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="text-sm font-light text-gray-500 mb-2">Contact Submissions</h3>
                <p className="text-3xl font-light text-black">{contactSubmissions.length}</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="text-sm font-light text-gray-500 mb-2">Brochure Requests</h3>
                <p className="text-3xl font-light text-black">{brochureRequests.length}</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="text-sm font-light text-gray-500 mb-2">Assessments</h3>
                <p className="text-3xl font-light text-black">{assessments.length}</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="text-sm font-light text-gray-500 mb-2">Newsletter Subscribers</h3>
                <p className="text-3xl font-light text-black">{newsletterSubscribers.length}</p>
              </div>
            </div>
          </div>
        );
    }
  };

   const pageContent = (
     <div>
       {renderContent()}
     </div>
   );

  return (
    <>
      <AdminLayout
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onLogout={logout}
        userEmail={me.email}
        stats={stats}
        children={pageContent}
      />
      
      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Entry Details
            </DialogTitle>
            <DialogDescription>
              Complete information for this entry
            </DialogDescription>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Name</p>
                   <p>{selectedEntry.first_name} {selectedEntry.last_name}</p>
                 </div>
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Email</p>
                   <p>{selectedEntry.email}</p>
                 </div>
              </div>
              
               {selectedEntry.company && (
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Company</p>
                   <p>{selectedEntry.company}</p>
                 </div>
               )}
               
               {selectedEntry.message && (
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Message</p>
                   <div className="bg-gray-50 p-3 rounded-lg">
                     <p>{selectedEntry.message}</p>
                   </div>
                 </div>
               )}
               
               {selectedEntry.workshop_type && (
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Workshop Type</p>
                   <p>{selectedEntry.workshop_type}</p>
                 </div>
               )}
               
               <div>
                 <p className="text-sm text-gray-500 font-medium">Created</p>
                 <p>{new Date(selectedEntry.created_at).toLocaleDateString('en-GB', { 
                   year: 'numeric', 
                   month: 'long', 
                   day: 'numeric',
                   hour: '2-digit',
                   minute: '2-digit'
                 })}</p>
               </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
