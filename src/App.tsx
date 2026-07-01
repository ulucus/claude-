import { useState, useEffect, useCallback } from 'react';
import type { Prospect, Goal, FilterState } from './types';
import { DEFAULT_FILTER } from './types';
import { mockProspects } from './data/mockData';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import KpiBar from './components/kpi/KpiBar';
import FunnelChart from './components/charts/FunnelChart';
import SourceConversionChart from './components/charts/SourceConversionChart';
import RankHeatChart from './components/charts/RankHeatChart';
import MonthlyTrendChart from './components/charts/MonthlyTrendChart';
import ProspectTable from './components/table/ProspectTable';
import DetailPanel from './components/detail/DetailPanel';
import { X } from 'lucide-react';

type Tab = 'dashboard' | 'list' | 'settings';

const FILTER_KEY = 'house_list_filter';
const GOAL_KEY = 'house_list_goal';

function loadFilter(): FilterState {
  try { return { ...DEFAULT_FILTER, ...JSON.parse(localStorage.getItem(FILTER_KEY) ?? '{}') }; }
  catch { return DEFAULT_FILTER; }
}
function loadGoal(): Goal {
  try { return { applied: 80, enrolled: 50, ...JSON.parse(localStorage.getItem(GOAL_KEY) ?? '{}') }; }
  catch { return { applied: 80, enrolled: 50 }; }
}

export default function App() {
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [selected, setSelected] = useState<Prospect | null>(null);
  const [filter, setFilter] = useState<FilterState>(loadFilter);
  const [goal, setGoal] = useState<Goal>(loadGoal);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState<Goal>(goal);

  useEffect(() => { localStorage.setItem(FILTER_KEY, JSON.stringify(filter)); }, [filter]);
  useEffect(() => { localStorage.setItem(GOAL_KEY, JSON.stringify(goal)); }, [goal]);

  const handleSave = useCallback((updated: Prospect) => {
    setProspects(prev => prev.map(p => p.id === updated.id ? updated : p));
  }, []);

  const handleBulkStatus = useCallback((ids: string[], status: Prospect['status']) => {
    setProspects(prev => prev.map(p => ids.includes(p.id) ? { ...p, status } : p));
  }, []);

  const handleDupeFilter = useCallback(() => {
    setFilter(f => ({ ...f, dupeOnly: true }));
    setTab('list');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={tab} onChange={setTab} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6">

          {(tab === 'dashboard' || tab === 'list') && (
            <KpiBar prospects={prospects} goal={goal}
              onDupeFilter={handleDupeFilter}
              onEditGoal={() => { setGoalDraft(goal); setEditingGoal(true); }} />
          )}

          {tab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FunnelChart prospects={prospects} />
              <SourceConversionChart prospects={prospects} />
              <RankHeatChart prospects={prospects} />
              <MonthlyTrendChart prospects={prospects} />
            </div>
          )}

          {tab === 'list' && (
            <div>
              <h2 className="text-sm font-bold text-slate-600 mb-3">ハウスリスト一覧</h2>
              <ProspectTable
                prospects={prospects}
                filter={filter}
                onFilterChange={setFilter}
                onSelect={setSelected}
                onBulkStatusChange={handleBulkStatus} />
            </div>
          )}

          {tab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-md">
              <h2 className="text-base font-bold text-slate-700 mb-4">目標設定</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">出願目標（実人数）</label>
                  <input type="number" value={goal.applied}
                    onChange={e => setGoal(g => ({ ...g, applied: Number(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">入学確定目標（実人数）</label>
                  <input type="number" value={goal.enrolled}
                    onChange={e => setGoal(g => ({ ...g, enrolled: Number(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <p className="text-xs text-slate-400">変更は自動保存されます。</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 詳細スライドオーバー */}
      <DetailPanel prospect={selected} onClose={() => setSelected(null)} onSave={handleSave} />

      {/* 目標編集モーダル（KPIバーから） */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">目標設定</h3>
              <button onClick={() => setEditingGoal(false)}><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-600 font-medium block mb-1">出願目標（実人数）</label>
                <input type="number" value={goalDraft.applied}
                  onChange={e => setGoalDraft(d => ({ ...d, applied: Number(e.target.value) }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium block mb-1">入学確定目標（実人数）</label>
                <input type="number" value={goalDraft.enrolled}
                  onChange={e => setGoalDraft(d => ({ ...d, enrolled: Number(e.target.value) }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditingGoal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">キャンセル</button>
              <button onClick={() => { setGoal(goalDraft); setEditingGoal(false); }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
