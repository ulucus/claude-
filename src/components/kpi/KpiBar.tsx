import { Users, AlertTriangle, FileText, GraduationCap, Target, Sparkles } from 'lucide-react';
import KpiCard from './KpiCard';
import type { Prospect, Goal } from '../../types';

interface Props {
  prospects: Prospect[];
  goal: Goal;
  onDupeFilter: () => void;
  onEditGoal: () => void;
}

export default function KpiBar({ prospects, goal, onDupeFilter, onEditGoal }: Props) {
  const total = prospects.length;
  const dupes = prospects.filter(p => p.isDuplicate).length;
  const applied = prospects.filter(p => p.status === 'applied').length;
  const enrolled = prospects.filter(p => p.status === 'enrolled').length;
  const convRate = total > 0 ? ((enrolled / total) * 100).toFixed(1) : '0.0';

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekNew = prospects.filter(p => new Date(p.createdAt) >= oneWeekAgo).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-600">募集進捗サマリー</h2>
        <button onClick={onEditGoal} className="text-xs text-indigo-500 hover:underline flex items-center gap-1">
          <Target size={12} /> 目標を編集
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard icon={<Users size={16} />} label="総登録件数" value={total}
          sub={`担当者 4名`} iconBg="bg-slate-500" />
        <KpiCard icon={<AlertTriangle size={16} />} label="重複疑い件数" value={dupes}
          sub="クリックでフィルタ" iconBg="bg-red-500" onClick={onDupeFilter} alert={dupes > 0} />
        <KpiCard icon={<FileText size={16} />} label="出願済" value={applied}
          goal={goal.applied} iconBg="bg-violet-600" />
        <KpiCard icon={<GraduationCap size={16} />} label="入学確定" value={enrolled}
          goal={goal.enrolled} iconBg="bg-emerald-600" />
        <KpiCard icon={<Sparkles size={16} />} label="今週の新規" value={weekNew}
          sub={`最終転換率 ${convRate}%`} iconBg="bg-indigo-500" />
      </div>
    </div>
  );
}
