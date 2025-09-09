import React from 'react';
import { ResponsiveTable, Column } from './ResponsiveTable';

interface GenericTableProps {
  title: string;
  subtitle?: string;
  data: any[];
  loading?: boolean;
  columns: Column[];
  storageKey?: string;
  onViewDetails?: (item: any) => void;
  onDeleteItem?: (item: any) => void;
  onDeleteSelected?: (items: any[]) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  selectedItems?: Set<string>;
  onSelectItem?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  selectAll?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  initialPageSize?: number;
}

export function GenericTable({
  title,
  subtitle,
  data,
  loading = false,
  columns,
  storageKey,
  onViewDetails,
  onDeleteItem,
  onDeleteSelected,
  onExport,
  onRefresh,
  selectedItems = new Set(),
  onSelectItem,
  onSelectAll,
  selectAll = false,
  searchable = true,
  filterable = true,
  pagination = true,
  initialPageSize = 10,
}: GenericTableProps) {
  return (
    <ResponsiveTable
      title={title}
      subtitle={subtitle}
      columns={columns}
      data={data}
      loading={loading}
      storageKey={storageKey}
      onViewDetails={onViewDetails}
      onDeleteItem={onDeleteItem}
      onDeleteSelected={onDeleteSelected}
      onExport={onExport}
      onRefresh={onRefresh}
      selectedItems={selectedItems}
      onSelectItem={onSelectItem}
      onSelectAll={onSelectAll}
      selectAll={selectAll}
      searchable={searchable}
      filterable={filterable}
      pagination={pagination}
      initialPageSize={initialPageSize}
    />
  );
}
