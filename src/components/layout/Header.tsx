import { GraduationCap } from 'lucide-react';

export default function Header() {
  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-slate-800">学生募集ハウスリスト管理</div>
            <div className="text-xs text-slate-400 hidden sm:block">入試課 ダッシュボード</div>
          </div>
        </div>
        <div className="text-xs text-slate-400">{today} 現在</div>
      </div>
    </header>
  );
}
