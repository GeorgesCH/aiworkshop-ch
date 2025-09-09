import React from 'react';
import { ResponsiveTable } from './ResponsiveTable';
import { Badge } from '../ui/badge';

interface GenericTableProps {
  title: string;
  subtitle?: string;
  data: any[];
  loading?: boolean;
  onViewDetails?: (item: any) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  selectedItems?: Set<string>;
  onSelectItem?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  selectAll?: boolean;
  columns: Array<{
    key: string;
    label: string;
    width?: string;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
}

function formatDate(iso: string) {
  try { 
    return new Date(iso).toLocaleString('en-GB'); 
  } catch { 
    return iso; 
  }
}

export function GenericTable({
  title,
  subtitle,
  data,
  loading = false,
  onViewDetails,
  onExport,
  onRefresh,
  selectedItems = new Set(),
  onSelectItem,
  onSelectAll,
  selectAll = false,
  columns
}: GenericTableProps) {
  return (
    <ResponsiveTable
      title={title}
      subtitle={subtitle}
      columns={columns}
      data={data}
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
