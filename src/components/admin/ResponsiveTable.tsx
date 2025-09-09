import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import {
  Eye,
  Download,
  Trash2,
  MoreVertical,
  RefreshCw,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  AlertTriangle,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  sortValue?: (row: any) => any;
  alwaysVisible?: boolean;
}

interface ResponsiveTableProps {
  title: string;
  subtitle?: string;
  columns: Column[];
  data: any[];
  loading?: boolean;
  onViewDetails?: (item: any) => void;
  onDeleteItem?: (item: any) => void;
  onDeleteSelected?: (items: any[]) => void;
  onExport?: () => void; // If not provided, a CSV of the current view is generated
  onRefresh?: () => void;
  selectedItems?: Set<string>;
  onSelectItem?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void; // If absent, header checkbox toggles visible rows
  selectAll?: boolean; // Controlled by parent when provided
  searchable?: boolean;
  filterable?: boolean; // Reserved for future filters panel
  pagination?: boolean; // default true
  initialPageSize?: number; // default 10
  storageKey?: string;
}

export function ResponsiveTable({
  title,
  subtitle,
  columns,
  data,
  loading = false,
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
  storageKey,
}: ResponsiveTableProps) {
  const prefsKey = storageKey || `rt:${title || 'table'}`;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [columnsDialogOpen, setColumnsDialogOpen] = useState(false);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const allColumnKeys = useMemo(() => columns.map(c => c.key), [columns]);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(allColumnKeys));

  // hydrate prefs
  useEffect(() => {
    try {
      const raw = localStorage.getItem(prefsKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.visibleColumns) setVisibleColumns(new Set(parsed.visibleColumns));
        if (parsed.density === 'compact' || parsed.density === 'comfortable') setDensity(parsed.density);
        if (parsed.pageSize && Number(parsed.pageSize) > 0) setPageSize(Number(parsed.pageSize));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefsKey]);

  useEffect(() => {
    try {
      const payload = {
        visibleColumns: Array.from(visibleColumns),
        density,
        pageSize,
      };
      localStorage.setItem(prefsKey, JSON.stringify(payload));
    } catch {}
  }, [visibleColumns, density, pageSize, prefsKey]);

  // Keep visibleColumns in sync with definitions
  useEffect(() => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      for (const key of allColumnKeys) next.add(key);
      Array.from(next).forEach(k => { if (!allColumnKeys.includes(k)) next.delete(k); });
      return next;
    });
  }, [allColumnKeys.join(',')]);

  // Debounce global search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 200);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const columnMap = useMemo(() => new Map(columns.map(c => [c.key, c])), [columns]);

  // Filter + sort
  const filteredData = useMemo(() => {
    let out = data || [];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      out = out.filter(item =>
        Object.values(item).some(v => v?.toString?.().toLowerCase().includes(q))
      );
    }

    if (sortConfig) {
      const col = columnMap.get(sortConfig.key);
      const dir = sortConfig.direction === 'asc' ? 1 : -1;
      out = [...out].sort((a, b) => {
        const aVal = col?.sortValue ? col.sortValue(a) : a[sortConfig.key];
        const bVal = col?.sortValue ? col.sortValue(b) : b[sortConfig.key];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return -1 * dir;
        if (bVal == null) return 1 * dir;
        if (aVal < bVal) return -1 * dir;
        if (aVal > bVal) return 1 * dir;
        return 0;
      });
    }

    return out;
  }, [data, debouncedSearch, sortConfig, columnMap]);

  // Pagination
  const total = filteredData.length;
  const totalPages = pagination ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const pagedData = useMemo(() => {
    if (!pagination) return filteredData;
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize, pagination]);

  // Handlers
  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete && onDeleteItem) onDeleteItem(itemToDelete);
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleBulkDeleteConfirm = () => {
    if (onDeleteSelected) {
      const selectedData = data.filter(item => selectedItems.has(item.id));
      onDeleteSelected(selectedData);
    }
    setBulkDeleteDialogOpen(false);
  };

  const handleHeaderSelectToggle = (checked: boolean) => {
    if (onSelectAll) return onSelectAll(checked);
    if (!onSelectItem) return;
    const ids = pagedData.map(r => r.id).filter(Boolean);
    ids.forEach(id => onSelectItem(id, checked));
  };

  const handleExport = () => {
    if (onExport) return onExport();
    const visCols = columns.filter(c => visibleColumns.has(c.key));
    const header = visCols.map(c => '"' + c.label.replace(/"/g, '""') + '"').join(',');
    const rows = (pagination ? pagedData : filteredData).map(row =>
      visCols.map(c => {
        const raw = c.render ? (c.render(row[c.key], row) as any) : row[c.key];
        const text = typeof raw === 'string' || typeof raw === 'number' ? String(raw) : '';
        return '"' + text.replace(/"/g, '""') + '"';
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedCount = selectedItems.size;
  const visibleCols = columns.filter(c => visibleColumns.has(c.key));
  const isCompact = density === 'compact';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {selectedCount > 0 && (
            <>
              <Badge variant="secondary">{selectedCount} selected</Badge>
              <Button
                variant="destructive"
                onClick={() => setBulkDeleteDialogOpen(true)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            </>
          )}

          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} className="gap-2" size="sm">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          )}
          <Button variant="outline" onClick={handleExport} className="gap-2" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>

          {/* View / settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings2 className="w-4 h-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setDensity(d => (d === 'compact' ? 'comfortable' : 'compact'))}>
                <div className="flex items-center justify-between w-full">
                  <span>Density</span>
                  <span className="text-xs text-gray-500">{density}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setColumnsDialogOpen(true)}>
                Manage columns…
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search and Filters */}
      {(searchable || filterable) && (
        <Card variant="apple" padding="sm">
          <div className="flex flex-col sm:flex-row gap-3">
            {searchable && (
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search entries…"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (pagination) setPage(1);
                    }}
                    className="pl-10"
                    aria-label="Search entries"
                  />
                </div>
              </div>
            )}
            {filterable && (
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Desktop Table */}
      <Card variant="apple" padding="none" className="overflow-hidden hidden sm:block">
        <div className="overflow-x-auto max-h-[70vh]">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <TableRow className="bg-gray-50/50">
                {onSelectItem && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={(val) => handleHeaderSelectToggle(Boolean(val))}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                )}
                {visibleCols.map((column) => (
                  <TableHead key={column.key} className={`${column.width || 'w-auto'} text-gray-600 font-medium`}>
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                      >
                        {column.label}
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <SortAsc className="w-4 h-4" />
                          ) : (
                            <SortDesc className="w-4 h-4" />
                          )
                        ) : (
                          <div className="w-4 h-4 opacity-30">
                            <SortAsc className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
                <TableHead className="w-24 text-gray-600 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton rows
                Array.from({ length: Math.min(5, pageSize) }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {onSelectItem && <TableCell className="w-12"><div className="h-4 w-4 bg-gray-200 rounded animate-pulse" /></TableCell>}
                    {visibleCols.map(col => (
                      <TableCell key={`sk-${i}-${col.key}`}>
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                    <TableCell className="w-24"><div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : (pagedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleCols.length + (onSelectItem ? 1 : 0) + 1} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Search className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-gray-500">{debouncedSearch ? 'No entries match your search' : 'No data available'}</p>
                      {debouncedSearch && (
                        <Button variant="ghost" onClick={() => setSearchTerm('')}>Clear search</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pagedData.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    className={`transition-colors group hover:bg-gray-50/50 ${isCompact ? 'h-10' : ''}`}
                  >
                    {onSelectItem && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(row.id)}
                          onCheckedChange={(checked) => onSelectItem(row.id, Boolean(checked))}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </TableCell>
                    )}
                    {visibleCols.map((column) => (
                      <TableCell key={column.key} className={`${column.width || 'w-auto'} ${isCompact ? 'py-2' : ''} text-sm text-gray-700`}>
                        {column.render ? column.render(row[column.key], row) : (row[column.key] ?? '-')}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {onViewDetails && (
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => onViewDetails(row)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="More actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onViewDetails && (
                              <DropdownMenuItem onClick={() => onViewDetails(row)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            )}
                            {onDeleteItem && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(row)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer */}
        {pagination && (
          <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm text-gray-600">
            <div>
              Showing <span className="font-medium">{total === 0 ? 0 : (page - 1) * pageSize + 1}</span>–
              <span className="font-medium">{Math.min(page * pageSize, total)}</span> of <span className="font-medium">{total}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-2">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span>Rows:</span>
                <select
                  className="border rounded-md px-2 py-1 text-sm bg-white"
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                >
                  {[5, 10, 20, 50, 100].map(n => <option value={n} key={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Mobile cards */}
      <div className="grid sm:hidden gap-3">
        {loading ? (
          Array.from({ length: Math.min(5, pageSize) }).map((_, i) => (
            <Card key={`m-sk-${i}`} className="p-4">
              <div className="space-y-2 animate-pulse">
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                <div className="h-4 w-1/3 bg-gray-200 rounded" />
              </div>
            </Card>
          ))
        ) : (pagedData.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-500">{debouncedSearch ? 'No entries match your search' : 'No data available'}</p>
              {debouncedSearch && (
                <Button variant="ghost" onClick={() => setSearchTerm('')}>Clear search</Button>
              )}
            </div>
          </Card>
        ) : (
          pagedData.map((row, idx) => (
            <Card key={`m-${row.id || idx}`} className="p-4">
              <div className={`flex flex-col gap-2 ${isCompact ? 'text-sm' : ''}`}>
                {visibleCols.map(c => (
                  <div key={`m-${c.key}`} className="flex items-start justify-between gap-4">
                    <span className="text-gray-500 min-w-[30%]">{c.label}</span>
                    <span className="text-gray-900">{c.render ? c.render(row[c.key], row) : (row[c.key] ?? '-')}</span>
                  </div>
                ))}
                <div className="pt-2 flex items-center gap-2">
                  {onViewDetails && (
                    <Button size="sm" variant="outline" onClick={() => onViewDetails(row)} className="gap-2">
                      <Eye className="w-4 h-4" /> View
                    </Button>
                  )}
                  {onDeleteItem && (
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(row)} className="gap-2">
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Entry
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Multiple Entries
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} selected {selectedCount === 1 ? 'entry' : 'entries'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBulkDeleteConfirm}>Delete {selectedCount} {selectedCount === 1 ? 'Entry' : 'Entries'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Columns manager */}
      <Dialog open={columnsDialogOpen} onOpenChange={setColumnsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage columns</DialogTitle>
            <DialogDescription>Show or hide columns. At least one column must remain visible.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2">
            {columns.map(col => {
              const disabled = col.alwaysVisible === true;
              const checked = visibleColumns.has(col.key);
              return (
                <label key={col.key} className={`flex items-center gap-2 rounded border p-2 ${disabled ? 'opacity-60' : 'cursor-pointer hover:bg-gray-50'}`}>
                  <Checkbox
                    checked={checked}
                    disabled={disabled}
                    onCheckedChange={(val) => {
                      setVisibleColumns(prev => {
                        const next = new Set(prev);
                        if (val) {
                          next.add(col.key);
                        } else {
                          if (next.size === 1) return next; // keep one visible
                          next.delete(col.key);
                        }
                        return next;
                      });
                    }}
                  />
                  <span>{col.label}</span>
                </label>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVisibleColumns(new Set(allColumnKeys))}>Reset</Button>
            <Button onClick={() => setColumnsDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
