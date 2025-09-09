import React, { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { ResponsiveTable, Column } from './ResponsiveTable';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { BarChart3, Activity, TrendingUp, Users } from 'lucide-react';
import { ChartContainer, ChartTooltip, type ChartConfig } from '../ui/chart';
import { BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart as RLineChart, Line } from 'recharts@2.15.2';
import { learnCourseModules } from '../learn/courseMap';
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
  updateWorkshopBookingStatus,
  getAdminLearningProgress,
} from '../../utils/supabaseApi';

// Types

type AdminSection = 'dashboard' | 'analytics' | 'leads' | 'profiles' | 'contact' | 'workshops' | 'brochures' | 'exercises' | 'assessments' | 'newsletter' | 'learning';

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

interface LeadActivity {
  type: string;
  date: string;
  value: number;
  details: any;
}

interface LeadProfile {
  key: string; // unique key for map
  email?: string;
  name: string;
  company?: string;
  phone?: string;
  position?: string;
  activities: LeadActivity[];
  lastActivity: string;
  totalValue: number;
  engagementScore: number; // 0-100
  leadQuality: 'Hot' | 'Warm' | 'Cool' | 'Cold';
  leadSource: string;
  conversionProbability: number; // 5-95
}

export function AdminDashboard() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [me, setMe] = useState<{ email: string } | null>(null);
  const [error, setError] = useState<string>('');
  const [currentSection, setCurrentSection] = useState<AdminSection>('workshops');

  // Data state
  const [workshopBookings, setWorkshopBookings] = useState<any[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [brochureRequests, setBrochureRequests] = useState<any[]>([]);
  const [exerciseResponses, setExerciseResponses] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<any[]>([]);
  const [learningProgress, setLearningProgress] = useState<any[]>([]);
  const [learningSummary, setLearningSummary] = useState<Record<string, { total: number; completed: number; avgPct: number }>>({});

  // Loading
  const [workshopBookingsLoading, setWorkshopBookingsLoading] = useState(false);
  const [contactSubmissionsLoading, setContactSubmissionsLoading] = useState(false);
  const [brochureRequestsLoading, setBrochureRequestsLoading] = useState(false);
  const [exerciseResponsesLoading, setExerciseResponsesLoading] = useState(false);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);
  const [newsletterSubscribersLoading, setNewsletterSubscribersLoading] = useState(false);
  const [learningProgressLoading, setLearningProgressLoading] = useState(false);

  // Selection
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Dialog
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  // ===== Profiles (Leads) – Filters/Controls State (global to obey hooks rules) =====
  const [profileSearch, setProfileSearch] = useState('');
  const [qualityFilter, setQualityFilter] = useState<'all' | 'Hot' | 'Warm' | 'Cool' | 'Cold'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'Workshop' | 'Contact Form' | 'Brochure' | 'Assessment' | 'Exercise' | 'Newsletter'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'recent' | 'activities'>('score');
  const [withCompanyOnly, setWithCompanyOnly] = useState(false);

  // Auth
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

  // Loaders
  const loadWorkshopBookings = async () => {
    setWorkshopBookingsLoading(true);
    try {
      const response = await getAdminWorkshopBookings();
      if (response.success && response.data) {
        setWorkshopBookings(response.data.bookings || []);
      }
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
    } finally {
      setNewsletterSubscribersLoading(false);
    }
  };

  const loadLearningProgress = async () => {
    setLearningProgressLoading(true);
    try {
      const response = await getAdminLearningProgress();
      if (response.success && response.data) {
        setLearningProgress(response.data.rows || []);
      }
    } catch (err) {
    } finally {
      setLearningProgressLoading(false);
    }
  };

  // Status update
  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const response = await updateWorkshopBookingStatus(id, status);
      if (response.success) {
        setWorkshopBookings(prev =>
          prev.map(booking => (booking.id === id ? { ...booking, status } : booking))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Selection helpers
  const handleSelectItem = (id: string, selected: boolean) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (selected) next.add(id); else next.delete(id);
      return next;
    });
  };
  const handleSelectAll = (selected: boolean) => {
    const source = currentSection === 'workshops' ? workshopBookings : [];
    setSelectedItems(selected ? new Set(source.map((x: any) => x.id)) : new Set());
    setSelectAll(selected);
  };

  const exportCsv = () => {
    console.log('Export triggered');
  };

  const loadAll = () => {
    switch (currentSection) {
      case 'workshops':
        loadWorkshopBookings(); break;
      case 'contact':
        loadContactSubmissions(); break;
      case 'brochures':
        loadBrochureRequests(); break;
      case 'exercises':
        loadExerciseResponses(); break;
      case 'assessments':
        loadAssessments(); break;
      case 'newsletter':
        loadNewsletterSubscribers(); break;
      case 'learning':
        (async () => {
          setLearningProgressLoading(true);
          try {
            const response = await getAdminLearningProgress();
            if (response.success && response.data) {
              setLearningProgress(response.data.rows || []);
              setLearningSummary(response.data.summary || {});
            }
          } finally {
            setLearningProgressLoading(false);
          }
        })();
        break;
      case 'leads':
      case 'profiles':
      case 'dashboard':
        loadWorkshopBookings();
        loadContactSubmissions();
        loadBrochureRequests();
        loadExerciseResponses();
        loadAssessments();
        loadNewsletterSubscribers();
        break;
    }
  };

  useEffect(() => { loadAll(); }, [currentSection]);

  // =====================
  // Lead Profiles Builder
  // =====================
  const leadProfiles: LeadProfile[] = useMemo(() => {
    const map = new Map<string, LeadProfile>();

    const inferType = (lead: any): string => {
      if (lead.workshop_type) return 'Workshop Booking';
      if (lead.message) return 'Contact Submission';
      if (lead.position || lead.specific_interests) return 'Brochure Request';
      if (lead.exercise_type) return 'Exercise Response';
      if (typeof lead.is_active === 'boolean') return 'Newsletter Subscription';
      return 'Assessment';
    };

    const valueByType: Record<string, number> = {
      'Workshop Booking': 50,
      'Contact Submission': 30,
      'Brochure Request': 20,
      'Assessment': 40,
      'Exercise Response': 25,
      'Newsletter Subscription': 10,
    };

    const sourceByType: Record<string, string> = {
      'Workshop Booking': 'Workshop',
      'Contact Submission': 'Contact Form',
      'Brochure Request': 'Brochure',
      'Assessment': 'Assessment',
      'Exercise Response': 'Exercise',
      'Newsletter Subscription': 'Newsletter',
    };

    const addLead = (lead: any) => {
      const rawEmail = (lead.email || '').trim();
      const email = rawEmail ? rawEmail.toLowerCase() : undefined;
      const key = email || `session:${lead.user_session_id || lead.id}`;
      const type = inferType(lead);
      const activityValue = valueByType[type] || 0;
      const created = lead.created_at || new Date().toISOString();

      if (!map.has(key)) {
        map.set(key, {
          key,
          email,
          name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || lead.name || 'Anonymous',
          company: lead.company,
          phone: lead.phone,
          position: lead.position,
          activities: [],
          lastActivity: created,
          totalValue: 0,
          engagementScore: 0,
          leadQuality: 'Cold',
          leadSource: sourceByType[type] || 'Unknown',
          conversionProbability: 5,
        });
      }

      const profile = map.get(key)!;

      // Prefer richer data when available
      if (!profile.company && lead.company) profile.company = lead.company;
      if (!profile.position && lead.position) profile.position = lead.position;
      if ((!profile.name || profile.name === 'Anonymous') && (lead.first_name || lead.last_name || lead.name)) {
        profile.name = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || lead.name || profile.name;
      }

      profile.leadSource = profile.leadSource === 'Unknown' ? (sourceByType[type] || 'Unknown') : profile.leadSource;

      profile.activities.push({ type, date: created, value: activityValue, details: lead });
      profile.totalValue += activityValue;
      if (created > profile.lastActivity) profile.lastActivity = created;
    };

    [...workshopBookings, ...contactSubmissions, ...brochureRequests, ...exerciseResponses, ...assessments, ...newsletterSubscribers].forEach(addLead);

    // Score + classify
    map.forEach((p) => {
      // Base on total value
      let score = Math.min(100, p.totalValue);

      // Recency bonus (7d/30d)
      const daysSince = Math.floor((Date.now() - new Date(p.lastActivity).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince <= 7) score += 10; else if (daysSince <= 30) score += 5; else if (daysSince > 120) score -= 5;

      // Frequency bonus
      if (p.activities.length >= 5) score += 15; else if (p.activities.length >= 3) score += 10; else if (p.activities.length >= 2) score += 5;

      // Company signal
      if (p.company && p.company.trim() !== '') score += 5;

      p.engagementScore = Math.max(0, Math.min(100, score));

      if (p.engagementScore >= 80) p.leadQuality = 'Hot';
      else if (p.engagementScore >= 60) p.leadQuality = 'Warm';
      else if (p.engagementScore >= 30) p.leadQuality = 'Cool';
      else p.leadQuality = 'Cold';

      p.conversionProbability = Math.min(95, Math.max(5, Math.round(p.engagementScore)));
    });

    // Default sort by score desc
    return Array.from(map.values()).sort((a, b) => b.engagementScore - a.engagementScore);
  }, [workshopBookings, contactSubmissions, brochureRequests, exerciseResponses, assessments, newsletterSubscribers]);

  // Filtered profiles for the profiles section
  const filteredProfiles = useMemo(() => {
    const q = profileSearch.trim().toLowerCase();
    let arr = [...leadProfiles];
    if (q) {
      arr = arr.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.company && p.company.toLowerCase().includes(q))
      );
    }
    if (qualityFilter !== 'all') arr = arr.filter(p => p.leadQuality === qualityFilter);
    if (sourceFilter !== 'all') arr = arr.filter(p => p.leadSource === sourceFilter);
    if (withCompanyOnly) arr = arr.filter(p => p.company && p.company.trim() !== '');

    if (sortBy === 'recent') arr.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
    else if (sortBy === 'activities') arr.sort((a, b) => b.activities.length - a.activities.length);
    else arr.sort((a, b) => b.engagementScore - a.engagementScore);

    return arr;
  }, [leadProfiles, profileSearch, qualityFilter, sourceFilter, withCompanyOnly, sortBy]);

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
              <input type="email" id="email" name="email" required className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black placeholder-gray-400 font-light" placeholder="Email" />
            </div>
            <div>
              <input type="password" id="password" name="password" required className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black placeholder-gray-400 font-light" placeholder="Password" />
            </div>
            <button type="submit" className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none transition-colors font-light">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // Stats
  const stats = {
    totalLeads:
      workshopBookings.length +
      contactSubmissions.length +
      brochureRequests.length +
      exerciseResponses.length +
      assessments.length +
      newsletterSubscribers.length,
    newToday:
      workshopBookings.filter(b => new Date(b.created_at).toDateString() === new Date().toDateString()).length +
      contactSubmissions.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length,
    conversionRate: (workshopBookings.filter(b => b.status === 'confirmed').length / Math.max(workshopBookings.length, 1)) * 100,
    activeWorkshops: workshopBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
  };

  // Column builders using schema
  const columnsBySection: Record<AdminSection, Column[] | null> = {
    dashboard: null,
    analytics: null,
    leads: [
      {
        key: 'created_at',
        label: 'Date',
        sortable: true,
        sortValue: (row: any) => new Date(row.created_at).getTime(),
        render: (v: string) => new Date(v).toLocaleDateString('en-GB'),
        alwaysVisible: true,
      },
      { key: 'type', label: 'Type', sortable: true, render: (v: string) => <Badge variant="secondary">{v}</Badge> },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true, render: (v: string) => <a className="text-primary hover:underline" href={`mailto:${v}`}>{v}</a> },
      { key: 'company', label: 'Company', sortable: true, render: (v: string) => v || '' },
      { key: 'source', label: 'Source', sortable: true, render: (v: string) => <Badge variant="outline">{v}</Badge> },
      { key: 'status', label: 'Status', sortable: true, render: (v: string) => <Badge variant={v === 'confirmed' || v === 'active' || v === 'completed' ? 'default' : 'secondary'}>{v}</Badge> },
    ],
    profiles: null,
    contact: [
      { key: 'created_at', label: 'Date', sortable: true, sortValue: (r: any) => new Date(r.created_at).getTime(), render: (v: string) => new Date(v).toLocaleDateString('en-GB'), alwaysVisible: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true, render: (v: string) => <a className="text-primary hover:underline" href={`mailto:${v}`}>{v}</a> },
      { key: 'company', label: 'Company', sortable: true, render: (v: string) => v || '' },
      { key: 'phone', label: 'Phone', sortable: true, render: (v: string) => v || '' },
      { key: 'service', label: 'Service', sortable: true, render: (v: string) => v || '' },
      { key: 'form_type', label: 'Form', sortable: true, render: (v: string) => <Badge variant="outline">{(v || '').replace('_',' ')}</Badge> },
      { key: 'message', label: 'Message', render: (v: string) => <div className="max-w-xs truncate">{v || ''}</div> },
    ],
    workshops: [
      { key: 'created_at', label: 'Date', sortable: true, sortValue: (r: any) => new Date(r.created_at).getTime(), render: (v: string) => new Date(v).toLocaleDateString('en-GB'), alwaysVisible: true },
      { key: 'name', label: 'Name', sortable: true, sortValue: (r: any) => (r.first_name || '') + ' ' + (r.last_name || ''), render: (_: any, row: any) => `${row.first_name} ${row.last_name}` },
      { key: 'email', label: 'Email', sortable: true, render: (v: string) => <a className="text-primary hover:underline" href={`mailto:${v}`}>{v}</a> },
      { key: 'company', label: 'Company', sortable: true, render: (v: string) => v || '' },
      { key: 'workshop_type', label: 'Workshop', sortable: true },
      { key: 'preferred_date', label: 'Pref. Date', sortable: true, sortValue: (r: any) => r.preferred_date ? new Date(r.preferred_date).getTime() : 0, render: (v: string) => v ? new Date(v).toLocaleDateString('en-GB') : '' },
      { key: 'preferred_time', label: 'Time', sortable: true, render: (v: string) => v || '' },
      { key: 'language', label: 'Lang', sortable: true, render: (v: string) => <Badge variant="outline">{(v || '').toUpperCase()}</Badge> },
      { key: 'location_preference', label: 'Location', sortable: true, render: (v: string) => v || '' },
      { key: 'budget_range', label: 'Budget', sortable: true, render: (v: string) => v || '' },
      { key: 'status', label: 'Status', sortable: true, render: (v: string, row: any) => <Badge variant={v === 'confirmed' ? 'default' : v === 'pending' ? 'secondary' : 'outline'}>{v}</Badge> },
    ],
    brochures: [
      { key: 'created_at', label: 'Date', sortable: true, sortValue: (r: any) => new Date(r.created_at).getTime(), render: (v: string) => new Date(v).toLocaleDateString('en-GB'), alwaysVisible: true },
      { key: 'name', label: 'Name', sortable: true, sortValue: (r: any) => (r.first_name || '') + ' ' + (r.last_name || ''), render: (_: any, row: any) => `${row.first_name} ${row.last_name}` },
      { key: 'email', label: 'Email', sortable: true, render: (v: string) => <a className="text-primary hover:underline" href={`mailto:${v}`}>{v}</a> },
      { key: 'company', label: 'Company', sortable: true, render: (v: string) => v || '' },
      { key: 'position', label: 'Position', sortable: true, render: (v: string) => v || '' },
      { key: 'team_size', label: 'Team Size', sortable: true, render: (v: any) => v || '' },
      { key: 'city', label: 'City', sortable: true, render: (v: string) => v || '' },
      { key: 'industry', label: 'Industry', sortable: true, render: (v: string) => v || '' },
      { key: 'specific_interests', label: 'Interests', render: (v: string) => <div className="max-w-xs truncate">{v || ''}</div> },
    ],
    exercises: [
      { key: 'created_at', label: 'Date', sortable: true, sortValue: (r: any) => new Date(r.created_at).getTime(), render: (v: string) => new Date(v).toLocaleDateString('en-GB'), alwaysVisible: true },
      { key: 'name', label: 'Name', sortable: true, sortValue: (r: any) => (r.first_name || '') + ' ' + (r.last_name || ''), render: (_: any, row: any) => `${row.first_name || ''} ${row.last_name || ''}`.trim() || '' },
      { key: 'email', label: 'Email', sortable: true, render: (v: string) => v ? <a className="text-primary hover:underline" href={`mailto:${v}`}>{v}</a> : '' },
      { key: 'exercise_type', label: 'Exercise', sortable: true, render: (v: string) => <Badge variant="outline">{v}</Badge> },
      { key: 'completion_percentage', label: 'Progress', sortable: true, render: (v: number = 0) => (<div className="flex items-center gap-2"><div className="w-16 bg-gray-200 rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${v || 0}%` }} /></div><span className="text-sm">{v || 0}%</span></div>) },
    ],
    assessments: [
      { key: 'created_at', label: 'Date', sortable: true, sortValue: (r: any) => new Date(r.created_at).getTime(), render: (v: string) => new Date(v).toLocaleDateString('en-GB'), alwaysVisible: true },
      { key: 'email', label: 'Email', sortable: true, render: (v: string) => v ? <a className="text-primary hover:underline" href={`mailto:${v}`}>{v}</a> : '' },
      { key: 'user_session_id', label: 'Session ID', sortable: true, render: (v: string) => v ? <div className="max-w-24 truncate text-xs">{v}</div> : '' },
      { key: 'completion_status', label: 'Status', sortable: true, render: (v: string) => <Badge variant={v === 'completed' ? 'default' : v === 'in_progress' ? 'secondary' : 'outline'}>{(v || '').replace('_',' ')}</Badge> },
      { key: 'completion_percentage', label: 'Completion', sortable: true, render: (v: number = 0) => <Badge variant={v === 100 ? 'default' : 'secondary'}>{v || 0}%</Badge> },
      { key: 'time_spent_minutes', label: 'Time Spent', sortable: true, render: (v: number) => v ? `${v} min` : '' },
    ],
    newsletter: [
      { key: 'created_at', label: 'Date', sortable: true, sortValue: (r: any) => new Date(r.created_at).getTime(), render: (v: string) => new Date(v).toLocaleDateString('en-GB'), alwaysVisible: true },
      { key: 'name', label: 'Name', sortable: true, render: (_: any, row: any) => row.first_name && row.last_name ? `${row.first_name} ${row.last_name}` : 'Subscriber' },
      { key: 'email', label: 'Email', sortable: true, render: (v: string) => <a className="text-primary hover:underline" href={`mailto:${v}`}>{v}</a> },
      { key: 'company', label: 'Company', sortable: true, render: (v: string) => v || '' },
      { key: 'subscription_source', label: 'Source', sortable: true, render: (v: string) => <Badge variant="outline">{v || 'Unknown'}</Badge> },
      { key: 'is_active', label: 'Status', sortable: true, render: (v: boolean) => <Badge variant={v ? 'default' : 'secondary'}>{v ? 'Active' : 'Inactive'}</Badge> },
      { key: 'preferences', label: 'Preferences', render: (v: any) => v ? <div className="max-w-32 truncate text-xs">{JSON.stringify(v).substring(0, 20)}…</div> : '' },
    ],
    learning: [
      { key: 'last_visited_at', label: 'Last Visited', sortable: true, sortValue: (r: any) => new Date(r.last_visited_at || r.updated_at || r.created_at).getTime(), render: (v: string, r: any) => new Date(r.last_visited_at || r.updated_at || r.created_at).toLocaleDateString('en-GB'), alwaysVisible: true },
      { key: 'module_key', label: 'Module', sortable: true },
      { key: 'status', label: 'Status', sortable: true, render: (v: string) => <Badge variant={v === 'completed' ? 'default' : v === 'in_progress' ? 'secondary' : 'outline'}>{v || 'not_started'}</Badge> },
      { key: 'percentage', label: 'Progress', sortable: true, render: (v: number = 0) => <Badge variant={v === 100 ? 'default' : 'secondary'}>{v || 0}%</Badge> },
      { key: 'user_id', label: 'User', sortable: false, render: (v: string) => v ? <div className="max-w-32 truncate text-xs">{v}</div> : '' },
    ],
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
              <Button className="flex items-center gap-2">
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
          </div>
        );
      case 'dashboard':
        return (
          <div className="space-y-8">
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
          </div>
        );
      case 'workshops':
      case 'contact':
      case 'brochures':
      case 'exercises':
      case 'assessments':
      case 'newsletter': {
        const columns = columnsBySection[currentSection] as Column[];
        const dataset =
          currentSection === 'workshops' ? workshopBookings :
          currentSection === 'contact' ? contactSubmissions :
          currentSection === 'brochures' ? brochureRequests :
          currentSection === 'exercises' ? exerciseResponses :
          currentSection === 'assessments' ? assessments :
          newsletterSubscribers;
        const loading =
          currentSection === 'workshops' ? workshopBookingsLoading :
          currentSection === 'contact' ? contactSubmissionsLoading :
          currentSection === 'brochures' ? brochureRequestsLoading :
          currentSection === 'exercises' ? exerciseResponsesLoading :
          currentSection === 'assessments' ? assessmentsLoading :
          newsletterSubscribersLoading;

        return (
          <ResponsiveTable
            title={
              currentSection === 'workshops' ? 'Workshop Bookings' :
              currentSection === 'contact' ? 'Contact Submissions' :
              currentSection === 'brochures' ? 'Brochure Requests' :
              currentSection === 'exercises' ? 'Exercise Responses' :
              currentSection === 'assessments' ? 'Assessments' :
              'Newsletter Subscribers'
            }
            subtitle={
              currentSection === 'workshops' ? 'Manage workshop registrations and track attendance' :
              currentSection === 'contact' ? 'Manage and respond to customer inquiries' :
              currentSection === 'brochures' ? 'Manage brochure download requests' :
              currentSection === 'exercises' ? 'Manage exercise submissions and track progress' :
              currentSection === 'assessments' ? 'Manage assessment completions and results' :
              'Manage newsletter subscribers and subscriptions'
            }
            columns={columns}
            data={dataset}
            loading={loading}
            storageKey={`rt:${currentSection}`}
            onViewDetails={(item) => { setSelectedEntry(item); setDetailsDialogOpen(true); }}
            onDeleteItem={(item) => console.log('Delete item', item)}
            onDeleteSelected={(items) => console.log('Delete selected', items)}
            onRefresh={() => loadAll()}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            selectAll={selectAll}
            initialPageSize={20}
          />
        );
      }
      case 'learning': {
        // Build chart data
        const moduleOrder = learnCourseModules.map(m => m.id);
        const moduleLabels: Record<string, string> = Object.fromEntries(learnCourseModules.map(m => [m.id, m.title]));
        const barData = moduleOrder.map(id => ({
          module: moduleLabels[id] || id,
          completed: learningSummary[id]?.completed || 0,
          avgPct: learningSummary[id]?.avgPct || 0,
        }));

        // completions per day (last 14 days)
        const days: { date: string; label: string }[] = Array.from({ length: 14 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (13 - i));
          const date = d.toISOString().slice(0, 10);
          const label = d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
          return { date, label };
        });
        const dailyMap: Record<string, number> = Object.fromEntries(days.map(d => [d.date, 0]));
        learningProgress.forEach((r: any) => {
          if (r.status === 'completed') {
            const dt = (r.completed_at || r.last_visited_at || r.updated_at || r.created_at || '').slice(0, 10);
            if (dailyMap[dt] !== undefined) dailyMap[dt] += 1;
          }
        });
        const dailyData = days.map(d => ({ day: d.label, count: dailyMap[d.date] || 0 }));

        // funnel by module step (distinct users with any progress on module)
        const usersByModule: Record<string, Set<string>> = {};
        learningProgress.forEach((r: any) => {
          if (!r.user_id) return;
          const key = r.module_key;
          usersByModule[key] = usersByModule[key] || new Set<string>();
          usersByModule[key].add(r.user_id);
        });
        const funnelData = moduleOrder.map((id, idx) => ({ step: idx + 1, label: moduleLabels[id] || id, users: (usersByModule[id]?.size) || 0 }));

        const chartConfig: ChartConfig = {
          completed: { label: 'Completed', color: 'hsl(142, 76%, 36%)' },
          avgPct: { label: 'Avg %', color: 'hsl(221, 83%, 53%)' },
          count: { label: 'Completions', color: 'hsl(221, 83%, 53%)' },
          users: { label: 'Users', color: 'hsl(27, 96%, 61%)' },
        };

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-4">
                <div className="text-sm text-gray-500 mb-2">Completions by Module</div>
                <ChartContainer config={chartConfig} className="h-56">
                  <RBarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="module" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip />
                    <Bar dataKey="completed" fill="var(--color-completed)" />
                  </RBarChart>
                </ChartContainer>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-500 mb-2">Daily Completions (14d)</div>
                <ChartContainer config={chartConfig} className="h-56">
                  <RLineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip />
                    <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={false} />
                  </RLineChart>
                </ChartContainer>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-500 mb-2">Funnel by Step</div>
                <ChartContainer config={chartConfig} className="h-56">
                  <RBarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="step" />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip />
                    <Bar dataKey="users" fill="var(--color-users)" />
                  </RBarChart>
                </ChartContainer>
              </Card>
            </div>

            <ResponsiveTable
              title={'Learning Progress'}
              subtitle={'Track learning module completion and progress'}
              columns={columnsBySection.learning as Column[]}
              data={learningProgress}
              loading={learningProgressLoading}
              storageKey={`rt:learning`}
              onViewDetails={(item) => { setSelectedEntry(item); setDetailsDialogOpen(true); }}
              onDeleteItem={(item) => console.log('Delete item', item)}
              onDeleteSelected={(items) => console.log('Delete selected', items)}
              onRefresh={() => loadAll()}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onSelectAll={handleSelectAll}
              selectAll={selectAll}
              initialPageSize={20}
            />
          </div>
        );
      }
      case 'leads': {
        const unified = [
          ...workshopBookings.map(b => ({
            id: `workshop-${b.id}`,
            type: 'Workshop Booking',
            name: `${b.first_name} ${b.last_name}`,
            email: b.email,
            company: b.company,
            created_at: b.created_at,
            status: b.status,
            source: 'Workshop',
          })),
          ...contactSubmissions.map(c => ({
            id: `contact-${c.id}`,
            type: 'Contact Submission',
            name: c.name || '',
            email: c.email,
            company: c.company,
            created_at: c.created_at,
            status: 'submitted',
            source: 'Contact Form',
          })),
          ...brochureRequests.map(r => ({
            id: `brochure-${r.id}`,
            type: 'Brochure Request',
            name: `${r.first_name} ${r.last_name}`,
            email: r.email,
            company: r.company,
            created_at: r.created_at,
            status: 'requested',
            source: 'Brochure',
          })),
          ...exerciseResponses.map(e => ({
            id: `exercise-${e.id}`,
            type: 'Exercise Response',
            name: `${e.first_name || ''} ${e.last_name || ''}`.trim(),
            email: e.email,
            company: e.company,
            created_at: e.created_at,
            status: e.completion_status || 'in_progress',
            source: 'Exercise',
          })),
          ...assessments.map(a => ({
            id: `assessment-${a.id}`,
            type: 'Assessment',
            name: `${a.first_name || ''} ${a.last_name || ''}`.trim(),
            email: a.email,
            company: a.company,
            created_at: a.created_at,
            status: a.completion_status || 'completed',
            source: 'Assessment',
          })),
          ...newsletterSubscribers.map(n => ({
            id: `newsletter-${n.id}`,
            type: 'Newsletter Subscription',
            name: `${n.first_name || ''} ${n.last_name || ''}`.trim() || 'Subscriber',
            email: n.email,
            company: n.company,
            created_at: n.created_at,
            status: n.is_active ? 'active' : 'inactive',
            source: 'Newsletter',
          })),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return (
          <ResponsiveTable
            title="All Leads"
            subtitle="Comprehensive view of all lead data across all sources"
            columns={columnsBySection.leads as Column[]}
            data={unified}
            loading={
              workshopBookingsLoading ||
              contactSubmissionsLoading ||
              brochureRequestsLoading ||
              exerciseResponsesLoading ||
              assessmentsLoading ||
              newsletterSubscribersLoading
            }
            storageKey="rt:leads"
            onViewDetails={(item) => { setSelectedEntry(item); setDetailsDialogOpen(true); }}
            onRefresh={() => loadAll()}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            selectAll={selectAll}
            initialPageSize={20}
          />
        );
      }
      case 'profiles': {
        // Summary counts
        const hotLeads = leadProfiles.filter(p => p.leadQuality === 'Hot').length;
        const warmLeads = leadProfiles.filter(p => p.leadQuality === 'Warm').length;
        const coolLeads = leadProfiles.filter(p => p.leadQuality === 'Cool').length;
        const coldLeads = leadProfiles.filter(p => p.leadQuality === 'Cold').length;


        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-light text-black tracking-wide mb-2">Lead Profiles</h3>
                  <p className="text-gray-500 font-light">Unified lead profiles with scoring, filters, and quick actions</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const csvData = 'Name,Email,Company,Lead Quality,Engagement Score,Activities Count,Last Activity,Lead Source,Conversion Probability\n' +
                        filteredProfiles.map(p => `${p.name},${p.email || ''},${p.company || ''},${p.leadQuality},${p.engagementScore},${p.activities.length},${new Date(p.lastActivity).toLocaleDateString()},${p.leadSource},${p.conversionProbability}%`).join('\n');
                      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement('a');
                      const url = URL.createObjectURL(blob);
                      link.setAttribute('href', url);
                      link.setAttribute('download', 'lead-profiles.csv');
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => loadAll()}>Refresh</Button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                <div className="md:col-span-2">
                  <input
                    value={profileSearch}
                    onChange={(e) => setProfileSearch(e.target.value)}
                    placeholder="Search name, email, company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <select
                    value={qualityFilter}
                    onChange={(e) => setQualityFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="all">All qualities</option>
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cool">Cool</option>
                    <option value="Cold">Cold</option>
                  </select>
                </div>
                <div>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="all">All sources</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Contact Form">Contact Form</option>
                    <option value="Brochure">Brochure</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Exercise">Exercise</option>
                    <option value="Newsletter">Newsletter</option>
                  </select>
                </div>
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="score">Sort by score</option>
                    <option value="recent">Sort by recent</option>
                    <option value="activities">Sort by activities</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={withCompanyOnly}
                    onChange={(e) => setWithCompanyOnly(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  With company only
                </label>
                <div className="text-xs text-gray-400">{filteredProfiles.length} results</div>
              </div>

              {/* Lead Analytics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              </div>

              <div className="space-y-4">
                {filteredProfiles.map((profile) => (
                  <div key={profile.key} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
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
                            <p className="mb-1">{profile.email || ''}</p>
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
                ))}
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const pageContent = (<div>{renderContent()}</div>);

  return (
    <>
      <AdminLayout
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onLogout={logout}
        userEmail={me!.email}
        stats={stats}
        children={pageContent}
      />

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Entry Details</DialogTitle>
            <DialogDescription>Complete information for this entry</DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Name</p>
                  <p>{selectedEntry.first_name || ''} {selectedEntry.last_name || selectedEntry.name || ''}</p>
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
                  minute: '2-digit',
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
