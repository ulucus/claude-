import type { Prospect, HighSchool, Faculty, Source, Status, ContactLog, Guardian, HsRank } from '../types';

const HIGH_SCHOOLS: HighSchool[] = [
  { id: 'hs01', name: '開成高校', prefecture: '東京都', deviationScore: 78, rank: 'S' },
  { id: 'hs02', name: '桜蔭高校', prefecture: '東京都', deviationScore: 75, rank: 'S' },
  { id: 'hs03', name: '麻布高校', prefecture: '東京都', deviationScore: 74, rank: 'S' },
  { id: 'hs04', name: '渋谷教育学園渋谷', prefecture: '東京都', deviationScore: 71, rank: 'A' },
  { id: 'hs05', name: '豊島岡女子学園', prefecture: '東京都', deviationScore: 70, rank: 'A' },
  { id: 'hs06', name: '浦和明の星女子', prefecture: '埼玉県', deviationScore: 68, rank: 'A' },
  { id: 'hs07', name: '栄東高校', prefecture: '埼玉県', deviationScore: 65, rank: 'A' },
  { id: 'hs08', name: '大宮高校', prefecture: '埼玉県', deviationScore: 67, rank: 'A' },
  { id: 'hs09', name: '市川高校', prefecture: '千葉県', deviationScore: 64, rank: 'B' },
  { id: 'hs10', name: '千葉高校', prefecture: '千葉県', deviationScore: 69, rank: 'A' },
  { id: 'hs11', name: '東邦大東邦', prefecture: '千葉県', deviationScore: 62, rank: 'B' },
  { id: 'hs12', name: '桐光学園', prefecture: '神奈川県', deviationScore: 60, rank: 'B' },
  { id: 'hs13', name: '横浜翠嵐', prefecture: '神奈川県', deviationScore: 70, rank: 'A' },
  { id: 'hs14', name: '法政大学第二', prefecture: '神奈川県', deviationScore: 58, rank: 'B' },
  { id: 'hs15', name: '国学院高校', prefecture: '東京都', deviationScore: 55, rank: 'C' },
  { id: 'hs16', name: '専修大学附属', prefecture: '東京都', deviationScore: 52, rank: 'C' },
  { id: 'hs17', name: '武蔵野大学附属', prefecture: '東京都', deviationScore: 50, rank: 'C' },
  { id: 'hs18', name: '川越高校', prefecture: '埼玉県', deviationScore: 63, rank: 'B' },
  { id: 'hs19', name: '東京成徳大学高校', prefecture: '東京都', deviationScore: 47, rank: 'D' },
  { id: 'hs20', name: '足立学園', prefecture: '東京都', deviationScore: 45, rank: 'D' },
];

const LAST = ['田中', '鈴木', '佐藤', '高橋', '渡辺', '伊藤', '山田', '中村', '小林', '加藤', '吉田', '山口', '松本', '井上', '木村', '林', '清水', '山本', '池田', '橋本'];
const FIRST_M = ['太郎', '健一', '翔太', '大輔', '拓也', '慎一', '雄介', '直樹', '浩二', '亮'];
const FIRST_F = ['花子', '美咲', '愛', '奈々', 'さくら', '由美', '麻衣', '彩', '瞳', '千夏'];
const FACULTIES: Faculty[] = ['engineering', 'business', 'arts', 'science', 'medicine', 'law', 'education'];
const SOURCES: Source[] = ['fair', 'web', 'agency', 'opencampus', 'referral', 'other'];
const STAFF = ['山田 太一', '鈴木 恵子', '佐藤 健', '田中 美穂'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randDate(start: string, end: string) {
  const s = new Date(start).getTime(), e = new Date(end).getTime();
  return new Date(s + Math.random() * (e - s)).toISOString().split('T')[0];
}

function makeContactLogs(status: Status, staff: string): ContactLog[] {
  const methods: ContactLog['method'][] = ['phone', 'email', 'visit', 'event'];
  const notes = ['資料を送付しました', '電話でヒアリング実施', 'OCへの案内を送付', '進路相談を実施', '出願書類について説明', '次回連絡予定を確認'];
  const count = status === 'new' ? 0 : status === 'contacted' ? 1 : status === 'interested' ? rand(2, 3) : rand(3, 5);
  return Array.from({ length: count }, (_, i) => ({
    id: `log-${i}`,
    date: randDate('2025-04-01', '2026-06-01'),
    method: pick(methods),
    staff,
    note: pick(notes),
  })).sort((a, b) => a.date.localeCompare(b.date));
}

function makeGuardian(): Guardian | null {
  if (Math.random() > 0.6) return null;
  const ln = pick(LAST);
  return {
    name: `${ln} ${pick(['正夫', '和子', '幸子', '信男', '美代子'])}`,
    relation: pick(['父', '母', '祖父', '祖母']),
    email: `guardian${rand(100, 999)}@example.com`,
    phone: `0${rand(3, 9)}0-${rand(1000, 9999)}-${rand(1000, 9999)}`,
  };
}

function generate(): Prospect[] {
  const dist: [Status, number][] = [['new', 30], ['contacted', 25], ['interested', 20], ['applied', 15], ['enrolled', 8], ['dropped', 12]];
  const all: Prospect[] = [];
  let seq = 1;

  for (const [status, count] of dist) {
    for (let i = 0; i < count; i++) {
      const isFemale = Math.random() > 0.5;
      const lastName = pick(LAST);
      const firstName = pick(isFemale ? FIRST_F : FIRST_M);
      const hs = pick(HIGH_SCHOOLS);
      const staff = pick(STAFF);
      const createdAt = randDate('2025-04-01', '2026-04-01');
      all.push({
        id: `P${String(seq++).padStart(4, '0')}`,
        name: `${lastName} ${firstName}`,
        email: `${lastName.toLowerCase()}${seq}@example.com`,
        phone: `0${rand(90, 99)}-${rand(1000, 9999)}-${rand(1000, 9999)}`,
        prefecture: hs.prefecture,
        highSchool: hs,
        graduationYear: pick([2025, 2026, 2027]),
        faculty: pick(FACULTIES),
        source: pick(SOURCES),
        status,
        heatScore: status === 'enrolled' ? rand(75, 100) : status === 'applied' ? rand(55, 90) : status === 'dropped' ? rand(5, 35) : rand(20, 80),
        notes: '',
        createdAt,
        lastContactedAt: status === 'new' ? null : randDate(createdAt, '2026-06-15'),
        assignedTo: staff,
        isDuplicate: false,
        guardian: makeGuardian(),
        contactLogs: makeContactLogs(status, staff),
      });
    }
  }

  // 重複8件を注入（同氏名・同高校・別経路）
  const dupeTargets = all.slice(0, 8);
  dupeTargets.forEach(p => { p.isDuplicate = true; });
  const dupes: Prospect[] = dupeTargets.map((p, i) => ({
    ...p,
    id: `DUPE${String(i + 1).padStart(3, '0')}`,
    source: pick(SOURCES.filter(s => s !== p.source)),
    status: 'new' as Status,
    createdAt: randDate('2026-01-01', '2026-06-01'),
    lastContactedAt: null,
    contactLogs: [],
    isDuplicate: true,
    heatScore: rand(20, 50),
  }));

  return [...all, ...dupes];
}

export const mockProspects = generate();
export const HIGH_SCHOOL_LIST: HighSchool[] = HIGH_SCHOOLS;
export const STAFF_LIST = STAFF;

// ランク一覧（フィルタ用）
export const HS_RANKS: HsRank[] = ['S', 'A', 'B', 'C', 'D'];
