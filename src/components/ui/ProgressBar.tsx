import { clsx } from 'clsx';

interface Props {
  value: number;
  max: number;
}

export default function ProgressBar({ value, max }: Props) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-indigo-500' : 'bg-amber-400';
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
      <div className={clsx('h-1.5 rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
    </div>
  );
}
