// 熱量スコア 0-100 を色クラスに変換
export function heatColorClass(score: number): string {
  if (score >= 75) return 'text-rose-500';
  if (score >= 50) return 'text-orange-400';
  if (score >= 25) return 'text-sky-400';
  return 'text-slate-300';
}

export function heatBgClass(score: number): string {
  if (score >= 75) return 'bg-rose-50 border-rose-200';
  if (score >= 50) return 'bg-orange-50 border-orange-200';
  if (score >= 25) return 'bg-sky-50 border-sky-200';
  return 'bg-slate-50 border-slate-200';
}

export function heatLabel(score: number): string {
  if (score >= 75) return '高';
  if (score >= 50) return '中高';
  if (score >= 25) return '中低';
  return '低';
}
