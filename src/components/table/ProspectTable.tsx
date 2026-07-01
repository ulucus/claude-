import { useMemo, useState } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getPaginationRowModel, flexRender,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { ChevronUp, ChevronDown, ChevronsUpDown, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Prospect, FilterState } from '../../types';
import { SOURCE_LABEL, FACULTY_LABEL, STATUS_LABEL } from '../../types';
import Badge from '../ui/Badge';
import HeatScore from '../ui/HeatScore';
import FilterBar from './FilterBar';
import { buildCsv, downloadCsv } from '../../utils/csv';

interface Props {
  prospects: Prospect[];
  filter: FilterState;
  onFilterChange: (f: FilterState) => void;
  onSelect: (p: Prospect) => void;
  onBulkStatusChange: (ids: string[], status: Prospect['status']) => void;
}

export default function ProspectTable({ prospects, filter, onFilterChange, onSelect, onBulkStatusChange }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => prospects.filter(p => {
    if (filter.status && p.status !== filter.status) return false;
    if (filter.source && p.source !== filter.source) return false;
    if (filter.faculty && p.faculty !== filter.faculty) return false;
    if (filter.rank && p.highSchool.rank !== filter.rank) return false;
    if (filter.assignedTo && p.assignedTo !== filter.assignedTo) return false;
    if (filter.dupeOnly && !p.isDuplicate) return false;
    if (filter.query) {
      const q = filter.query.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.highSchool.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
    }
    return true;
  }), [prospects, filter]);

  const columns: ColumnDef<Prospect>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input type="checkbox" className="w-3.5 h-3.5 accent-indigo-600"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()} />
      ),
      cell: ({ row }) => (
        <input type="checkbox" className="w-3.5 h-3.5 accent-indigo-600"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={e => e.stopPropagation()} />
      ),
      enableSorting: false,
      size: 32,
    },
    {
      id: 'name', accessorKey: 'name', header: '氏名',
      cell: ({ row: { original: p } }) => (
        <div className="flex items-center gap-1.5">
          {p.isDuplicate && <AlertTriangle size={11} className="text-red-400 flex-shrink-0" />}
          <button onClick={() => onSelect(p)} className="text-indigo-600 hover:underline font-medium text-left whitespace-nowrap">
            {p.name}
          </button>
        </div>
      ),
    },
    {
      id: 'highSchool', accessorFn: p => p.highSchool.name, header: '高校',
      cell: ({ row: { original: p } }) => (
        <span className="text-sm whitespace-nowrap">
          {p.highSchool.name} <span className="text-xs text-slate-400">({p.highSchool.rank})</span>
        </span>
      ),
    },
    {
      id: 'status', accessorKey: 'status', header: 'ステータス',
      cell: ({ getValue }) => <Badge status={getValue() as Prospect['status']} />,
    },
    {
      id: 'heatScore', accessorKey: 'heatScore', header: '熱量',
      cell: ({ getValue }) => <HeatScore score={getValue() as number} />,
    },
    { id: 'faculty', accessorFn: p => FACULTY_LABEL[p.faculty], header: '志望学部' },
    { id: 'source', accessorFn: p => SOURCE_LABEL[p.source], header: '獲得経路' },
    { id: 'graduationYear', accessorKey: 'graduationYear', header: '卒業年' },
    { id: 'assignedTo', accessorKey: 'assignedTo', header: '担当' },
    { id: 'createdAt', accessorKey: 'createdAt', header: '登録日' },
  ];

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, rowSelection: Object.fromEntries([...selected].map(id => [filtered.findIndex(p => p.id === id), true])) },
    onSortingChange: setSorting,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const selectedProspects = filtered.filter(p => selected.has(p.id));

  const handleCsv = () => {
    const headers = ['ID', '氏名', 'メール', '電話', '高校', 'ランク', '偏差値', 'ステータス', '熱量', '志望学部', '獲得経路', '卒業年', '担当', '登録日', '重複'];
    const rows = filtered.map(p => [p.id, p.name, p.email, p.phone, p.highSchool.name, p.highSchool.rank, p.highSchool.deviationScore, STATUS_LABEL[p.status], p.heatScore, FACULTY_LABEL[p.faculty], SOURCE_LABEL[p.source], p.graduationYear, p.assignedTo, p.createdAt, p.isDuplicate ? '重複疑い' : '']);
    downloadCsv('house_list.csv', buildCsv(headers, rows));
  };

  const { pageIndex, pageSize } = table.getState().pagination;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, filtered.length);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
      <FilterBar filter={filter} onChange={onFilterChange} onCsvExport={handleCsv}
        filteredCount={filtered.length} totalCount={prospects.length} />

      {/* 一括操作バー */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border-b border-indigo-100 text-sm">
          <span className="text-indigo-700 font-medium">{selected.size}件選択中</span>
          <select defaultValue=""
            onChange={e => {
              if (e.target.value) {
                onBulkStatusChange([...selected], e.target.value as Prospect['status']);
                setSelected(new Set());
                e.target.value = '';
              }
            }}
            className="border border-indigo-200 rounded px-2 py-1 text-xs bg-white text-slate-700">
            <option value="">ステータスを一括変更...</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button onClick={() => setSelected(new Set())} className="text-xs text-slate-500 hover:text-slate-700">解除</button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-slate-100 bg-slate-50">
                {hg.headers.map(h => (
                  <th key={h.id} className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                    {h.column.getCanSort() ? (
                      <button onClick={h.column.getToggleSortingHandler()} className="flex items-center gap-1 hover:text-slate-800">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === 'asc' ? <ChevronUp size={11} /> : h.column.getIsSorted() === 'desc' ? <ChevronDown size={11} /> : <ChevronsUpDown size={10} className="text-slate-300" />}
                      </button>
                    ) : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              const p = row.original;
              const isSel = selected.has(p.id);
              return (
                <tr key={row.id}
                  className={clsx(
                    'border-b border-slate-50 hover:bg-slate-50 transition-colors',
                    p.isDuplicate && !isSel && 'bg-red-50/50 border-l-2 border-l-red-300',
                    isSel && 'bg-indigo-50/60',
                  )}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      {cell.column.id === 'select' ? (
                        <input type="checkbox" className="w-3.5 h-3.5 accent-indigo-600"
                          checked={isSel}
                          onChange={() => setSelected(prev => {
                            const n = new Set(prev);
                            if (n.has(p.id)) n.delete(p.id); else n.add(p.id);
                            return n;
                          })} />
                      ) : flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500">
        <span>{filtered.length > 0 ? `${start}〜${end}件 / 全${filtered.length}件` : '0件'}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
            className="p-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
            <ChevronLeft size={14} />
          </button>
          <span className="px-2">{pageIndex + 1} / {table.getPageCount() || 1}</span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
            className="p-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* suppress unused var warning */}
      {selectedProspects.length === 0 && null}
    </div>
  );
}
