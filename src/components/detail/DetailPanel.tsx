import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { X, Mail, Phone, MapPin, School, ChevronDown, User } from 'lucide-react';
import type { Prospect } from '../../types';
import { STATUS_LABEL, SOURCE_LABEL, FACULTY_LABEL, STATUS_BADGE } from '../../types';
import HeatScore from '../ui/HeatScore';

interface Props {
  prospect: Prospect | null;
  onClose: () => void;
  onSave: (p: Prospect) => void;
}

const METHOD_LABEL: Record<string, string> = { phone: '電話', email: 'メール', visit: '訪問', event: 'イベント' };

export default function DetailPanel({ prospect, onClose, onSave }: Props) {
  const [tab, setTab] = useState<'basic' | 'logs' | 'guardian'>('basic');
  const [form, setForm] = useState<Prospect | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prospect) { setForm({ ...prospect }); setTab('basic'); }
  }, [prospect]);

  // Esc キーで閉じる
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  // フォーカストラップは簡易版（パネル内に留まる）
  useEffect(() => {
    if (prospect) panelRef.current?.focus();
  }, [prospect]);

  const isOpen = !!prospect && !!form;

  return (
    <>
      {/* オーバーレイ（薄め）*/}
      <div
        className={clsx('fixed inset-0 z-40 bg-black/20 transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')}
        onClick={onClose}
      />

      {/* スライドオーバー */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={form ? `${form.name} の詳細` : ''}
        className={clsx(
          'fixed right-0 top-0 z-50 h-full w-full md:w-[480px] bg-white shadow-2xl flex flex-col outline-none',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
        {form && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {form.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-800">{form.name}</h2>
                    {form.isDuplicate && (
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">重複疑い</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_BADGE[form.status])}>
                      {STATUS_LABEL[form.status]}
                    </span>
                    <HeatScore score={form.heatScore} showLabel />
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><X size={18} /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-5">
              {(['basic', 'logs', 'guardian'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={clsx('px-3 py-2.5 text-sm font-medium border-b-2 transition-colors',
                    tab === t ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700')}>
                  {t === 'basic' ? '基本情報' : t === 'logs' ? `接触履歴 (${form.contactLogs.length})` : '保護者'}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {tab === 'basic' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoRow icon={<Mail size={13} />} label="メール" value={form.email} />
                    <InfoRow icon={<Phone size={13} />} label="電話" value={form.phone} />
                    <InfoRow icon={<MapPin size={13} />} label="都道府県" value={form.prefecture} />
                    <InfoRow icon={<School size={13} />} label="出身高校"
                      value={`${form.highSchool.name}（偏差値${form.highSchool.deviationScore}/${form.highSchool.rank}）`} />
                    <InfoRow label="卒業年度" value={`${form.graduationYear}年`} />
                    <InfoRow label="志望学部" value={FACULTY_LABEL[form.faculty]} />
                    <InfoRow label="獲得経路" value={SOURCE_LABEL[form.source]} />
                    <InfoRow label="担当者" value={form.assignedTo} />
                    <InfoRow label="登録日" value={form.createdAt} />
                    <InfoRow label="最終接触" value={form.lastContactedAt ?? '—'} />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">ステータス変更</label>
                    <div className="relative">
                      <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Prospect['status'] })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                        {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">
                      熱量スコア：<span className="font-bold text-slate-800">{form.heatScore}</span>
                    </label>
                    <input type="range" min={0} max={100} value={form.heatScore}
                      onChange={e => setForm({ ...form, heatScore: Number(e.target.value) })}
                      className="w-full accent-indigo-500" />
                    <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>低 (0)</span><span>高 (100)</span></div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">メモ</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                      rows={3} placeholder="メモを入力..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  </div>
                </>
              )}

              {tab === 'logs' && (
                <div className="space-y-3">
                  {form.contactLogs.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-10">接触履歴がありません</p>
                  )}
                  {[...form.contactLogs].reverse().map(log => (
                    <div key={log.id} className="border border-slate-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{METHOD_LABEL[log.method]}</span>
                        <span className="text-xs text-slate-400">{log.date} ｜ {log.staff}</span>
                      </div>
                      <p className="text-sm text-slate-700">{log.note}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'guardian' && (
                <div>
                  {form.guardian ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User size={15} className="text-indigo-500" />
                        <span className="font-medium text-slate-700">{form.guardian.name}（{form.guardian.relation}）</span>
                      </div>
                      <InfoRow icon={<Mail size={13} />} label="メール" value={form.guardian.email} />
                      <InfoRow icon={<Phone size={13} />} label="電話" value={form.guardian.phone} />
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-10">保護者情報が未登録です</p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t border-slate-100">
              <button onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                キャンセル
              </button>
              <button onClick={() => { onSave(form); onClose(); }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                保存
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function InfoRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-400 mb-0.5">{label}</div>
      <div className="flex items-center gap-1 text-sm text-slate-700 font-medium">
        {icon && <span className="text-slate-400">{icon}</span>}
        <span className="truncate">{value || '—'}</span>
      </div>
    </div>
  );
}
