import { clsx } from 'clsx';
import ProgressBar from '../ui/ProgressBar';

interface Props {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  goal?: number;
  iconBg: string;
  onClick?: () => void;
  alert?: boolean;
}

export default function KpiCard({ icon, label, value, sub, goal, iconBg, onClick, alert }: Props) {
  const numeric = typeof value === 'number' ? value : null;
  const pct = goal !== undefined && numeric !== null && goal > 0 ? Math.round((numeric / goal) * 100) : 0;
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-2xl p-5 flex flex-col gap-2 border border-slate-100',
        'shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
        onClick && 'cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-shadow duration-200',
        alert && 'ring-2 ring-red-200 ring-offset-0'
      )}>
      <div className="flex items-center justify-between">
        <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0', iconBg)}>
          {icon}
        </div>
        {goal !== undefined && numeric !== null && (
          <span className={clsx(
            'text-xs font-semibold px-2 py-0.5 rounded-full',
            pct >= 80 ? 'bg-emerald-50 text-emerald-700' : pct >= 50 ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
          )}>{pct}%</span>
        )}
      </div>
      <div className="text-[2rem] font-bold text-slate-800 tabular-nums leading-none tracking-tight">{value}</div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-xs text-slate-400 leading-snug">{sub}</div>}
      {goal !== undefined && numeric !== null && (
        <>
          <div className="text-xs text-slate-400">目標 <span className="font-medium text-slate-600">{goal}件</span></div>
          <ProgressBar value={numeric} max={goal} />
        </>
      )}
    </div>
  );
}
