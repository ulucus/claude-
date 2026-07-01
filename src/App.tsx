import { useState } from 'react';
import type { Prospect, Goal } from './types';
import { mockProspects } from './data/mockData';
import KpiCards from './components/KpiCards';
import Charts from './components/Charts';
import ProspectTable from './components/ProspectTable';
import ProspectModal from './components/ProspectModal';
import { GraduationCap, X } from 'lucide-react';

export default function App() {
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects);
  const [selected, setSelected] = useState<Prospect | null>(null);
  const [goal, setGoal] = useState<Goal>({ applied: 80, enrolled: 50 });
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState(goal);

  const handleSave = (updated: Prospect) => {
    setProspects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">学生募集ハウスリスト管理</h1>
            <p className="text-xs text-slate-400">入試課 · {new Date().toLocaleDateString('ja-JP')} 現在</p>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-5 py-6 space-y-6">
        <KpiCards prospects={prospects} goal={goal} onEditGoal={() => { setGoalDraft(goal); setEditingGoal(true); }} />
        <Charts prospects={prospects} />
        <div>
          <h2 className="text-lg font-bold text-slate-700 mb-3">ハウスリスト一覧</h2>
          <ProspectTable prospects={prospects} onSelect={setSelected} />
        </div>
      </main>

      {selected && (
        <ProspectModal prospect={selected} onClose={() => setSelected(null)} onSave={handleSave} />
      )}

      {editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">目標設定</h3>
              <button onClick={() => setEditingGoal(false)}><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 font-medium block mb-1">出願目標（実人数）</label>
                <input type="number" value={goalDraft.applied} onChange={e => setGoalDraft({ ...goalDraft, applied: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium block mb-1">入学確定目標（実人数）</label>
                <input type="number" value={goalDraft.enrolled} onChange={e => setGoalDraft({ ...goalDraft, enrolled: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditingGoal(false)} className="flex-1 px-4 py-2 border rounded-lg text-sm text-slate-600 hover:bg-slate-50">キャンセル</button>
              <button onClick={() => { setGoal(goalDraft); setEditingGoal(false); }} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
