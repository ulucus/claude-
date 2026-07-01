import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import type { Prospect } from '../../types';
import { SOURCE_LABEL } from '../../types';

export default function SourceConversionChart({ prospects }: { prospects: Prospect[] }) {
  const sources = [...new Set(prospects.map(p => p.source))];
  const data = sources.map(src => {
    const group = prospects.filter(p => p.source === src);
    const enrolled = group.filter(p => p.status === 'enrolled').length;
    const rate = group.length > 0 ? Math.round((enrolled / group.length) * 100) : 0;
    return { name: SOURCE_LABEL[src], 入学確定率: rate, total: group.length };
  }).sort((a, b) => b.入学確定率 - a.入学確定率);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h3 className="text-sm font-bold text-slate-700 mb-0.5">獲得経路別 入学確定率</h3>
      <p className="text-xs text-slate-400 mb-4">経路ごとに「何割が入学確定まで至ったか」</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ right: 32 }}>
          <XAxis dataKey="name" tick={{ fontSize: 9 }} />
          <YAxis tickFormatter={v => `${v}%`} domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${v}%`, '入学確定率']} />
          <Bar dataKey="入学確定率" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.入学確定率 >= 15 ? '#10b981' : d.入学確定率 >= 8 ? '#6366f1' : '#94a3b8'} />
            ))}
            <LabelList dataKey="入学確定率" position="top" formatter={(v) => `${String(v)}%`} style={{ fontSize: 10, fill: '#64748b' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
