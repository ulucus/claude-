import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import type { Prospect } from '../../types';
import { STATUS_LABEL, STATUS_COLOR_HEX } from '../../types';

const ORDER = ['new', 'contacted', 'interested', 'applied', 'enrolled'] as const;

export default function FunnelChart({ prospects }: { prospects: Prospect[] }) {
  const data = ORDER.map((s, i) => {
    const cnt = prospects.filter(p => p.status === s).length;
    const prev = i > 0 ? prospects.filter(p => p.status === ORDER[i - 1]).length : null;
    const rate = prev ? `${prev > 0 ? Math.round((cnt / prev) * 100) : 0}%↑` : '';
    return { name: STATUS_LABEL[s], 件数: cnt, color: STATUS_COLOR_HEX[s], rate };
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h3 className="text-sm font-bold text-slate-700 mb-0.5">進捗ファネル</h3>
      <p className="text-xs text-slate-400 mb-4">各ステージの件数と前段階からの転換率</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 48 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={62} />
          <Tooltip formatter={(v) => [`${v}件`, '件数']} />
          <Bar dataKey="件数" radius={[0, 4, 4, 0]}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            <LabelList dataKey="件数" position="right" style={{ fontSize: 11, fill: '#64748b' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
