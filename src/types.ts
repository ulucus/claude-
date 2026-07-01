// 全日付フィールドは ISO8601 文字列 (YYYY-MM-DD) に統一

export type Status = 'new' | 'contacted' | 'interested' | 'applied' | 'enrolled' | 'dropped';
export type Source = 'fair' | 'web' | 'agency' | 'opencampus' | 'referral' | 'other';
export type Faculty = 'engineering' | 'business' | 'arts' | 'science' | 'medicine' | 'law' | 'education';
export type HsRank = 'S' | 'A' | 'B' | 'C' | 'D';

export const STATUS_LABEL: Record<Status, string> = {
  new: '未接触',
  contacted: '接触済',
  interested: '興味あり',
  applied: '出願済',
  enrolled: '入学確定',
  dropped: '離脱',
};

export const SOURCE_LABEL: Record<Source, string> = {
  fair: '大学説明会',
  web: '資料請求(Web)',
  agency: '外部メディア',
  opencampus: 'オープンキャンパス',
  referral: '紹介',
  other: 'その他',
};

export const FACULTY_LABEL: Record<Faculty, string> = {
  engineering: '工学部',
  business: '経営学部',
  arts: '文学部',
  science: '理学部',
  medicine: '医学部',
  law: '法学部',
  education: '教育学部',
};

// ステータスバッジの色クラス
export const STATUS_BADGE: Record<Status, string> = {
  new: 'bg-slate-100 text-slate-600',
  contacted: 'bg-blue-100 text-blue-700',
  interested: 'bg-amber-100 text-amber-700',
  applied: 'bg-violet-100 text-violet-700',
  enrolled: 'bg-emerald-100 text-emerald-700',
  dropped: 'bg-rose-100 text-rose-600',
};

// ファネルチャート用のステータスカラー（hex）
export const STATUS_COLOR_HEX: Record<Status, string> = {
  new: '#94a3b8',
  contacted: '#3b82f6',
  interested: '#f59e0b',
  applied: '#7c3aed',
  enrolled: '#10b981',
  dropped: '#fb7185',
};

export interface HighSchool {
  id: string;
  name: string;
  prefecture: string;
  deviationScore: number; // 0-100 偏差値
  rank: HsRank;
}

export interface Guardian {
  name: string;
  relation: string;
  email: string;
  phone: string;
}

export interface ContactLog {
  id: string;
  date: string; // ISO8601
  method: 'phone' | 'email' | 'visit' | 'event';
  staff: string;
  note: string;
}

export interface Prospect {
  id: string;
  name: string;
  email: string;
  phone: string;
  prefecture: string;
  highSchool: HighSchool;
  graduationYear: number;
  faculty: Faculty;
  source: Source;
  status: Status;
  heatScore: number; // 0-100
  notes: string;
  createdAt: string; // ISO8601
  lastContactedAt: string | null; // ISO8601
  assignedTo: string;
  isDuplicate: boolean;
  guardian: Guardian | null;
  contactLogs: ContactLog[];
}

export interface Goal {
  applied: number;
  enrolled: number;
}

export interface FilterState {
  query: string;
  status: Status | '';
  source: Source | '';
  faculty: Faculty | '';
  rank: HsRank | '';
  assignedTo: string;
  dupeOnly: boolean;
}

export const DEFAULT_FILTER: FilterState = {
  query: '',
  status: '',
  source: '',
  faculty: '',
  rank: '',
  assignedTo: '',
  dupeOnly: false,
};
