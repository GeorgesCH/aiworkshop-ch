import React from 'react';
import { ResponsiveTable } from './ResponsiveTable';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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

interface WorkshopBookingsTableProps {
  bookings: WorkshopBooking[];
  loading?: boolean;
  onViewDetails?: (booking: WorkshopBooking) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onStatusChange?: (id: string, status: string) => void;
  selectedItems?: Set<string>;
  onSelectItem?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  selectAll?: boolean;
}

function formatDate(iso: string) {
  try { 
    return new Date(iso).toLocaleString('en-GB'); 
  } catch { 
    return iso; 
  }
}

function getStatusBadge(status: string) {
  const colors = {
    draft: 'bg-gray-100 text-gray-600 border-gray-200',
    pending: 'bg-gray-100 text-gray-600 border-gray-200',
    confirmed: 'bg-black text-white border-black',
    cancelled: 'bg-gray-100 text-gray-400 border-gray-200'
  };

  return (
    <span className={`px-2 py-1 text-xs font-light rounded border ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
}

export function WorkshopBookingsTable({
  bookings,
  loading = false,
  onViewDetails,
  onExport,
  onRefresh,
  onStatusChange,
  selectedItems = new Set(),
  onSelectItem,
  onSelectAll,
  selectAll = false
}: WorkshopBookingsTableProps) {
  const columns = [
    {
      key: 'created_at',
      label: 'Date',
      width: 'w-32',
      render: (value: string) => (
        <span className="whitespace-nowrap text-sm">{formatDate(value)}</span>
      )
    },
    {
      key: 'name',
      label: 'Name',
      width: 'w-48',
      render: (value: any, row: WorkshopBooking) => (
        <div className="max-w-48 truncate">
          {row.first_name} {row.last_name}
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      width: 'w-48',
      render: (value: string) => (
        <a 
          href={`mailto:${value}`} 
          className="text-black hover:text-gray-600 underline max-w-48 truncate block font-light"
        >
          {value}
        </a>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      width: 'w-32',
      render: (value: string) => (
        <span className="whitespace-nowrap">{value || '-'}</span>
      )
    },
    {
      key: 'company',
      label: 'Company',
      width: 'w-40',
      render: (value: string) => (
        <span className="max-w-40 truncate">{value || '-'}</span>
      )
    },
    {
      key: 'position',
      label: 'Position',
      width: 'w-32',
      render: (value: string) => (
        <span className="max-w-32 truncate">{value || '-'}</span>
      )
    },
    {
      key: 'team_size',
      label: 'Team Size',
      width: 'w-24',
      render: (value: number) => (
        <span className="text-center">{value || '-'}</span>
      )
    },
    {
      key: 'workshop_type',
      label: 'Workshop',
      width: 'w-32',
      render: (value: string) => (
        <span className="px-2 py-1 text-xs font-light rounded border border-gray-200 bg-gray-50 text-gray-600 max-w-32 truncate">
          {value}
        </span>
      )
    },
    {
      key: 'preferred_date',
      label: 'Date',
      width: 'w-32',
      render: (value: string) => (
        <span className="whitespace-nowrap text-sm">{value || '-'}</span>
      )
    },
    {
      key: 'preferred_time',
      label: 'Time',
      width: 'w-24',
      render: (value: string) => (
        <span className="whitespace-nowrap">{value || '-'}</span>
      )
    },
    {
      key: 'language',
      label: 'Language',
      width: 'w-20',
      render: (value: string) => (
        <span className="px-2 py-1 text-xs font-light rounded border border-gray-200 bg-gray-50 text-gray-600">
          {value.toUpperCase()}
        </span>
      )
    },
    {
      key: 'location_preference',
      label: 'Location',
      width: 'w-32',
      render: (value: string) => (
        <span className="max-w-32 truncate">{value || '-'}</span>
      )
    },
    {
      key: 'budget_range',
      label: 'Budget',
      width: 'w-32',
      render: (value: string) => (
        <span className="max-w-32 truncate">{value || '-'}</span>
      )
    },
    {
      key: 'message',
      label: 'Message',
      width: 'w-48',
      render: (value: string) => (
        <span className="max-w-48 truncate text-sm">{value || '-'}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: 'w-32',
      render: (value: string, row: WorkshopBooking) => (
        <Select value={value} onValueChange={(newStatus) => onStatusChange?.(row.id, newStatus)}>
          <SelectTrigger className="w-32 h-8 text-xs border-gray-200 font-light">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      )
    }
  ];

  return (
    <ResponsiveTable
      title="Workshop Bookings"
      subtitle="Manage workshop bookings and registrations"
      columns={columns}
      data={bookings}
      loading={loading}
      onViewDetails={onViewDetails}
      onExport={onExport}
      onRefresh={onRefresh}
      selectedItems={selectedItems}
      onSelectItem={onSelectItem}
      onSelectAll={onSelectAll}
      selectAll={selectAll}
    />
  );
}
