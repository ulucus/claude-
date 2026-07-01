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
    <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
      <h3 className="text-sm font-bold text-slate-600 mb-3">進捗ファネル</h3>
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
