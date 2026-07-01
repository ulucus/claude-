import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';
import type { Prospect } from '../types';
import { STATUS_LABEL, SOURCE_LABEL } from '../types';

interface Props { prospects: Prospect[]; }

const STATUS_ORDER = ['new', 'contacted', 'interested', 'applied', 'enrolled'] as const;
const COLORS = ['#6366f1', '#3b82f6', '#f59e0b', '#a855f7', '#22c55e', '#ef4444', '#64748b'];

export default function Charts({ prospects }: Props) {
  // ファネルデータ
  const funnelData = STATUS_ORDER.map(s => ({
    name: STATUS_LABEL[s],
    件数: prospects.filter(p => p.status === s).length,
  }));

  // 獲得経路別
  const sourceMap: Record<string, number> = {};
  prospects.forEach(p => {
    const label = SOURCE_LABEL[p.source];
    sourceMap[label] = (sourceMap[label] || 0) + 1;
  });
  const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

  // 偏差値ランク別熱量平均
  const rankMap: Record<string, number[]> = { S: [], A: [], B: [], C: [], D: [] };
  prospects.forEach(p => rankMap[p.highSchool.rank].push(p.heatScore));
  const rankData = Object.entries(rankMap).map(([rank, scores]) => ({
    rank: `${rank}ランク`,
    平均熱量: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    件数: scores.length,
  }));

  // 月別新規獲得
  const monthMap: Record<string, number> = {};
  prospects.filter(p => p.status !== 'dropped').forEach(p => {
    const m = p.createdAt.slice(0, 7);
    monthMap[m] = (monthMap[m] || 0) + 1;
  });
  const monthData = Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).map(([month, 件数]) => ({ month: month.replace('-', '/'), 件数 }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* ファネル */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-slate-600 mb-3">進捗ファネル</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={funnelData} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={65} />
            <Tooltip />
            <Bar dataKey="件数" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 獲得経路 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-slate-600 mb-3">獲得経路別</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
              {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 偏差値ランク別熱量 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-slate-600 mb-3">高校偏差値ランク別・平均熱量スコア</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={rankData}>
            <XAxis dataKey="rank" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="平均熱量" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 月別新規 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-slate-600 mb-3">月別新規獲得推移</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="件数" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
