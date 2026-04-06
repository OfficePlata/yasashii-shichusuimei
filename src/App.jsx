import { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, User, ArrowRight, RotateCcw, Heart, Star, BookOpen, Activity, Briefcase } from 'lucide-react';

const JIKKAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const JUNISHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const JIKKAN_DATA = [
  { name: "甲 (きのえ)", element: "木", description: "大樹のようにまっすぐで向上心があり、頼りがいのあるリーダータイプです。曲がったことが嫌いで、目標に向かって着実に成長していく力を持っています。" },
  { name: "乙 (きのと)", element: "木", description: "草花のように柔軟で協調性があり、周囲を和ませる魅力があります。環境に適応する能力が高く、人との繋がりを大切にする優しい性格です。" },
  { name: "丙 (ひのえ)", element: "火", description: "太陽のように明るく情熱的で、みんなを惹きつける中心的な存在です。裏表がなく、周りを明るく照らすエネルギーに満ち溢れています。" },
  { name: "丁 (ひのと)", element: "火", description: "月や灯火のように穏やかで洞察力があり、人の心を癒やす力があります。繊細で思慮深く、芸術的なセンスや独自の視点を持っています。" },
  { name: "戊 (つちのえ)", element: "土", description: "山のようにどっしりと落ち着いており、包容力と安心感を与えます。面倒見が良く、多くの人から頼りにされる器の大きさを持っています。" },
  { name: "己 (つちのと)", element: "土", description: "大地のように愛情深く、人を育む力があり、多くの人から慕われます。多芸多才で、物事を吸収して自分のものにするのが得意です。" },
  { name: "庚 (かのえ)", element: "金", description: "鉄や剣のように意思が強く、行動力があり、困難を切り開く力があります。決断力に優れ、スピーディーに物事を進める頼もしさがあります。" },
  { name: "辛 (かのと)", element: "金", description: "宝石のように繊細で美意識が高く、独自の輝きと感性を持っています。試練を乗り越えることでさらに輝きを増す、強い芯を持った人です。" },
  { name: "壬 (みずのえ)", element: "水", description: "海のようにスケールが大きく、自由を愛し、柔軟な発想ができます。束縛を嫌い、ダイナミックに人生を切り開いていくパワーを持っています。" },
  { name: "癸 (みずのと)", element: "水", description: "雨や露のように純粋で優しく、人知れず努力を重ねる忍耐強さがあります。尽くすことに喜びを感じ、知性豊かで静かな情熱を秘めています。" }
];

const TSUHENSEI_DATA = {
  "比肩": { catchphrase: "独立心と自己実現", description: "自分の信念を持ち、自分の力で道を切り開いていく独立心が旺盛です。人に頼らず、自分のペースで物事を進めることで才能を発揮します。" },
  "劫財": { catchphrase: "不屈の精神と目標達成", description: "柔軟な対応力を持ちながら、内に強い野心と負けず嫌いな一面を秘めています。大きな目標に向かって、粘り強く達成していく力があります。" },
  "食神": { catchphrase: "おおらかさと表現力", description: "明るく楽天的な性格で、周囲に安心感を与えます。衣食住や楽しいことが好きで、豊かな感受性を活かした表現力やセンスに優れています。" },
  "傷官": { catchphrase: "繊細な感性と鋭い直感", description: "非常に繊細で、鋭い直感と美意識を持っています。専門的な技術や芸術的な才能に恵まれ、頭脳明晰で物事の本質を見抜く力があります。" },
  "偏財": { catchphrase: "社交性と多趣味", description: "人当たりが良く、多方面での人脈作りに長けています。サービス精神が旺盛で気配りができるため、多くの人から慕われ、商売の才能もあります。" },
  "正財": { catchphrase: "誠実さと堅実な歩み", description: "真面目で責任感が強く、計画的に物事を進めるのが得意です。誠実な人柄で周囲からの信頼が厚く、着実に財産や実績を築き上げていきます。" },
  "偏官": { catchphrase: "行動力とリーダーシップ", description: "思い立ったら即行動する、エネルギッシュで決断力のあるタイプです。義理人情に厚く、困難な状況でも先頭に立って切り開く頼もしさがあります。" },
  "正官": { catchphrase: "責任感と気品", description: "規律やルールを重んじ、真面目で責任感が強い優等生タイプです。気品とプライドを持ち、組織の中で重要な役割を担うことで輝きます。" },
  "偏印": { catchphrase: "知的好奇心と発想力", description: "好奇心旺盛で、型にはまらない自由な発想が得意です。ユニークなアイデアや個性を活かし、変化の多い環境でクリエイティブな才能を発揮します。" },
  "印綬": { catchphrase: "探求心と深い愛情", description: "学ぶことが好きで、論理的かつ深く物事を考える知性派です。伝統や学問を大切にし、人に何かを教えたり育んだりすることに喜びを感じます。" }
};

const GOGYO_COLORS = { 0: "#86efac", 1: "#fca5a5", 2: "#fde047", 3: "#d1d5db", 4: "#93c5fd" };
const SHI_GOGYO = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
const ZOUKAN_MAP = [9, 5, 0, 1, 4, 2, 3, 5, 6, 7, 4, 8];

const JUNIUN_TABLE = [
  ["沐浴", "冠帯", "建禄", "帝旺", "衰", "病", "死", "墓", "絶", "胎", "養", "長生"],
  ["病", "衰", "帝旺", "建禄", "冠帯", "沐浴", "長生", "養", "胎", "絶", "墓", "死"],
  ["胎", "養", "長生", "沐浴", "冠帯", "建禄", "帝旺", "衰", "病", "死", "墓", "絶"],
  ["絶", "墓", "死", "病", "衰", "帝旺", "建禄", "冠帯", "沐浴", "長生", "養", "胎"],
  ["胎", "養", "長生", "沐浴", "冠帯", "建禄", "帝旺", "衰", "病", "死", "墓", "絶"],
  ["絶", "墓", "死", "病", "衰", "帝旺", "建禄", "冠帯", "沐浴", "長生", "養", "胎"],
  ["死", "墓", "絶", "胎", "養", "長生", "沐浴", "冠帯", "建禄", "帝旺", "衰", "病"],
  ["長生", "沐浴", "冠帯", "建禄", "帝旺", "衰", "病", "死", "墓", "絶", "胎", "養"],
  ["帝旺", "衰", "病", "死", "墓", "絶", "胎", "養", "長生", "沐浴", "冠帯", "建禄"],
  ["建禄", "冠帯", "沐浴", "長生", "養", "胎", "絶", "墓", "死", "病", "衰", "帝旺"]
];

const ENERGY_MAP = {
  "胎": 3, "養": 6, "長生": 9, "沐浴": 7, "冠帯": 10, "建禄": 11,
  "帝旺": 12, "衰": 8, "病": 4, "死": 2, "墓": 5, "絶": 1
};

function getTsuhensei(baseIdx, targetIdx) {
  if (targetIdx == null) return "-";
  const baseGogyo = Math.floor(baseIdx / 2);
  const targetGogyo = Math.floor(targetIdx / 2);
  const diff = (targetGogyo - baseGogyo + 5) % 5;
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

function getSetsuiriDay(year, month) {
  const params = {
    1: 5.4055, 2: 4.6215, 3: 5.6028, 4: 4.8454, 5: 5.6268, 6: 5.7275,
    7: 7.2847, 8: 7.6360, 9: 7.8228, 10: 8.4069, 11: 7.5255, 12: 7.2625
  };
  return Math.floor(params[month] + 0.2422 * (year - 1980) - Math.floor((year - 1980) / 4));
}

function calculateMeishiki(dateObj) {
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate();

  const baseDate = new Date(Date.UTC(1900, 0, 1, 12, 0, 0));
  const targetDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / 86400000);

  let dayKanIdx = (0 + diffDays % 10) % 10;
  if (dayKanIdx < 0) dayKanIdx += 10;
  let dayShiIdx = (10 + diffDays % 12) % 12;
  if (dayShiIdx < 0) dayShiIdx += 12;

  let setsuYear = y;
  let setsuMonth = m;
  const setsuDay = getSetsuiriDay(y, m);
  if (d < setsuDay) {
    setsuMonth -= 1;
    if (setsuMonth === 0) { setsuMonth = 12; setsuYear -= 1; }
  }

  let kY = setsuYear;
  if (setsuMonth === 1) kY -= 1;

  let yearKanIdx = (kY - 4) % 10;
  if (yearKanIdx < 0) yearKanIdx += 10;
  let yearShiIdx = (kY - 4) % 12;
  if (yearShiIdx < 0) yearShiIdx += 12;

  const emY = kY - 1900;
  let emM = setsuMonth - 2;
  if (setsuMonth === 1) emM = 11;
  else if (setsuMonth === 12) emM = 10;
  const totalMonths = emY * 12 + emM;
  let monthKanIdx = (4 + totalMonths % 10) % 10;
  if (monthKanIdx < 0) monthKanIdx += 10;
  let monthShiIdx = (2 + totalMonths % 12) % 12;
  if (monthShiIdx < 0) monthShiIdx += 12;

  const yearZoukanIdx = ZOUKAN_MAP[yearShiIdx];
  const monthZoukanIdx = ZOUKAN_MAP[monthShiIdx];
  const dayZoukanIdx = ZOUKAN_MAP[dayShiIdx];

  const gogyoCounts = [0, 0, 0, 0, 0];
  gogyoCounts[Math.floor(yearKanIdx / 2)]++;
  gogyoCounts[Math.floor(monthKanIdx / 2)]++;
  gogyoCounts[Math.floor(dayKanIdx / 2)]++;
  gogyoCounts[SHI_GOGYO[yearShiIdx]]++;
  gogyoCounts[SHI_GOGYO[monthShiIdx]]++;
  gogyoCounts[SHI_GOGYO[dayShiIdx]]++;

  const buildPillar = (kanIdx, shiIdx, zoukanIdx, baseKanIdx) => {
    const juniunsei = JUNIUN_TABLE[baseKanIdx][shiIdx];
    return {
      kan: JIKKAN[kanIdx],
      shi: JUNISHI[shiIdx],
      zoukan: JIKKAN[zoukanIdx],
      tsuhensei: kanIdx === baseKanIdx && kanIdx === dayKanIdx ? "-" : getTsuhensei(baseKanIdx, kanIdx),
      zoukanTsuhensei: getTsuhensei(baseKanIdx, zoukanIdx),
      juniunsei,
      energy: ENERGY_MAP[juniunsei]
    };
  };

  return {
    dayKanIdx,
    year: buildPillar(yearKanIdx, yearShiIdx, yearZoukanIdx, dayKanIdx),
    month: buildPillar(monthKanIdx, monthShiIdx, monthZoukanIdx, dayKanIdx),
    day: buildPillar(dayKanIdx, dayShiIdx, dayZoukanIdx, dayKanIdx),
    isBeforeSetsuiri: d < setsuDay,
    setsuDay,
    gogyoCounts
  };
}

function GogyoChart({ counts }) {
  const points = [
    { x: 50, y: 15, name: "木" },
    { x: 85, y: 40, name: "火" },
    { x: 70, y: 80, name: "土" },
    { x: 30, y: 80, name: "金" },
    { x: 15, y: 40, name: "水" }
  ];
  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto mt-6 bg-white/50 rounded-full p-4 shadow-inner border border-gray-100">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <polygon points="50,15 85,40 70,80 30,80 15,40" fill="none" stroke="#fbcfe8" strokeWidth="1" strokeDasharray="2,2" />
        <polygon points="50,15 70,80 15,40 85,40 30,80" fill="none" stroke="#d1d5db" strokeWidth="1" strokeDasharray="1,3" />
        {points.map((pt, i) => {
          const count = counts[i];
          const size = count > 0 ? 8 + (count * 1.5) : 6;
          return (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r={size} fill={GOGYO_COLORS[i]} opacity={count > 0 ? 1 : 0.3} />
              <text x={pt.x} y={pt.y + 1.5} fontSize="5" textAnchor="middle" alignmentBaseline="middle" fill={count > 0 ? '#374151' : '#9ca3af'} fontWeight="bold">
                {pt.name}
              </text>
              <circle cx={pt.x + size} cy={pt.y - size} r="3" fill="#fff" stroke="#fbcfe8" strokeWidth="0.5" />
              <text x={pt.x + size} y={pt.y - size + 1.5} fontSize="3.5" textAnchor="middle" alignmentBaseline="middle" fill="#ec4899" fontWeight="bold">
                {count}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="absolute top-2 left-2 text-[10px] text-gray-400">
        <p>-- 相生（生み出す）</p>
        <p>･･ 相剋（抑え込む）</p>
      </div>
    </div>
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
    const timeString = formData.birthTime ? `${formData.birthTime}:00` : '12:00:00';
    const birthDateObj = new Date(`${formData.birthDate}T${timeString}+09:00`);
    if (birthDateObj.getHours() >= 23) {
      birthDateObj.setDate(birthDateObj.getDate() + 1);
    }
    setMeishiki(calculateMeishiki(birthDateObj));
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
      const elements = ['dayCard', 'monthCard', 'table', 'chart', 'button'];
      elements.forEach((el, index) => {
        setTimeout(() => {
          setVisibleElements(prev => [...prev, el]);
        }, 150 + index * 200);
      });
    }
  }, [step, meishiki]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans text-gray-700 selection:bg-pink-200 selection:text-pink-900 pb-12">
      <header className="p-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-pink-400 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          やさしい四柱推命
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
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all outline-none" required />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <User className="w-4 h-4 text-pink-400" />
                  性別 <span className="text-xs text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">必須</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['female', 'male'].map((g) => (
                    <button key={g} type="button" onClick={() => setFormData(prev => ({ ...prev, gender: g }))} className={`py-3 px-4 rounded-2xl border-2 transition-all font-medium ${formData.gender === g ? 'border-pink-300 bg-pink-50 text-pink-700' : 'border-gray-50 bg-gray-50 text-gray-500'}`}>
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
                <input type="time" name="birthTime" value={formData.birthTime} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300 transition-all outline-none" />
                <p className="text-xs text-gray-400 pl-1">※23時以降は翌日の干支として計算されます</p>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={!isFormValid} className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-lg font-bold transition-all duration-300 ${isFormValid ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-lg shadow-pink-200 hover:scale-[1.02]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  命式を詳しく紐解く <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'result' && meishiki && (
          <div className="space-y-6 pb-8">

            {/* 本質の星カード（日柱） */}
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

            {/* 才能・社会性の星カード（月柱・主星） */}
            <div className={`bg-white/80 backdrop-blur-md rounded-3xl shadow-lg shadow-yellow-100/50 p-6 border border-white transition-all duration-700 transform ${visibleElements.includes('monthCard') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-center font-bold text-gray-700 mb-4 flex items-center justify-center gap-2">
                <Briefcase className="w-5 h-5 text-yellow-500" />
                あなたの才能・社会性（主星）
              </h3>
              <div className="bg-yellow-50/50 rounded-2xl p-5 border border-yellow-100 text-center space-y-3">
                <div className="text-2xl font-bold text-yellow-700">{meishiki.month.zoukanTsuhensei}</div>
                <div className="text-sm font-semibold text-yellow-600 border-b border-yellow-200 pb-2 inline-block">
                  {TSUHENSEI_DATA[meishiki.month.zoukanTsuhensei]?.catchphrase}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed pt-2 text-left">
                  {TSUHENSEI_DATA[meishiki.month.zoukanTsuhensei]?.description}
                </p>
              </div>
            </div>

            {/* 詳細命式表 */}
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
                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] bg-pink-100 text-pink-600 px-1.5 rounded-sm">本質</span>
                        日柱
                      </th>
                      <th className="py-3 px-2 text-yellow-600 font-bold w-1/4 relative">
                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] bg-yellow-100 text-yellow-700 px-1.5 rounded-sm">才能</span>
                        月柱
                      </th>
                      <th className="py-3 px-2 text-gray-400 font-bold w-1/4">年柱</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm md:text-base text-gray-700">
                    <tr className="border-b border-gray-50 bg-gray-50/50">
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
                      <td className="py-3 px-2 text-gray-300 bg-pink-50/30">-</td>
                      <td className="py-3 px-2 text-yellow-600 bg-yellow-50/30">{meishiki.month.tsuhensei}</td>
                      <td className="py-3 px-2 text-gray-500">{meishiki.year.tsuhensei}</td>
                    </tr>
                    <tr className="border-b border-gray-50 bg-gray-50/30">
                      <td className="py-3 px-2 text-xs text-gray-500 text-left">蔵干通変星</td>
                      <td className="py-3 px-2 text-pink-600 bg-pink-50/30">{meishiki.day.zoukanTsuhensei}</td>
                      <td className="py-3 px-2 text-yellow-600 font-bold bg-yellow-50/30">{meishiki.month.zoukanTsuhensei}</td>
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
                <p className="text-xs text-pink-600 mt-2 text-center bg-pink-50 py-1.5 rounded-lg">※ {meishiki.setsuDay}日の節入り前のお生まれのため、前月扱いの命式です。</p>
              )}
            </div>

            {/* 五行バランス図 */}
            <div className={`bg-white/80 rounded-3xl p-6 border border-yellow-100 shadow-md transition-all duration-700 transform ${visibleElements.includes('chart') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-center font-bold text-gray-700 flex items-center justify-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-yellow-500" /> 命式の五行バランス
              </h3>
              <p className="text-xs text-center text-gray-500 mt-2">あなたの持っているエネルギーの偏りや流れを表します</p>
              <GogyoChart counts={meishiki.gogyoCounts} />
              <div className="mt-6 p-4 bg-yellow-50/50 rounded-xl text-sm text-gray-600 text-center">
                円が大きいほど、その五行の要素を多く持っています。バランスが良いか、特定の五行に特化しているかによって、あなたの強みや課題が見えてきます。
              </div>
            </div>

            {/* 戻るボタン */}
            <div className={`pt-2 transition-all duration-700 transform ${visibleElements.includes('button') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button onClick={handleReset} className="w-full py-4 bg-white text-gray-600 rounded-2xl border-2 border-pink-100 font-bold flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors">
                <RotateCcw className="w-5 h-5" /> もう一度占う
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
