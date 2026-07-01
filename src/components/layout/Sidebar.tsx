import { clsx } from 'clsx';
import { LayoutDashboard, List, Settings } from 'lucide-react';

type Tab = 'dashboard' | 'list' | 'settings';

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
}

const items: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'ダッシュボード', icon: <LayoutDashboard size={18} /> },
  { id: 'list', label: 'ハウスリスト', icon: <List size={18} /> },
  { id: 'settings', label: '設定', icon: <Settings size={18} /> },
];

export default function Sidebar({ active, onChange }: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-52 bg-white border-r border-slate-200 min-h-0 pt-4">
        <nav className="flex flex-col gap-1 px-2">
          {items.map(item => (
            <button key={item.id} onClick={() => onChange(item.id)}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left',
                active === item.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex">
        {items.map(item => (
          <button key={item.id} onClick={() => onChange(item.id)}
            className={clsx(
              'flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors',
              active === item.id ? 'text-indigo-600' : 'text-slate-500'
            )}>
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
