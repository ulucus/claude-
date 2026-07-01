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
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-xl shadow-sm p-4 flex flex-col gap-1 border border-slate-100',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        alert && 'ring-1 ring-red-300'
      )}>
      <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0', iconBg)}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-slate-800 mt-1 tabular-nums leading-none">{value}</div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
      {goal !== undefined && numeric !== null && (
        <>
          <div className="text-xs text-slate-400">目標 {goal}件 ／ 達成率 {goal > 0 ? Math.round((numeric / goal) * 100) : 0}%</div>
          <ProgressBar value={numeric} max={goal} />
        </>
      )}
    </div>
  );
}
