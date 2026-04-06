import { useState } from 'react';
import { Sparkles, Calendar, Clock, User, ArrowRight, RotateCcw, Heart, Star, BookOpen } from 'lucide-react';

const JIKKAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const JUNISHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 十干（日干）のデータ
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

// 節入り日の計算（太陽黄経に基づく略算式: 1900〜2099年対応）
function getSetsuiriDay(year, month) {
  const params = {
    1: 5.4055, 2: 4.6215, 3: 5.6028, 4: 4.8454, 5: 5.6268, 6: 5.7275,
    7: 7.2847, 8: 7.6360, 9: 7.8228, 10: 8.4069, 11: 7.5255, 12: 7.2625
  };
  return Math.floor(params[month] + 0.2422 * (year - 1980) - Math.floor((year - 1980) / 4));
}

// 命式の計算ロジック
function calculateMeishiki(dateObj) {
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate();

  // 1. 日干支 (1900年1月1日[甲戌]を基準に計算)
  const baseDate = new Date(Date.UTC(1900, 0, 1, 12, 0, 0));
  const targetDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / 86400000);

  let dayKanIdx = (0 + diffDays % 10) % 10;
  if (dayKanIdx < 0) dayKanIdx += 10;
  let dayShiIdx = (10 + diffDays % 12) % 12;
  if (dayShiIdx < 0) dayShiIdx += 12;

  // 2. 年と月の節入り判定
  let setsuYear = y;
  let setsuMonth = m;
  const setsuDay = getSetsuiriDay(y, m);

  // 誕生日がその月の節入り前なら、前月扱いとする
  if (d < setsuDay) {
    setsuMonth -= 1;
    if (setsuMonth === 0) {
      setsuMonth = 12;
      setsuYear -= 1;
    }
  }

  // 四柱推命の「年」は立春（2月節）からスタート
  let kY = setsuYear;
  if (setsuMonth === 1) kY -= 1; // 1月節生まれは旧年扱い

  // 3. 年干支計算 (1984年が甲子=0)
  let yearKanIdx = (kY - 4) % 10;
  if (yearKanIdx < 0) yearKanIdx += 10;
  let yearShiIdx = (kY - 4) % 12;
  if (yearShiIdx < 0) yearShiIdx += 12;

  // 4. 月干支計算 (1900年2月節[戊寅]を基準に経過月数から算出)
  const emY = kY - 1900;
  let emM = setsuMonth - 2;
  if (setsuMonth === 1) emM = 11;
  else if (setsuMonth === 12) emM = 10;

  const totalMonths = emY * 12 + emM;
  let monthKanIdx = (4 + totalMonths % 10) % 10;
  if (monthKanIdx < 0) monthKanIdx += 10;
  let monthShiIdx = (2 + totalMonths % 12) % 12;
  if (monthShiIdx < 0) monthShiIdx += 12;

  return {
    day: { kan: JIKKAN[dayKanIdx], shi: JUNISHI[dayShiIdx], kanIdx: dayKanIdx },
    month: { kan: JIKKAN[monthKanIdx], shi: JUNISHI[monthShiIdx] },
    year: { kan: JIKKAN[yearKanIdx], shi: JUNISHI[yearShiIdx] },
    isBeforeSetsuiri: d < setsuDay,
    setsuDay
  };
}

export default function App() {
  const [step, setStep] = useState('input');
  const [formData, setFormData] = useState({
    birthDate: '',
    gender: '',
    birthTime: ''
  });
  const [meishiki, setMeishiki] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.birthDate || !formData.gender) return;

    // 日本時間 (JST) として解釈
    const timeString = formData.birthTime ? `${formData.birthTime}:00` : '12:00:00';
    const birthDateObj = new Date(`${formData.birthDate}T${timeString}+09:00`);

    // 子刻（23時以降）は翌日の日干支になる
    if (birthDateObj.getHours() >= 23) {
      birthDateObj.setDate(birthDateObj.getDate() + 1);
    }

    const calculatedMeishiki = calculateMeishiki(birthDateObj);
    setMeishiki(calculatedMeishiki);

    setTimeout(() => {
      setStep('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const handleReset = () => {
    setStep('input');
    setFormData({ birthDate: '', gender: '', birthTime: '' });
    setMeishiki(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFormValid = formData.birthDate !== '' && formData.gender !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans text-gray-700 selection:bg-pink-200 selection:text-pink-900">

      <header className="p-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-pink-400 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          やさしい四柱推命
          <Heart className="w-5 h-5 text-pink-300" />
        </h1>
        <p className="mt-2 text-sm text-gray-500">節入りを考慮した本格的な命式算出</p>
      </header>

      <main className="max-w-md mx-auto px-4 pb-12">
        {step === 'input' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100/50 p-6 md:p-8 border border-white/50 animate-in fade-in slide-in-from-bottom-4">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <Calendar className="w-4 h-4 text-yellow-500" />
                  生年月日 <span className="text-xs text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">必須</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all outline-none text-gray-700"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <User className="w-4 h-4 text-pink-400" />
                  性別 <span className="text-xs text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">必須</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['female', 'male'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                      className={`py-3 px-4 rounded-2xl border-2 transition-all duration-200 text-sm font-medium
                        ${formData.gender === g
                          ? 'border-pink-300 bg-pink-50 text-pink-700 shadow-sm'
                          : 'border-gray-50 bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                    >
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
                <input
                  type="time"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300 transition-all outline-none text-gray-700"
                />
                <p className="text-xs text-gray-400 pl-1">※23時以降は翌日の干支として計算されます</p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-lg font-bold transition-all duration-300
                    ${isFormValid
                      ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-[1.02] active:scale-95'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  命式を紐解く
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </form>
          </div>
        )}

        {step === 'result' && meishiki && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* メイン結果カード（日干） */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-pink-100/60 p-8 border border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Star className="w-32 h-32 text-yellow-500" />
              </div>

              <div className="relative z-10 text-center space-y-4">
                <p className="text-sm font-bold text-pink-400 tracking-wider">あなたの本質を表す星（日干）</p>
                <div className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-50 to-pink-50 rounded-2xl border border-white shadow-sm">
                  <h2 className="text-4xl font-extrabold text-gray-800 tracking-widest">
                    {JIKKAN_DATA[meishiki.day.kanIdx].name.split(' ')[0]}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{JIKKAN_DATA[meishiki.day.kanIdx].name.split(' ')[1]}</p>
                </div>
                <div className="pt-6 text-left space-y-4">
                  <h3 className="text-lg font-bold border-b border-pink-100 pb-2 text-gray-700 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    性格の傾向
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {JIKKAN_DATA[meishiki.day.kanIdx].description}
                  </p>
                </div>
              </div>
            </div>

            {/* 命式表 */}
            <div className="bg-white/80 rounded-3xl p-6 border border-pink-100 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 bg-gradient-to-b from-yellow-300 to-pink-300 h-full"></div>
              <h3 className="text-center font-bold text-gray-700 mb-5 flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5 text-pink-400" />
                あなたの命式（三柱）
              </h3>

              <div className="grid grid-cols-3 gap-3 text-center relative z-10">
                <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                  <div className="text-xs font-semibold text-gray-400 mb-2">年柱</div>
                  <div className="text-2xl font-bold text-gray-700">{meishiki.year.kan}</div>
                  <div className="text-2xl font-bold text-gray-700">{meishiki.year.shi}</div>
                </div>
                <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                  <div className="text-xs font-semibold text-gray-400 mb-2">月柱</div>
                  <div className="text-2xl font-bold text-gray-700">{meishiki.month.kan}</div>
                  <div className="text-2xl font-bold text-gray-700">{meishiki.month.shi}</div>
                </div>
                <div className="bg-pink-50/80 rounded-xl p-3 border border-pink-200 shadow-sm relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-gradient-to-r from-pink-400 to-pink-500 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">
                    本質
                  </div>
                  <div className="text-xs font-semibold text-pink-400 mb-2">日柱</div>
                  <div className="text-2xl font-bold text-pink-700">{meishiki.day.kan}</div>
                  <div className="text-2xl font-bold text-pink-700">{meishiki.day.shi}</div>
                </div>
              </div>

              {meishiki.isBeforeSetsuiri && (
                <p className="text-xs text-pink-600 mt-4 text-center font-medium bg-pink-50 py-2 rounded-lg">
                  ※ その月の節入り日（{meishiki.setsuDay}日）より前のお生まれのため、前月扱いの干支となります。
                </p>
              )}
            </div>

            {/* 戻るボタン */}
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="w-full py-4 bg-white text-gray-600 rounded-2xl border-2 border-pink-100 font-bold flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors duration-300"
              >
                <RotateCcw className="w-5 h-5" />
                もう一度占う
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
