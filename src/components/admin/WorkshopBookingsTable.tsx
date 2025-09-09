import React from 'react';
import { ResponsiveTable, Column } from './ResponsiveTable';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface WorkshopBooking {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  phone?: string;
  position?: string;
  team_size?: number;
  workshop_type: string;
  preferred_date?: string;
  preferred_time?: string;
  language: string;
  location_preference?: string;
  message?: string;
  budget_range?: string;
  status: 'draft' | 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

interface WorkshopBookingsTableProps {
  bookings: WorkshopBooking[];
  loading?: boolean;
  onViewDetails?: (item: any) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onStatusChange?: (id: string, status: WorkshopBooking['status']) => void;
  selectedItems?: Set<string>;
  onSelectItem?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  selectAll?: boolean;
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
  const columns: Column[] = [
    {
      key: 'created_at',
      label: 'Date',
      width: 'w-28',
      sortable: true,
      sortValue: (row: any) => new Date(row.created_at).getTime(),
      render: (value: string) => new Date(value).toLocaleDateString('en-GB'),
      alwaysVisible: true,
    },
    {
      key: 'name',
      label: 'Name',
      width: 'w-48',
      sortable: true,
      sortValue: (row: any) => (row.first_name || '') + ' ' + (row.last_name || ''),
      render: (_: any, row: any) => `${row.first_name} ${row.last_name}`.trim(),
      alwaysVisible: true,
    },
    {
      key: 'email',
      label: 'Email',
      width: 'w-56',
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
      width: 'w-40',
      sortable: true,
      render: (v: string) => v || '-',
    },
    {
      key: 'workshop_type',
      label: 'Workshop',
      width: 'w-40',
      sortable: true,
    },
    {
      key: 'preferred_date',
      label: 'Pref. Date',
      width: 'w-28',
      sortable: true,
      sortValue: (row: any) => row.preferred_date ? new Date(row.preferred_date).getTime() : 0,
      render: (v: string) => v ? new Date(v).toLocaleDateString('en-GB') : '-',
    },
    {
      key: 'preferred_time',
      label: 'Time',
      width: 'w-20',
      sortable: true,
      render: (v: string) => v || '-',
    },
    {
      key: 'language',
      label: 'Lang',
      width: 'w-20',
      sortable: true,
      render: (v: string) => <Badge variant="outline">{(v || '').toUpperCase()}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      width: 'w-40',
      sortable: true,
      render: (value: WorkshopBooking['status'], row: WorkshopBooking) => (
        <div className="flex items-center gap-2">
          <Badge variant={value === 'confirmed' ? 'default' : value === 'pending' ? 'secondary' : 'outline'}>
            {value}
          </Badge>
          {onStatusChange && (
            <Select value={value} onValueChange={(v) => onStatusChange(row.id, v as WorkshopBooking['status'])}>
              <SelectTrigger className="h-7 w-[120px]">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      )
    },
  ];

  return (
    <ResponsiveTable
      title="Workshop Bookings"
      subtitle="Manage workshop bookings and registrations"
      columns={columns}
      data={bookings}
      loading={loading}
      storageKey="rt:workshop_bookings"
      onViewDetails={onViewDetails}
      onExport={onExport}
      onRefresh={onRefresh}
      selectedItems={selectedItems}
      onSelectItem={onSelectItem}
      onSelectAll={onSelectAll}
      selectAll={selectAll}
      initialPageSize={20}
    />
  );
}
