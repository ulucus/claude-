import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Prospect } from '../../types';

export default function MonthlyTrendChart({ prospects }: { prospects: Prospect[] }) {
  const map: Record<string, number> = {};
  prospects.filter(p => p.status !== 'dropped').forEach(p => {
    const m = p.createdAt.slice(0, 7);
    map[m] = (map[m] ?? 0) + 1;
  });
  const data = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, 新規件数]) => ({ month: month.replace('-', '/'), 新規件数 }));

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h3 className="text-sm font-bold text-slate-700 mb-0.5">月別新規獲得推移</h3>
      <p className="text-xs text-slate-400 mb-4">離脱を除く新規登録件数の推移</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="新規件数" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3, fill: '#4f46e5' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
