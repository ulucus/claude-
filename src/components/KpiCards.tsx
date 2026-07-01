import type { Prospect, Goal } from '../types';
import { STATUS_LABEL } from '../types';
import { Users, UserCheck, Sparkles, FileText, GraduationCap, XCircle, Target } from 'lucide-react';

interface Props {
  prospects: Prospect[];
  goal: Goal;
  onEditGoal: () => void;
}

export default function KpiCards({ prospects, goal, onEditGoal }: Props) {
  const total = prospects.length;
  const counts = {
    new: prospects.filter(p => p.status === 'new').length,
    contacted: prospects.filter(p => p.status === 'contacted').length,
    interested: prospects.filter(p => p.status === 'interested').length,
    applied: prospects.filter(p => p.status === 'applied').length,
    enrolled: prospects.filter(p => p.status === 'enrolled').length,
    dropped: prospects.filter(p => p.status === 'dropped').length,
  };
  const duplicates = prospects.filter(p => p.isDuplicate).length;
  const convRate = total > 0 ? ((counts.enrolled / total) * 100).toFixed(1) : '0.0';

  const cards = [
    { label: '総件数', value: total, icon: <Users size={20} />, color: 'bg-slate-500', sub: `重複疑い ${duplicates}件` },
    { label: STATUS_LABEL.new, value: counts.new, icon: <Users size={20} />, color: 'bg-gray-400' },
    { label: STATUS_LABEL.contacted, value: counts.contacted, icon: <UserCheck size={20} />, color: 'bg-blue-500' },
    { label: STATUS_LABEL.interested, value: counts.interested, icon: <Sparkles size={20} />, color: 'bg-yellow-500' },
    { label: STATUS_LABEL.applied, value: counts.applied, icon: <FileText size={20} />, color: 'bg-purple-500', sub: `目標 ${goal.applied}件 / 達成率 ${goal.applied > 0 ? Math.round(counts.applied / goal.applied * 100) : 0}%` },
    { label: STATUS_LABEL.enrolled, value: counts.enrolled, icon: <GraduationCap size={20} />, color: 'bg-green-500', sub: `目標 ${goal.enrolled}件 / 達成率 ${goal.enrolled > 0 ? Math.round(counts.enrolled / goal.enrolled * 100) : 0}%` },
    { label: STATUS_LABEL.dropped, value: counts.dropped, icon: <XCircle size={20} />, color: 'bg-red-400' },
    { label: '最終転換率', value: `${convRate}%`, icon: <Target size={20} />, color: 'bg-indigo-500', sub: '総件数→入学確定' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-700">募集進捗サマリー</h2>
        <button onClick={onEditGoal} className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
          <Target size={14} /> 目標設定
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-1">
            <div className={`w-8 h-8 rounded-lg ${c.color} text-white flex items-center justify-center`}>{c.icon}</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{c.value}</div>
            <div className="text-xs font-medium text-slate-500">{c.label}</div>
            {c.sub && <div className="text-xs text-slate-400">{c.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
