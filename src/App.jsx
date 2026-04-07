import { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, User, ArrowRight, RotateCcw, Heart, Star, BookOpen, Activity, Briefcase, PieChart as PieChartIcon } from 'lucide-react';

const JIKKAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const JUNISHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const GOGYO_NAMES = ["木", "火", "土", "金", "水"];
const GOGYO_COLORS = { 0: "#86efac", 1: "#fca5a5", 2: "#fde047", 3: "#d1d5db", 4: "#93c5fd" };
const SHI_GOGYO = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
const ZOUKAN_MAP = [9, 5, 0, 1, 4, 2, 3, 5, 6, 7, 4, 8];

const JIKKAN_DATA = [
  { name: "甲 (きのえ)", element: "木", description: "天へ向かって伸びる大樹のごとく、まっすぐな意志と高い理想を持つリーダータイプです。新しい道を切り開く先駆者精神があり、誠実さと正義感の強さで人々から深い信頼を集めます。" },
  { name: "乙 (きのと)", element: "木", description: "しなやかな草花のように、どんな環境にも適応できる柔軟さと粘り強さが魅力です。穏やかな外見の内に芯の強さを秘め、人との縁を大切にしながら着実に目標を達成します。" },
  { name: "丙 (ひのえ)", element: "火", description: "太陽のような圧倒的な明るさと温かさで、周囲を自然に引きつける求心力の持ち主です。物事をはっきりさせたいという直情的な気質があり、その情熱とエネルギーで場の空気を一変させます。" },
  { name: "丁 (ひのと)", element: "火", description: "月明かりや灯火のように、静かな光で人の心を照らします。繊細な感受性と深い洞察力を持ち、芸術的センスと心理的な深さで、多くの人が気づかない本質を見抜く力があります。" },
  { name: "戊 (つちのえ)", element: "土", description: "大山のようなどっしりとした存在感と揺るぎない精神力を持ちます。懐が深く、誰でも受け入れる包容力があり、長い時間をかけて育まれた知恵と経験を静かに蓄えています。" },
  { name: "己 (つちのと)", element: "土", description: "豊かな大地のように、関わる人すべてを養い育む深い愛情が際立ちます。多芸多才で吸収力が高く、地に足のついた判断力と周囲への細やかな気配りで多くの人から慕われます。" },
  { name: "庚 (かのえ)", element: "金", description: "鍛えられた鋼のような硬質な意志力と、物事を断ち切る決断力が強みです。情に流されず信念を持って行動する潔さと、周囲を鼓舞するリーダーシップで困難を突破します。" },
  { name: "辛 (かのと)", element: "金", description: "磨かれた宝石のように、試練を経るほどに輝きを増す強さがあります。美意識が高く、細部へのこだわりと独自の審美眼を持ち、精練されたものを生み出すことに喜びを感じます。" },
  { name: "壬 (みずのえ)", element: "水", description: "大海原のような広大なスケール感と、自由を愛するダイナミックな精神の持ち主です。枠にとらわれない柔軟な発想と大局を見渡す洞察力で、独自の航路を切り開きます。" },
  { name: "癸 (みずのと)", element: "水", description: "清らかな雨が大地を潤すように、知らず知らずのうちに周囲を助ける思いやりがあります。純粋で知性豊か、感受性が鋭く、じっくり物事を深めることで唯一無二の専門性を磨きます。" }
];

const TSUHENSEI_DATA = {
  "比肩": { catchphrase: "独立心と強い自己確立", description: "自分の信念を曲げず、人に頼らず自らの力で道を切り開く独立心の持ち主です。プライドが高く、ライバルとの競争の中で大きく成長します。組織より独立した立場で才能が最大限に花開くでしょう。" },
  "劫財": { catchphrase: "不屈の闘争心と勝負強さ", description: "強烈な競争本能と負けず嫌いの精神を持ち、どんな逆境もはね返す粘り強さがあります。財運に波はありますが、人との切磋琢磨の中で実力を磨き、最終的には大きな成果を手にする力があります。" },
  "食神": { catchphrase: "天性の才能と楽天的な生命力", description: "天からの豊かな恵みを受けた幸運の星です。生まれながらの才能と感受性に恵まれ、食・芸術・表現活動に深い喜びを見出します。その自然体の魅力が人を引きつけ、楽しみながら道が開けていきます。" },
  "傷官": { catchphrase: "卓越した才能と完璧主義", description: "十星中最高レベルの才能と知性の持ち主です。妥協を許さない完璧主義で、芸術・技術・学問の分野で傑出した実力を発揮します。型破りな個性と反骨精神が、独自のスタイルを生み出す原動力になります。" },
  "偏財": { catchphrase: "社交の才と広大な人脈", description: "明るく社交的でサービス精神が旺盛、誰とでも打ち解ける天性の魅力があります。臨機応変な対応力と商才に恵まれ、多彩な人間関係からチャンスを引き寄せます。変化のある環境で特に輝きます。" },
  "正財": { catchphrase: "誠実な努力と揺るぎない信頼感", description: "几帳面で真面目、約束を守り誠実に努力を積み重ねる堅実タイプです。目先の利益より長期的な信頼を重視し、時間をかけて着実に財産と地位を築きます。継続する力が最大の武器です。" },
  "偏官": { catchphrase: "無限の行動力と開拓者精神", description: "思ったらすぐ動く瞬発力と、困難を正面から突破する強さが持ち味です。型破りな発想と行動力で道なき道を切り開くパイオニア。義侠心が厚く、弱者のために戦う熱い一面も持ちます。" },
  "正官": { catchphrase: "気品ある責任感と高い倫理観", description: "規律と秩序を重んじ、責任感と使命感が並外れて強いエリートタイプです。正々堂々とした姿勢で周囲の信頼を勝ち取り、組織の中で重要な役割を担うことで真の力を発揮します。" },
  "偏印": { catchphrase: "独創的な発想と自由な知性", description: "常識にとらわれない奇抜なアイデアと、尽きることない知的探求心の持ち主です。芸術・学術・精神世界など非日常的な分野で唯一無二の才能を発揮しますが、飽きやすい一面もあります。" },
  "印綬": { catchphrase: "深い知性と人を育む愛情", description: "学ぶことへの純粋な情熱と、人を温かく育てる深い愛情の持ち主です。知識と経験を積むほどに輝きを増し、教育・研究・医療・福祉など人の成長に関わる分野で喜びと使命感を感じます。" }
};

// 推命パラメーター
const PARAM_META = {
  "自立心": { color: "#93c5fd", bg: "bg-blue-100",   text: "text-blue-700",  desc: "他人に依存することなく、自分が信じた道を突き進む強い精神性。リーダーシップを発揮し、フリーで活躍できる。" },
  "遊び心": { color: "#fdba74", bg: "bg-orange-100", text: "text-orange-700", desc: "楽しいことを企画したり、生活に遊びを取り入れることが自然とできる。芸術面での才能があったり、表現力も豊富。" },
  "人脈":   { color: "#86efac", bg: "bg-green-100",  text: "text-green-700",  desc: "さりげない気配りができて誰とでも仲良くなれる。サービス精神が旺盛でコミュニケーション能力も高く人を動かせる。" },
  "行動力": { color: "#f9a8d4", bg: "bg-pink-100",   text: "text-pink-700",   desc: "頭で考えるより行動で結果を出す。未知の分野に挑戦する意欲が強く、交渉力や営業力を磨けば成功できる。" },
  "知性":   { color: "#fde047", bg: "bg-yellow-100", text: "text-yellow-700", desc: "様々な分野の知識が豊富で、何かを学ぶことに喜びを感じる。頭の回転が速く、物事を論理的に捉えることが上手。" }
};

const PARAM_ORDER = ["自立心", "遊び心", "人脈", "行動力", "知性"];

// 通変星 → パラメーター
const TSUHENSEI_TO_PARAM = {
  "比肩": "自立心", "劫財": "自立心",
  "食神": "遊び心", "傷官": "遊び心",
  "偏財": "人脈",   "正財": "人脈",
  "偏官": "行動力", "正官": "行動力",
  "偏印": "知性",   "印綬": "知性"
};

const JUNIUN_TABLE = [
  ["沐浴","冠帯","建禄","帝旺","衰","病","死","墓","絶","胎","養","長生"],
  ["病","衰","帝旺","建禄","冠帯","沐浴","長生","養","胎","絶","墓","死"],
  ["胎","養","長生","沐浴","冠帯","建禄","帝旺","衰","病","死","墓","絶"],
  ["絶","墓","死","病","衰","帝旺","建禄","冠帯","沐浴","長生","養","胎"],
  ["胎","養","長生","沐浴","冠帯","建禄","帝旺","衰","病","死","墓","絶"],
  ["絶","墓","死","病","衰","帝旺","建禄","冠帯","沐浴","長生","養","胎"],
  ["死","墓","絶","胎","養","長生","沐浴","冠帯","建禄","帝旺","衰","病"],
  ["長生","沐浴","冠帯","建禄","帝旺","衰","病","死","墓","絶","胎","養"],
  ["帝旺","衰","病","死","墓","絶","胎","養","長生","沐浴","冠帯","建禄"],
  ["建禄","冠帯","沐浴","長生","養","胎","絶","墓","死","病","衰","帝旺"]
];

const ENERGY_MAP = {
  "胎":3,"養":6,"長生":9,"沐浴":7,"冠帯":10,"建禄":11,
  "帝旺":12,"衰":8,"病":4,"死":2,"墓":5,"絶":1
};

// 天中殺（空亡）テーブル — ブロック番号 → 空亡する地支ペア名
const TENCHUSATSU_TABLE = ["戌亥", "申酉", "午未", "辰巳", "寅卯", "子丑"];

function getTenchusatsuBlock(kanIdx, shiIdx) {
  for (let n = 0; n < 6; n++) {
    if ((kanIdx + 10 * n) % 12 === shiIdx) {
      return Math.floor((kanIdx + 10 * n) / 10);
    }
  }
  return 0;
}

function getTsuhensei(baseIdx, targetIdx) {
  if (targetIdx == null) return "-";
  const diff = (Math.floor(targetIdx / 2) - Math.floor(baseIdx / 2) + 5) % 5;
  const sameInyo = (baseIdx % 2) === (targetIdx % 2);
  switch (diff) {
    case 0: return sameInyo ? "比肩" : "劫財";
    case 1: return sameInyo ? "食神" : "傷官";
    case 2: return sameInyo ? "偏財" : "正財";
    case 3: return sameInyo ? "偏官" : "正官";
    case 4: return sameInyo ? "偏印" : "印綬";
    default: return "";
  }
}

const SETSUIRI_CORRECTIONS = {
  '1980-2': 1, '1984-2': 1,
  '1994-2': -1, '1995-2': -1, '1999-2': -1,
  '2021-2': -1, '2023-2': -1, '2025-2': -1, '2029-2': -1,
  '2021-4': 1, '2022-4': 1,
};

function getSetsuiriDay(year, month) {
  const params = {
    1: 5.4055, 2: 4.6215, 3: 5.6028, 4: 4.8454, 5: 5.6268, 6: 5.7275,
    7: 7.2847, 8: 7.6360, 9: 7.8228, 10: 8.4069, 11: 7.5255, 12: 7.2625
  };
  const Y = year - 1980;
  const base = Math.floor(params[month] + 0.2422 * Y - Math.floor(Y / 4));
  return base + (SETSUIRI_CORRECTIONS[`${year}-${month}`] || 0);
}

function calculateMeishiki(year, month, day) {
  // ── 日干支 ──
  // 1900/1/1 = 甲(0)戌(10) を基準。戌のオフセット+10が必須
  const diffDays = Math.round(
    (Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 1)) / 86400000
  );
  const dayKanIdx = ((diffDays % 10) + 10) % 10;
  // ※ 前回の修正で +10 オフセットが抜けていたバグを修正
  const dayShiIdx = ((10 + diffDays % 12) + 12) % 12;

  // ── 節入り判定 ──
  let setsuYear = year, setsuMonth = month;
  const setsuDay = getSetsuiriDay(year, month);
  if (day < setsuDay) {
    setsuMonth--;
    if (setsuMonth === 0) { setsuMonth = 12; setsuYear--; }
  }
  let kY = setsuYear;
  if (setsuMonth === 1) kY--;

  // ── 年干支 ──
  const yearKanIdx = ((kY - 4) % 10 + 10) % 10;
  const yearShiIdx = ((kY - 4) % 12 + 12) % 12;

  // ── 月干支 ──
  let emM = setsuMonth - 2;
  if (setsuMonth === 1) emM = 11;
  else if (setsuMonth === 12) emM = 10;
  const totalMonths = (kY - 1900) * 12 + emM;
  const monthKanIdx = ((4 + totalMonths % 10) + 10) % 10;
  const monthShiIdx = ((2 + totalMonths % 12) + 12) % 12;

  // ── 五行カウント ──
  const gogyoCounts = [0, 0, 0, 0, 0];
  [yearKanIdx, monthKanIdx, dayKanIdx].forEach(k => gogyoCounts[Math.floor(k / 2)]++);
  [yearShiIdx, monthShiIdx, dayShiIdx].forEach(s => gogyoCounts[SHI_GOGYO[s]]++);

  // ── 柱の生成 ──
  const buildPillar = (kanIdx, shiIdx, isDayPillar) => {
    const zoukanIdx = ZOUKAN_MAP[shiIdx];
    const juniunsei = JUNIUN_TABLE[dayKanIdx][shiIdx];
    return {
      kan: JIKKAN[kanIdx],
      shi: JUNISHI[shiIdx],
      zoukan: JIKKAN[zoukanIdx],
      tsuhensei: isDayPillar ? "-" : getTsuhensei(dayKanIdx, kanIdx),
      zoukanTsuhensei: getTsuhensei(dayKanIdx, zoukanIdx),
      juniunsei,
      energy: ENERGY_MAP[juniunsei]
    };
  };

  const yearPillar  = buildPillar(yearKanIdx,  yearShiIdx,  false);
  const monthPillar = buildPillar(monthKanIdx, monthShiIdx, false);
  const dayPillar   = buildPillar(dayKanIdx,   dayShiIdx,   true);

  // ── 天中殺 ──
  const dayTenchusatsu  = TENCHUSATSU_TABLE[getTenchusatsuBlock(dayKanIdx,  dayShiIdx)];
  const monthTenchusatsu = TENCHUSATSU_TABLE[getTenchusatsuBlock(monthKanIdx, monthShiIdx)];
  const yearTenchusatsu  = TENCHUSATSU_TABLE[getTenchusatsuBlock(yearKanIdx,  yearShiIdx)];

  // ── 推命パラメーター ──
  // 月干通変星・年干通変星・日支蔵干・月支蔵干・年支蔵干の5スロット合計
  const paramCounts = { "自立心": 0, "遊び心": 0, "人脈": 0, "行動力": 0, "知性": 0 };
  [
    monthPillar.tsuhensei,
    yearPillar.tsuhensei,
    dayPillar.zoukanTsuhensei,
    monthPillar.zoukanTsuhensei,
    yearPillar.zoukanTsuhensei
  ].forEach(t => {
    const p = TSUHENSEI_TO_PARAM[t];
    if (p) paramCounts[p]++;
  });
  const paramTotal = Object.values(paramCounts).reduce((a, b) => a + b, 0) || 1;
  const params = PARAM_ORDER.map(name => ({
    name,
    count: paramCounts[name],
    pct: Math.round(paramCounts[name] / paramTotal * 100)
  }));

  return {
    dayKanIdx,
    dayGogyo: Math.floor(dayKanIdx / 2),
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    isBeforeSetsuiri: day < setsuDay,
    setsuDay,
    gogyoCounts,
    dayTenchusatsu,
    monthTenchusatsu,
    yearTenchusatsu,
    params
  };
}

// ── 五行相関図（日干の五行を上部） ──
function GogyoChart({ counts, dayGogyo }) {
  const basePositions = [
    { x: 50, y: 15 }, { x: 85, y: 40 }, { x: 70, y: 80 },
    { x: 30, y: 80 }, { x: 15, y: 40 }
  ];
  const items = basePositions.map((pos, i) => {
    const gogyoIdx = (dayGogyo + i) % 5;
    return { ...pos, gogyoIdx, name: GOGYO_NAMES[gogyoIdx], count: counts[gogyoIdx], isTop: i === 0 };
  });
  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto mt-6 bg-white/50 rounded-full p-4 shadow-inner border border-gray-100">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <polygon points="50,15 85,40 70,80 30,80 15,40" fill="none" stroke="#fbcfe8" strokeWidth="1" strokeDasharray="2,2" />
        <polygon points="50,15 70,80 15,40 85,40 30,80" fill="none" stroke="#d1d5db" strokeWidth="1" strokeDasharray="1,3" />
        {items.map((item, i) => {
          const size = item.count > 0 ? 8 + item.count * 1.5 : 6;
          return (
            <g key={i}>
              {item.isTop && <circle cx={item.x} cy={item.y} r={size + 3.5} fill="none" stroke="#f9a8d4" strokeWidth="1.5" strokeDasharray="3,1.5" />}
              <circle cx={item.x} cy={item.y} r={size} fill={GOGYO_COLORS[item.gogyoIdx]} opacity={item.count > 0 ? 1 : 0.3} />
              <text x={item.x} y={item.y + 1.5} fontSize="5" textAnchor="middle" alignmentBaseline="middle" fill={item.count > 0 ? '#374151' : '#9ca3af'} fontWeight="bold">{item.name}</text>
              <circle cx={item.x + size} cy={item.y - size} r="3" fill="#fff" stroke="#fbcfe8" strokeWidth="0.5" />
              <text x={item.x + size} y={item.y - size + 1.5} fontSize="3.5" textAnchor="middle" alignmentBaseline="middle" fill="#ec4899" fontWeight="bold">{item.count}</text>
              {item.isTop && <text x={item.x} y={item.y - size - 5} fontSize="3.8" textAnchor="middle" fill="#ec4899" fontWeight="bold">日干</text>}
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 left-0 right-0 text-[10px] text-gray-400 text-center flex items-center justify-center gap-3">
        <span>-- 相生</span><span>･･ 相剋</span><span className="text-pink-400">◎ 日干</span>
      </div>
    </div>
  );
}

// ── 推命パラメーター 円グラフ ──
function PieChart({ params }) {
  const nonZero = params.filter(p => p.pct > 0);
  const cx = 50, cy = 50, r = 44;
  let angle = -Math.PI / 2;
  const slices = nonZero.map(p => {
    const sweep = (p.pct / 100) * 2 * Math.PI;
    const sa = angle, ea = angle + sweep;
    angle = ea;
    const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
    const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
    const mid = sa + sweep / 2;
    const lr = r * 0.62;
    return {
      path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2},${y2} Z`,
      color: PARAM_META[p.name].color,
      label: p.pct >= 10 ? `${p.pct}%` : '',
      lx: cx + lr * Math.cos(mid),
      ly: cy + lr * Math.sin(mid),
      ...p
    };
  });
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[180px] mx-auto drop-shadow-sm">
      {slices.map((s, i) => (
        <g key={i}>
          <path d={s.path} fill={s.color} stroke="white" strokeWidth="1" />
          {s.label && (
            <text x={s.lx} y={s.ly} fontSize="5.5" textAnchor="middle" alignmentBaseline="middle" fill="#374151" fontWeight="bold">{s.label}</text>
          )}
        </g>
      ))}
    </svg>
  );
}

export default function App() {
  const [step, setStep] = useState('input');
  const [formData, setFormData] = useState({ birthDate: '', gender: '', birthTime: '' });
  const [meishiki, setMeishiki] = useState(null);
  const [visibleElements, setVisibleElements] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.birthDate || !formData.gender) return;
    const [bYear, bMonth, bDay] = formData.birthDate.split('-').map(Number);
    const bHour = formData.birthTime ? parseInt(formData.birthTime.split(':')[0], 10) : 12;
    let calcYear = bYear, calcMonth = bMonth, calcDay = bDay;
    if (bHour >= 23) {
      const next = new Date(bYear, bMonth - 1, bDay + 1);
      calcYear = next.getFullYear(); calcMonth = next.getMonth() + 1; calcDay = next.getDate();
    }
    setMeishiki(calculateMeishiki(calcYear, calcMonth, calcDay));
    setVisibleElements([]);
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setStep('input');
    setFormData({ birthDate: '', gender: '', birthTime: '' });
    setMeishiki(null);
    setVisibleElements([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFormValid = formData.birthDate !== '' && formData.gender !== '';

  useEffect(() => {
    if (step === 'result' && meishiki) {
      ['dayCard', 'monthCard', 'params', 'table', 'chart', 'button'].forEach((el, i) => {
        setTimeout(() => setVisibleElements(prev => [...prev, el]), 150 + i * 200);
      });
    }
  }, [step, meishiki]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans text-gray-700 selection:bg-pink-200 selection:text-pink-900 pb-12">
      <header className="p-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-pink-400 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          ゆっこの四柱推命
          <Heart className="w-5 h-5 text-pink-300" />
        </h1>
        <p className="mt-2 text-sm text-gray-500">本格的な命式と五行バランスを紐解く</p>
      </header>

      <main className="max-w-xl mx-auto px-4">
        {step === 'input' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100/50 p-6 md:p-8 border border-white/50 animate-in fade-in slide-in-from-bottom-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <Calendar className="w-4 h-4 text-yellow-500" />
                  生年月日 <span className="text-xs text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">必須</span>
                </label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all outline-none" required />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <User className="w-4 h-4 text-pink-400" />
                  性別 <span className="text-xs text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">必須</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['female', 'male'].map(g => (
                    <button key={g} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                      className={`py-3 px-4 rounded-2xl border-2 transition-all font-medium ${formData.gender === g ? 'border-pink-300 bg-pink-50 text-pink-700' : 'border-gray-50 bg-gray-50 text-gray-500'}`}>
                      {g === 'female' ? '女性' : '男性'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  誕生時間 <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">任意</span>
                </label>
                <input type="time" name="birthTime" value={formData.birthTime} onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300 transition-all outline-none" />
                <p className="text-xs text-gray-400 pl-1">※23時以降は翌日の干支として計算されます</p>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={!isFormValid}
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-lg font-bold transition-all duration-300 ${isFormValid ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-lg shadow-pink-200 hover:scale-[1.02]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  命式を詳しく紐解く <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'result' && meishiki && (
          <div className="space-y-6 pb-8">

            {/* 本質の星（日干） */}
            <div className={`bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-pink-100/60 p-8 border border-white relative overflow-hidden transition-all duration-700 transform ${visibleElements.includes('dayCard') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="absolute top-0 right-0 p-6 opacity-10"><Star className="w-32 h-32 text-yellow-500" /></div>
              <div className="relative z-10 text-center space-y-4">
                <p className="text-sm font-bold text-pink-400 tracking-wider">あなたの本質を表す星（日干）</p>
                <div className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-50 to-pink-50 rounded-2xl border border-white shadow-sm">
                  <h2 className="text-4xl font-extrabold text-gray-800">{JIKKAN_DATA[meishiki.dayKanIdx].name.split(' ')[0]}</h2>
                  <p className="text-sm text-gray-500 mt-1">{JIKKAN_DATA[meishiki.dayKanIdx].name.split(' ')[1]}</p>
                </div>
                <div className="pt-4 text-left">
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{JIKKAN_DATA[meishiki.dayKanIdx].description}</p>
                </div>
              </div>
            </div>

            {/* 才能・社会性（月干通変星・主星） */}
            <div className={`bg-white/80 backdrop-blur-md rounded-3xl shadow-lg shadow-yellow-100/50 p-6 border border-white transition-all duration-700 transform ${visibleElements.includes('monthCard') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-center font-bold text-gray-700 mb-4 flex items-center justify-center gap-2">
                <Briefcase className="w-5 h-5 text-yellow-500" />
                あなたの才能・社会性（主星）
              </h3>
              <div className="bg-yellow-50/50 rounded-2xl p-5 border border-yellow-100 text-center space-y-3">
                <div className="text-2xl font-bold text-yellow-700">{meishiki.month.tsuhensei}</div>
                <div className="text-sm font-semibold text-yellow-600 border-b border-yellow-200 pb-2 inline-block">
                  {TSUHENSEI_DATA[meishiki.month.tsuhensei]?.catchphrase}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed pt-2 text-left">
                  {TSUHENSEI_DATA[meishiki.month.tsuhensei]?.description}
                </p>
              </div>
            </div>

            {/* 推命パラメーター */}
            <div className={`bg-white/80 rounded-3xl p-6 border border-pink-100 shadow-md transition-all duration-700 transform ${visibleElements.includes('params') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-center font-bold text-gray-700 mb-5 flex items-center justify-center gap-2 text-lg">
                <PieChartIcon className="w-5 h-5 text-pink-400" /> 推命パラメーター
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* 円グラフ */}
                <div className="w-full md:w-auto flex-shrink-0">
                  <PieChart params={meishiki.params} />
                  {/* 凡例 */}
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3">
                    {meishiki.params.filter(p => p.pct > 0).map(p => (
                      <span key={p.name} className="flex items-center gap-1 text-xs text-gray-600">
                        <span className="w-3 h-3 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: PARAM_META[p.name].color }} />
                        {p.name} {p.pct}%
                      </span>
                    ))}
                  </div>
                </div>
                {/* 説明リスト */}
                <ul className="w-full space-y-3 text-sm">
                  {meishiki.params.filter(p => p.pct > 0).map(p => (
                    <li key={p.name} className="flex items-start gap-2">
                      <span className="mt-1 w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PARAM_META[p.name].color }} />
                      <div>
                        <span className={`font-bold ${PARAM_META[p.name].text}`}>{p.name}（{p.pct}%）</span>
                        <span className="text-gray-500 ml-1">… {PARAM_META[p.name].desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 詳細命式表（天中殺含む） */}
            <div className={`bg-white/80 rounded-3xl p-5 md:p-8 border border-pink-100 shadow-md transition-all duration-700 transform ${visibleElements.includes('table') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-center font-bold text-gray-700 mb-6 flex items-center justify-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-pink-400" /> 詳細命式表
              </h3>
              <div className="overflow-x-auto pb-4">
                <table className="w-full min-w-[400px] text-center border-collapse">
                  <thead>
                    <tr className="border-b-2 border-pink-100">
                      <th className="py-3 px-2 text-xs text-gray-400 font-normal text-left w-1/4">項目</th>
                      <th className="py-3 px-2 text-pink-500 font-bold w-1/4 relative">
                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] bg-pink-100 text-pink-600 px-1.5 rounded-sm">本質</span>日柱
                      </th>
                      <th className="py-3 px-2 text-yellow-600 font-bold w-1/4 relative">
                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] bg-yellow-100 text-yellow-700 px-1.5 rounded-sm">才能</span>月柱
                      </th>
                      <th className="py-3 px-2 text-gray-400 font-bold w-1/4">年柱</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm md:text-base text-gray-700">
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <td className="py-2 px-2 text-xs text-gray-500 text-left">天中殺</td>
                      <td className="py-2 px-2 text-sm font-bold text-pink-600 bg-pink-50/30">{meishiki.dayTenchusatsu}</td>
                      <td className="py-2 px-2 text-sm font-bold text-yellow-600 bg-yellow-50/30">{meishiki.monthTenchusatsu}</td>
                      <td className="py-2 px-2 text-sm font-bold text-gray-600">{meishiki.yearTenchusatsu}</td>
                    </tr>
                    <tr className="border-b border-gray-50 bg-gray-50/30">
                      <td className="py-3 px-2 text-xs text-gray-500 text-left">柱の意味</td>
                      <td className="py-3 px-2 text-xs font-medium text-pink-600 bg-pink-50/30">自分・晩年</td>
                      <td className="py-3 px-2 text-xs font-medium text-yellow-600 bg-yellow-50/30">親・中年</td>
                      <td className="py-3 px-2 text-xs text-gray-500">祖先・初年</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-3 px-2 text-xs text-gray-500 text-left">干支</td>
                      <td className="py-3 px-2 font-bold text-lg text-pink-600 bg-pink-50/30">{meishiki.day.kan}<span className="text-sm ml-1 text-pink-400">{meishiki.day.shi}</span></td>
                      <td className="py-3 px-2 font-bold text-lg text-yellow-600 bg-yellow-50/30">{meishiki.month.kan}<span className="text-sm ml-1 text-yellow-500">{meishiki.month.shi}</span></td>
                      <td className="py-3 px-2 font-bold text-lg text-gray-600">{meishiki.year.kan}<span className="text-sm ml-1 text-gray-400">{meishiki.year.shi}</span></td>
                    </tr>
                    <tr className="border-b border-gray-50 bg-gray-50/30">
                      <td className="py-3 px-2 text-xs text-gray-500 text-left">蔵干</td>
                      <td className="py-3 px-2 text-pink-500 bg-pink-50/30">{meishiki.day.zoukan}</td>
                      <td className="py-3 px-2 text-yellow-600 bg-yellow-50/30">{meishiki.month.zoukan}</td>
                      <td className="py-3 px-2 text-gray-600">{meishiki.year.zoukan}</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-3 px-2 text-xs text-gray-500 text-left">通変星</td>
                      <td className="py-3 px-2 text-gray-300 bg-pink-50/30">—</td>
                      <td className="py-3 px-2 text-yellow-600 font-bold bg-yellow-50/30">{meishiki.month.tsuhensei}</td>
                      <td className="py-3 px-2 text-gray-500">{meishiki.year.tsuhensei}</td>
                    </tr>
                    <tr className="border-b border-gray-50 bg-gray-50/30">
                      <td className="py-3 px-2 text-xs text-gray-500 text-left">蔵干通変星</td>
                      <td className="py-3 px-2 text-pink-600 bg-pink-50/30">{meishiki.day.zoukanTsuhensei}</td>
                      <td className="py-3 px-2 text-yellow-600 bg-yellow-50/30">{meishiki.month.zoukanTsuhensei}</td>
                      <td className="py-3 px-2 text-gray-600">{meishiki.year.zoukanTsuhensei}</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-3 px-2 text-xs text-gray-500 text-left">十二運星</td>
                      <td className="py-3 px-2 text-pink-600 bg-pink-50/30">{meishiki.day.juniunsei}</td>
                      <td className="py-3 px-2 text-yellow-600 bg-yellow-50/30">{meishiki.month.juniunsei}</td>
                      <td className="py-3 px-2 text-gray-600">{meishiki.year.juniunsei}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 text-xs text-gray-500 text-left">運勢ｴﾈﾙｷﾞｰ</td>
                      <td className="py-3 px-2 font-mono text-pink-600 bg-pink-50/50 rounded-bl-lg">{meishiki.day.energy}</td>
                      <td className="py-3 px-2 font-mono text-yellow-600 bg-yellow-50/50">{meishiki.month.energy}</td>
                      <td className="py-3 px-2 font-mono text-gray-500 bg-gray-50/50 rounded-br-lg">{meishiki.year.energy}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {meishiki.isBeforeSetsuiri && (
                <p className="text-xs text-pink-600 mt-2 text-center bg-pink-50 py-1.5 rounded-lg">
                  ※ {meishiki.setsuDay}日の節入り前のお生まれのため、前月扱いの命式です。
                </p>
              )}
            </div>

            {/* 五行バランス図 */}
            <div className={`bg-white/80 rounded-3xl p-6 border border-yellow-100 shadow-md transition-all duration-700 transform ${visibleElements.includes('chart') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-center font-bold text-gray-700 flex items-center justify-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-yellow-500" /> 命式の五行バランス
              </h3>
              <p className="text-xs text-center text-gray-500 mt-2">日干の五行を上部に配置。あなたのエネルギーの偏りと流れを表します</p>
              <GogyoChart counts={meishiki.gogyoCounts} dayGogyo={meishiki.dayGogyo} />
              <div className="mt-6 p-4 bg-yellow-50/50 rounded-xl text-sm text-gray-600 text-center">
                円が大きいほど、その五行の要素を多く持っています。バランスが良いか、特定の五行に特化しているかによって、あなたの強みや課題が見えてきます。
              </div>
            </div>

            <div className={`pt-2 transition-all duration-700 transform ${visibleElements.includes('button') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button onClick={handleReset}
                className="w-full py-4 bg-white text-gray-600 rounded-2xl border-2 border-pink-100 font-bold flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors">
                <RotateCcw className="w-5 h-5" /> もう一度占う
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="mt-8 text-center text-xs text-gray-400 pb-4">
        &copy; {new Date().getFullYear()} naturela. All rights reserved.
      </footer>
    </div>
  );
}
