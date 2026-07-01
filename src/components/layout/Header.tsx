import { GraduationCap } from 'lucide-react';

export default function Header() {
  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40" style={{ boxShadow: '0 1px 0 #e2e8f0, 0 2px 8px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center justify-between px-5 md:px-7 h-[56px]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <GraduationCap size={19} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-bold text-slate-800 tracking-tight">学生募集ハウスリスト管理</div>
            <div className="text-[11px] text-slate-400 hidden sm:block">入試課 ダッシュボード</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
          <span className="text-[11px] text-slate-400">{today}</span>
        </div>
      </div>
    </header>
  );
}
