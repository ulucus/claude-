import { Search, Download, X } from 'lucide-react';
import type { FilterState } from '../../types';
import { STATUS_LABEL, SOURCE_LABEL, FACULTY_LABEL } from '../../types';
import { STAFF_LIST, HS_RANKS } from '../../data/mockData';

interface Props {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  onCsvExport: () => void;
  filteredCount: number;
  totalCount: number;
}

function Sel({ label, value, onChange, options }: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white">
      <option value="">{label}：全て</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export default function FilterBar({ filter, onChange, onCsvExport, filteredCount, totalCount }: Props) {
  const set = (patch: Partial<FilterState>) => onChange({ ...filter, ...patch });
  const activeCount = [filter.status, filter.source, filter.faculty, filter.rank, filter.assignedTo].filter(Boolean).length
    + (filter.dupeOnly ? 1 : 0) + (filter.query ? 1 : 0);

  return (
    <div className="p-3 border-b border-slate-100 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* 検索 */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input value={filter.query} onChange={e => set({ query: e.target.value })}
            placeholder="氏名・高校名・メールで検索..."
            className="w-full pl-8 pr-8 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          {filter.query && (
            <button onClick={() => set({ query: '' })} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* フィルタ群 */}
        <Sel label="ステータス" value={filter.status} onChange={v => set({ status: v as FilterState['status'] })}
          options={Object.entries(STATUS_LABEL).map(([k, v]) => ({ value: k, label: v }))} />
        <Sel label="獲得経路" value={filter.source} onChange={v => set({ source: v as FilterState['source'] })}
          options={Object.entries(SOURCE_LABEL).map(([k, v]) => ({ value: k, label: v }))} />
        <Sel label="志望学部" value={filter.faculty} onChange={v => set({ faculty: v as FilterState['faculty'] })}
          options={Object.entries(FACULTY_LABEL).map(([k, v]) => ({ value: k, label: v }))} />
        <Sel label="ランク" value={filter.rank} onChange={v => set({ rank: v as FilterState['rank'] })}
          options={HS_RANKS.map(r => ({ value: r, label: `${r}ランク` }))} />
        <Sel label="担当者" value={filter.assignedTo} onChange={v => set({ assignedTo: v })}
          options={STAFF_LIST.map(s => ({ value: s, label: s }))} />

        <label className="flex items-center gap-1.5 text-sm text-red-600 cursor-pointer whitespace-nowrap">
          <input type="checkbox" checked={filter.dupeOnly} onChange={e => set({ dupeOnly: e.target.checked })}
            className="accent-red-500 w-3.5 h-3.5" />
          重複のみ
        </label>

        {activeCount > 0 && (
          <button onClick={() => onChange({ query: '', status: '', source: '', faculty: '', rank: '', assignedTo: '', dupeOnly: false })}
            className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1">
            <X size={12} /> フィルタ解除
          </button>
        )}

        <button onClick={onCsvExport}
          className="ml-auto flex items-center gap-1.5 text-sm px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
          <Download size={14} /> CSV出力
        </button>
      </div>

      <div className="text-xs text-slate-400">
        {activeCount > 0 ? (
          <span><span className="text-indigo-600 font-medium">{filteredCount}件</span>を表示中（全{totalCount}件）</span>
        ) : (
          <span>全 {totalCount}件</span>
        )}
      </div>
    </div>
  );
}
