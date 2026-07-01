import { useState, useMemo } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel,
  getFilteredRowModel, flexRender,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
// already fixed
import type { Prospect } from '../types';
import { STATUS_LABEL, SOURCE_LABEL, FACULTY_LABEL, STATUS_COLOR } from '../types';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Download, AlertTriangle, Flame } from 'lucide-react';

interface Props {
  prospects: Prospect[];
  onSelect: (p: Prospect) => void;
}

export default function ProspectTable({ prospects, onSelect }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [rankFilter, setRankFilter] = useState('');
  const [dupeOnly, setDupeOnly] = useState(false);

  const filtered = useMemo(() => prospects.filter(p => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (sourceFilter && p.source !== sourceFilter) return false;
    if (facultyFilter && p.faculty !== facultyFilter) return false;
    if (rankFilter && p.highSchool.rank !== rankFilter) return false;
    if (dupeOnly && !p.isDuplicate) return false;
    if (globalFilter) {
      const q = globalFilter.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.highSchool.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
    }
    return true;
  }), [prospects, statusFilter, sourceFilter, facultyFilter, rankFilter, dupeOnly, globalFilter]);

  const heatColor = (s: number) => s >= 75 ? 'text-red-500' : s >= 50 ? 'text-orange-400' : s >= 25 ? 'text-yellow-400' : 'text-slate-300';

  const columns: ColumnDef<Prospect>[] = [
    {
      id: 'name', accessorKey: 'name', header: '氏名',
      cell: ({ row: { original: p } }) => (
        <div className="flex items-center gap-2">
          {p.isDuplicate && <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />}
          <button onClick={() => onSelect(p)} className="text-indigo-600 hover:underline font-medium text-left">{p.name}</button>
        </div>
      ),
    },
    { id: 'highSchool', accessorFn: p => p.highSchool.name, header: '高校',
      cell: ({ row: { original: p } }) => (
        <span className="text-sm">{p.highSchool.name} <span className="text-xs text-slate-400">({p.highSchool.rank})</span></span>
      )
    },
    { id: 'status', accessorKey: 'status', header: 'ステータス',
      cell: ({ getValue }) => {
        const v = getValue() as Prospect['status'];
        return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[v]}`}>{STATUS_LABEL[v]}</span>;
      }
    },
    { id: 'heatScore', accessorKey: 'heatScore', header: '熱量',
      cell: ({ getValue }) => {
        const v = getValue() as number;
        return <span className={`flex items-center gap-1 font-bold text-sm ${heatColor(v)}`}><Flame size={12} />{v}</span>;
      }
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
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const exportCSV = () => {
    const headers = ['ID', '氏名', 'メール', '電話', '高校', '偏差値ランク', 'ステータス', '熱量', '志望学部', '獲得経路', '卒業年', '担当', '登録日'];
    const rows = filtered.map(p => [p.id, p.name, p.email, p.phone, p.highSchool.name, p.highSchool.rank, STATUS_LABEL[p.status], p.heatScore, FACULTY_LABEL[p.faculty], SOURCE_LABEL[p.source], p.graduationYear, p.assignedTo, p.createdAt]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'house_list.csv';
    a.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Filter bar */}
      <div className="p-4 border-b flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input value={globalFilter} onChange={e => setGlobalFilter(e.target.value)}
            placeholder="氏名・高校名・メールで検索..." className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </div>
        <Select value={statusFilter} onChange={setStatusFilter} label="ステータス" options={Object.entries(STATUS_LABEL).map(([k, v]) => ({ value: k, label: v }))} />
        <Select value={sourceFilter} onChange={setSourceFilter} label="獲得経路" options={Object.entries(SOURCE_LABEL).map(([k, v]) => ({ value: k, label: v }))} />
        <Select value={facultyFilter} onChange={setFacultyFilter} label="志望学部" options={Object.entries(FACULTY_LABEL).map(([k, v]) => ({ value: k, label: v }))} />
        <Select value={rankFilter} onChange={setRankFilter} label="偏差値ランク" options={['S', 'A', 'B', 'C', 'D'].map(r => ({ value: r, label: `${r}ランク` }))} />
        <label className="flex items-center gap-1.5 text-sm text-red-600 cursor-pointer">
          <input type="checkbox" checked={dupeOnly} onChange={e => setDupeOnly(e.target.checked)} className="accent-red-500" />
          重複疑いのみ
        </label>
        <button onClick={exportCSV} className="flex items-center gap-1.5 text-sm px-3 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 ml-auto">
          <Download size={14} /> CSV出力
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b bg-slate-50">
                {hg.headers.map(h => (
                  <th key={h.id} className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                    <button onClick={h.column.getToggleSortingHandler()} className="flex items-center gap-1 hover:text-slate-800">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === 'asc' ? <ChevronUp size={12} /> : h.column.getIsSorted() === 'desc' ? <ChevronDown size={12} /> : <ChevronsUpDown size={11} className="text-slate-300" />}
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className={`border-b hover:bg-slate-50 transition-colors ${row.original.isDuplicate ? 'bg-red-50/40' : ''}`}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-slate-600">
        <span>{filtered.length}件中 {table.getState().pagination.pageIndex * 15 + 1}〜{Math.min((table.getState().pagination.pageIndex + 1) * 15, filtered.length)}件を表示</span>
        <div className="flex items-center gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-slate-50">前へ</button>
          <span>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-slate-50">次へ</button>
        </div>
      </div>
    </div>
  );
}

function Select({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-slate-600">
      <option value="">{label}：すべて</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
