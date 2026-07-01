import { useState } from 'react';
import type { Prospect } from '../types';
import { STATUS_LABEL, SOURCE_LABEL, FACULTY_LABEL, STATUS_COLOR } from '../types';
import { X, Phone, Mail, MapPin, School, Flame, AlertTriangle, User, ChevronDown } from 'lucide-react';

interface Props {
  prospect: Prospect;
  onClose: () => void;
  onSave: (updated: Prospect) => void;
}

const METHOD_LABEL: Record<string, string> = { phone: '電話', email: 'メール', visit: '訪問', event: 'イベント' };

export default function ProspectModal({ prospect, onClose, onSave }: Props) {
  const [tab, setTab] = useState<'basic' | 'logs' | 'guardian'>('basic');
  const [form, setForm] = useState(prospect);

  const heatColor = form.heatScore >= 75 ? 'text-red-500' : form.heatScore >= 50 ? 'text-orange-400' : form.heatScore >= 25 ? 'text-yellow-400' : 'text-slate-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
              {form.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">{form.name}</h2>
                {form.isDuplicate && (
                  <span className="flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={11} /> 重複疑い
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[form.status]}`}>
                  {STATUS_LABEL[form.status]}
                </span>
                <span className={`flex items-center gap-1 text-sm font-bold ${heatColor}`}>
                  <Flame size={14} /> {form.heatScore}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-5">
          {(['basic', 'logs', 'guardian'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t === 'basic' ? '基本情報' : t === 'logs' ? `接触履歴 (${form.contactLogs.length})` : '保護者情報'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Info icon={<Mail size={14} />} label="メール" value={form.email} />
                <Info icon={<Phone size={14} />} label="電話" value={form.phone} />
                <Info icon={<MapPin size={14} />} label="都道府県" value={form.prefecture} />
                <Info icon={<School size={14} />} label="出身高校" value={`${form.highSchool.name}（偏差値 ${form.highSchool.deviationScore} / ${form.highSchool.rank}ランク）`} />
                <Info label="卒業年度" value={`${form.graduationYear}年`} />
                <Info label="志望学部" value={FACULTY_LABEL[form.faculty]} />
                <Info label="獲得経路" value={SOURCE_LABEL[form.source]} />
                <Info label="担当者" value={form.assignedTo} />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">ステータス変更</label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as Prospect['status'] })}
                    className="w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">熱量スコア：{form.heatScore}</label>
                <input type="range" min={0} max={100} value={form.heatScore}
                  onChange={e => setForm({ ...form, heatScore: Number(e.target.value) })}
                  className="w-full accent-indigo-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>低</span><span>高</span></div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">メモ</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={3} className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="メモを入力..." />
              </div>
            </div>
          )}

          {tab === 'logs' && (
            <div className="space-y-3">
              {form.contactLogs.length === 0 && <p className="text-sm text-slate-400 text-center py-8">接触履歴がありません</p>}
              {[...form.contactLogs].reverse().map(log => (
                <div key={log.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
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
                  <div className="flex items-center gap-2 mb-3">
                    <User size={16} className="text-indigo-500" />
                    <span className="font-medium text-slate-700">{form.guardian.name}（{form.guardian.relation}）</span>
                  </div>
                  <Info icon={<Mail size={14} />} label="メール" value={form.guardian.email} />
                  <Info icon={<Phone size={14} />} label="電話" value={form.guardian.phone} />
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">保護者情報が未登録です</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border">キャンセル</button>
          <button onClick={() => { onSave(form); onClose(); }}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">保存</button>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-400 mb-0.5">{label}</div>
      <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
        {icon && <span className="text-slate-400">{icon}</span>}
        {value || '—'}
      </div>
    </div>
  );
}
