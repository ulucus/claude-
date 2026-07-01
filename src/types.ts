export type Status = 'new' | 'contacted' | 'interested' | 'applied' | 'enrolled' | 'dropped';
export type Source = 'fair' | 'web' | 'agency' | 'opencampus' | 'referral' | 'other';
export type Faculty = 'engineering' | 'business' | 'arts' | 'science' | 'medicine' | 'law' | 'education';

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
  web: '資料請求（Web）',
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

export const STATUS_COLOR: Record<Status, string> = {
  new: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  interested: 'bg-yellow-100 text-yellow-700',
  applied: 'bg-purple-100 text-purple-700',
  enrolled: 'bg-green-100 text-green-700',
  dropped: 'bg-red-100 text-red-700',
};

export interface HighSchool {
  id: string;
  name: string;
  prefecture: string;
  deviationScore: number; // 偏差値
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface Guardian {
  name: string;
  relation: string;
  email: string;
  phone: string;
}

export interface ContactLog {
  id: string;
  date: string;
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
  heatScore: number; // 熱量スコア 1-100
  notes: string;
  createdAt: string;
  lastContactedAt: string | null;
  assignedTo: string;
  isDuplicate: boolean;
  guardian: Guardian | null;
  contactLogs: ContactLog[];
}

export interface Goal {
  applied: number;
  enrolled: number;
}
