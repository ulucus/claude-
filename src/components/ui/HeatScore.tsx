import { Flame } from 'lucide-react';
import { clsx } from 'clsx';
import { heatColorClass } from '../../utils/heatScore';

interface Props {
  score: number;
  showLabel?: boolean;
}

export default function HeatScore({ score, showLabel = false }: Props) {
  return (
    <span className={clsx('inline-flex items-center gap-1 font-bold tabular-nums', heatColorClass(score))}>
      <Flame size={13} />
      <span>{score}</span>
      {showLabel && <span className="text-xs font-normal opacity-70">/ 100</span>}
    </span>
  );
}
