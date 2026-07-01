import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Prospect } from '../../types';

export default function RankHeatChart({ prospects }: { prospects: Prospect[] }) {
  const ranks = ['S', 'A', 'B', 'C', 'D'] as const;
  const data = ranks.map(rank => {
    const group = prospects.filter(p => p.highSchool.rank === rank);
    const avg = group.length > 0 ? Math.round(group.reduce((s, p) => s + p.heatScore, 0) / group.length) : 0;
    return { rank: `${rank}ランク`, 平均熱量: avg, 件数: group.length };
  });

  const barColor = (avg: number) => avg >= 60 ? '#f43f5e' : avg >= 45 ? '#fb923c' : avg >= 30 ? '#38bdf8' : '#cbd5e1';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h3 className="text-sm font-bold text-slate-700 mb-0.5">偏差値ランク × 平均熱量スコア</h3>
      <p className="text-xs text-slate-400 mb-4">Sランクで熱量が低い = アプローチ不足の示唆</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="rank" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v, _n, props) => [`${v} (${props.payload.件数}件)`, '平均熱量']} />
          <Bar dataKey="平均熱量" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={barColor(d.平均熱量)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
