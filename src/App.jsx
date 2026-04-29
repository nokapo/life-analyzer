import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  User, 
  Wind, 
  Coffee, 
  Moon, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  Navigation,
  HeartPulse,
  Sparkles,
  BarChart3
} from 'lucide-react';

/**
 * AI寿命判定システム (SNS/Mobile Optimized Version)
 * 特徴: バズりやすいモダンUI、ダークモード見やすさ向上、キャッチーなキャラ設定。
 */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&family=Montserrat:wght@700;900&display=swap');

  :root {
    --bg-color: #0f172a;
    --panel-color: rgba(30, 41, 59, 0.7);
    --accent-pink: #ec4899;
    --accent-cyan: #06b6d4;
    color-scheme: dark;
  }

  body {
    color: #f8fafc;
    background-color: var(--bg-color);
  }

  .font-sans-jp { font-family: 'Noto Sans JP', sans-serif; }
  .font-en { font-family: 'Montserrat', sans-serif; }

  .bg-modern {
    background-color: #0f172a;
    background-image: 
      radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
      radial-gradient(at 50% 0%, hsla(225,39%,30%,0.2) 0, transparent 50%), 
      radial-gradient(at 100% 0%, hsla(339,49%,30%,0.2) 0, transparent 50%);
    background-attachment: fixed;
  }

  .glass-panel {
    background: var(--panel-color);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .glow-text {
    text-shadow: 0 0 15px rgba(6, 182, 212, 0.5);
  }

  .glow-text-pink {
    text-shadow: 0 0 15px rgba(236, 72, 153, 0.6);
  }

  .animate-reveal {
    animation: reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }

  @keyframes reveal {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .input-field {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff !important;
    transition: all 0.2s;
    font-size: 16px !important; /* スマホでのズーム防止 */
  }

  /* セレクトボックスのOS標準デザインリセット */
  select.input-field {
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%></path>%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1.2rem;
    padding-right: 2.5rem;
  }

  .input-field:focus {
    border-color: var(--accent-cyan);
    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
    outline: none;
  }

  .btn-gradient {
    background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .btn-gradient::after {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: skewX(-20deg);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { left: -100%; }
    20% { left: 200%; }
    100% { left: 200%; }
  }
`;

// --- メッセージ生成ロジック (バズりやすいSNS向けキャラ) ---
const generateLocalMessage = (data, result, channel) => {
  const isHealthy = data.smoking === 'none' && data.drinking === 'none' && data.sleep === 'good';
  const isBad = data.smoking === 'everyday' || data.drinking === 'everyday' || data.sleep === 'short';

  const messages = {
    ai: {
      good: `データ解析完了。あなたの生活習慣は非常に優秀です。このまま健康的なパラメータを維持し、生存日数を最大化してください。`,
      bad: `警告。現在の生活習慣は控えめに言って「破滅的」です。このままでは予定より早く肉体がシャットダウンします。改善を強く推奨します。`,
      normal: `解析完了。現状は平均的なパラメータです。しかし、日々の些細な不摂生が未来の寿命を削ることを忘れないでください。`
    },
    gal: {
      good: `え、マジで完璧じゃん！健康意識高すぎ！その調子で超ハッピーライフ満喫しちゃおー！テンション上げてこ！✨`,
      bad: `ちょ、マジでヤバくない？そんな生活してたらソッコーで終わっちゃうよ！もっと自分のカラダ大事にしなよ、ガチで！💦`,
      normal: `んー、まあ普通？でもさ、もっと健康に気を使ったら、もっと長生きして楽しいこといっぱいできるっしょ！🤟`
    },
    okan: {
      good: `あんた、ホンマにえらいわ！ちゃんと食べて寝てるんやね。おかん安心したわー。この調子やで！`,
      bad: `ちょっと！またそんな不摂生して！おかん、あんたの体が心配で夜も眠れへんわ！今日から酒もタバコも禁止やで！💢`,
      normal: `まあまあやね。でも油断は禁物やで。野菜もしっかり食べなあかんよ。体冷やさんようにしなさいよ。`
    },
    cat: {
      good: `ニャーオ。（お前が長生きしてくれないと、美味しいご飯が食べられないニャ。その調子で頼むニャ）🐈`,
      bad: `シャーッ！（そんなボロボロの体で私を撫でる気ニャ！？早く寝て健康になるニャ！）🐾`,
      normal: `ニャン。（まあ、普通ニャね。とりあえず私のトイレ掃除を優先するニャ）🐟`
    },
    chu2: {
      good: `フフフ…清浄なる魂の輝きか。終焉の刻印は未だ遠い。その光、闇に飲まれぬよう大切に守り抜くがいい…。👁️`,
      bad: `ククク…瘴気に蝕まれしその肉体、崩壊へのカウントダウンは既に始まっている。貴様に宿る闇を制御せねば、魂ごと消滅するぞ。⚡`,
      normal: `運命の歯車は静かに、だが確実に回っている。光と闇が均衡を保つこの瞬間、己の中の混沌を鎮めることができるか。🌑`
    }
  };

  const type = isHealthy ? 'good' : isBad ? 'bad' : 'normal';
  return messages[channel][type];
};

const calculateLifeData = (data) => {
  const birth = new Date(data.birthDate);
  const now = new Date();
  let baseHealth = data.gender === 'male' ? 72.6 : 75.5;
  let baseLife = data.gender === 'male' ? 81.5 : 87.6;

  if (data.smoking === 'sometimes') { baseHealth -= 1.0; baseLife -= 1.5; }
  else if (data.smoking === 'everyday') { baseHealth -= 3.5; baseLife -= 5.0; }
  if (data.drinking === 'none') { baseHealth += 0.5; baseLife += 0.5; }
  else if (data.drinking === 'everyday') { baseHealth -= 1.5; baseLife -= 2.0; }
  if (data.sleep === 'short') { baseHealth -= 1.5; baseLife -= 1.5; }
  else if (data.sleep === 'good') { baseHealth += 0.5; baseLife += 0.5; }

  const getTargetDate = (years) => {
    const d = new Date(birth);
    d.setFullYear(d.getFullYear() + Math.floor(years));
    const daysToAdd = Math.floor((years % 1) * 365.25);
    d.setDate(d.getDate() + daysToAdd);
    return d;
  };

  const healthDate = getTargetDate(baseHealth);
  const lifeDate = getTargetDate(baseLife);
  const diffHealth = Math.ceil((healthDate - now) / (1000 * 60 * 60 * 24));
  const diffLife = Math.ceil((lifeDate - now) / (1000 * 60 * 60 * 24));
  const totalLifeDays = Math.ceil((lifeDate - birth) / (1000 * 60 * 60 * 24));
  const livedDays = Math.ceil((now - birth) / (1000 * 60 * 60 * 24));
  let progressRate = ((livedDays / totalLifeDays) * 100).toFixed(2);
  if (progressRate > 100) progressRate = 100;

  return {
    healthDays: diffHealth, lifeDays: diffLife, progressRate,
    isHealthOver: diffHealth < 0, isLifeOver: diffLife < 0,
    healthAge: baseHealth.toFixed(1), lifeAge: baseLife.toFixed(1)
  };
};

function InputScreen({ onCalculate }) {
  const [formData, setFormData] = useState({
    birthYear: '1990', birthMonth: '1', birthDay: '1',
    gender: 'male', smoking: 'none', drinking: 'none', sleep: 'normal'
  });

  useEffect(() => {
    const saved = localStorage.getItem('lifeAnalyzerData_sns');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("保存データの読み込みに失敗しました");
      }
    }
  }, []);

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 font-sans-jp">
      <div className="glass-panel max-w-2xl w-full p-6 md:p-10 rounded-3xl relative animate-reveal text-gray-100 border-t-2 border-t-cyan-400/30">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 mb-10 pb-6 text-center md:text-left border-b border-gray-700">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-2xl">
            <HeartPulse className="text-pink-400 w-10 h-10 glow-text-pink flex-shrink-0" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">AI寿命判定システム</h1>
            <p className="text-sm text-cyan-400 font-bold opacity-80">- あなたの残された時間を計算します -</p>
          </div>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem('lifeAnalyzerData_sns', JSON.stringify(formData));
          const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
          onCalculate({ ...formData, birthDate });
        }} className="space-y-8">
          
          {/* 見やすくしたパネルの背景色と境界線 */}
          <section className="space-y-5 bg-gray-800/80 p-6 md:p-8 rounded-2xl border border-gray-700 shadow-lg">
            <h2 className="text-base text-cyan-300 flex items-center gap-2 font-bold mb-2">
              <User className="w-5 h-5 text-cyan-400" /> 基本データ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 ml-1 font-bold">誕生年</label>
                <select value={formData.birthYear} onChange={e => setFormData({...formData, birthYear: e.target.value})} className="input-field w-full p-4 rounded-xl font-bold">
                  {years.map(y => <option key={y} value={y}>{y}年</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 ml-1 font-bold">月</label>
                <select value={formData.birthMonth} onChange={e => setFormData({...formData, birthMonth: e.target.value})} className="input-field w-full p-4 rounded-xl font-bold">
                  {Array.from({length:12}, (_, i) => i+1).map(m => <option key={m} value={m}>{m}月</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 ml-1 font-bold">日</label>
                <select value={formData.birthDay} onChange={e => setFormData({...formData, birthDay: e.target.value})} className="input-field w-full p-4 rounded-xl font-bold">
                  {Array.from({length:31}, (_, i) => i+1).map(d => <option key={d} value={d}>{d}日</option>)}
                </select>
              </div>
              
              {/* 性別もセレクトボックスに変更 */}
              <div className="space-y-2 md:col-span-3 pt-2">
                <label className="text-sm text-gray-300 ml-1 font-bold">性別</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="input-field w-full p-4 rounded-xl font-bold">
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                </select>
              </div>
            </div>
          </section>

          {/* 見やすくしたパネルの背景色と境界線 */}
          <section className="space-y-5 bg-gray-800/80 p-6 md:p-8 rounded-2xl border border-gray-700 shadow-lg">
            <h2 className="text-base text-pink-300 flex items-center gap-2 font-bold mb-2">
              <Activity className="w-5 h-5 text-pink-400" /> ライフスタイル
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 flex items-center gap-1 font-bold"><Wind className="w-4 h-4" /> 喫煙</label>
                <select value={formData.smoking} onChange={e => setFormData({...formData, smoking: e.target.value})} className="input-field w-full p-4 rounded-xl font-bold">
                  <option value="none">吸わない</option><option value="sometimes">時々吸う</option><option value="everyday">毎日吸う</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 flex items-center gap-1 font-bold"><Coffee className="w-4 h-4" /> 飲酒</label>
                <select value={formData.drinking} onChange={e => setFormData({...formData, drinking: e.target.value})} className="input-field w-full p-4 rounded-xl font-bold">
                  <option value="none">飲まない</option><option value="sometimes">時々飲む</option><option value="everyday">毎日飲む</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 flex items-center gap-1 font-bold"><Moon className="w-4 h-4" /> 睡眠</label>
                <select value={formData.sleep} onChange={e => setFormData({...formData, sleep: e.target.value})} className="input-field w-full p-4 rounded-xl font-bold">
                  <option value="short">寝不足気味</option><option value="normal">普通</option><option value="good">十分寝てる</option>
                </select>
              </div>
            </div>
          </section>

          {/* 大きく派手にしたボタン */}
          <button type="submit" className="btn-gradient w-full py-6 mt-10 rounded-2xl text-white font-extrabold tracking-widest text-2xl shadow-[0_10px_25px_-5px_rgba(236,72,153,0.5)]">
            寿命を予測する
          </button>
          
          <div className="mt-8 text-xs text-gray-500 text-center leading-relaxed font-bold">
            ※予測ベース値は厚生労働省「令和元年簡易生命表」等を参照しています。<br/>
            ※生活習慣による寿命増減は独自シミュレーションに基づくエンタメ推計です。
          </div>
        </form>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-cyan-400 font-sans-jp">
      <div className="w-64 space-y-6">
        <div className="flex justify-center mb-4">
          <Sparkles className="w-12 h-12 animate-pulse text-pink-400" />
        </div>
        <div className="h-2 bg-gray-800 w-full overflow-hidden relative rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 w-1/3 animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
        <div className="text-center text-sm font-bold animate-pulse text-gray-300">
          あなたの未来を計算中...
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

function ResultScreen({ result, formData, onReset }) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState("ai"); // デフォルトを辛口AIに
  const [showOthers, setShowOthers] = useState(false);

  const aiMessage = generateLocalMessage(formData, result, "ai");

  const handleFetch = () => {
    setLoading(true);
    setTimeout(() => {
      setMsg(generateLocalMessage(formData, result, channel));
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-20 font-sans-jp">
      <div className="glass-panel max-w-5xl w-full p-4 md:p-10 rounded-3xl animate-reveal relative overflow-hidden text-gray-100 border-t-2 border-t-pink-500/30">
        
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gray-800/60 p-5 border border-gray-700 rounded-2xl shadow-sm">
            <p className="text-xs text-gray-400 mb-1 font-bold">予測健康寿命</p>
            <p className="text-3xl font-extrabold text-white font-en">{result.healthAge}<span className="text-sm ml-1 text-gray-400 font-sans-jp">歳</span></p>
          </div>
          <div className="bg-gray-800/60 p-5 border border-gray-700 rounded-2xl shadow-sm">
            <p className="text-xs text-gray-400 mb-1 font-bold">予測平均寿命</p>
            <p className="text-3xl font-extrabold text-white font-en">{result.lifeAge}<span className="text-sm ml-1 text-gray-400 font-sans-jp">歳</span></p>
          </div>
          <div className="col-span-2 bg-pink-950/20 p-5 border border-pink-900/30 rounded-2xl relative overflow-hidden">
            <p className="text-xs text-pink-400 mb-2 font-bold">人生の進行度</p>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-extrabold text-pink-400 font-en glow-text-pink">{result.progressRate}%</p>
              <div className="flex-1 h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                <div className="h-full bg-gradient-to-r from-pink-500 to-orange-400 transition-all duration-1000" style={{width: `${result.progressRate}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Countdown */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center py-10 border-y border-gray-700 mb-10 bg-gray-800/30 rounded-2xl">
          <div className="text-center space-y-3 w-full md:w-1/2">
            <h3 className="text-sm text-cyan-400 font-bold">健康でいられる残り時間</h3>
            <div className={`text-5xl md:text-7xl font-extrabold font-en flex items-baseline justify-center gap-2 ${result.isHealthOver ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              <span className="text-xl md:text-2xl font-bold text-gray-400 font-sans-jp">{result.isHealthOver ? "" : "あと"}</span>
              {result.isHealthOver ? "LIMIT" : result.healthDays.toLocaleString()}
              <span className="text-xl md:text-2xl font-bold text-gray-400 font-sans-jp">{result.isHealthOver ? "" : "日"}</span>
            </div>
            <p className="text-gray-400 text-xs font-bold">{result.isHealthOver ? "健康寿命の目安を超過しています" : "Days Remaining"}</p>
          </div>
          
          <div className="hidden md:block w-px h-32 bg-gray-700"></div>

          <div className="text-center space-y-3 w-full md:w-1/2">
            <h3 className="text-sm text-pink-400 font-bold">人生の残り時間</h3>
            <div className="text-5xl md:text-7xl font-extrabold font-en text-pink-500 flex items-baseline justify-center gap-2 glow-text-pink">
              <span className="text-xl md:text-2xl font-bold text-pink-300 font-sans-jp">あと</span>
              {result.isLifeOver ? "ERROR" : result.lifeDays.toLocaleString()}
              <span className="text-xl md:text-2xl font-bold text-pink-300 font-sans-jp">日</span>
            </div>
            <p className="text-gray-400 text-xs font-bold">Life Time Left</p>
          </div>
        </div>

        {/* AI System Report (Default Display) */}
        <div className="bg-gray-800/80 rounded-2xl border border-cyan-500/30 p-6 md:p-8 mb-8 flex flex-col relative animate-reveal delay-100 shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
            <span className="text-sm text-cyan-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              辛口AIからのレポート
            </span>
            <BarChart3 className="text-gray-500 w-5 h-5" />
          </div>
          <p className="text-white text-base md:text-lg leading-loose font-bold">{aiMessage}</p>
        </div>

        {/* Communication Block (Other Channels) */}
        <div className="space-y-6 mb-10">
          <button 
            onClick={() => setShowOthers(!showOthers)} 
            className="text-sm font-bold text-white flex items-center gap-3 transition-all border border-gray-600 bg-gray-800/80 px-8 py-4 rounded-full mx-auto hover:bg-gray-700 hover:border-gray-400 shadow-md"
          >
            <Navigation className={`w-4 h-4 transition-transform duration-300 ${showOthers ? 'rotate-180' : ''}`} /> 
            他のキャラの意見も聞きたい？
          </button>

          {showOthers && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-reveal bg-gray-800/50 p-6 rounded-3xl border border-gray-700 mt-4">
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-sm text-gray-300 flex items-center gap-2 font-bold mb-4">キャラを選択</h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {id: 'gal', name: 'ギャル', icon: '💅'},
                    {id: 'okan', name: 'オカン', icon: '👵'},
                    {id: 'cat', name: 'ネコ', icon: '🐱'},
                    {id: 'chu2', name: '闇の住人', icon: '👁️'}
                  ].map(c => (
                    <button key={c.id} onClick={() => setChannel(c.id)} 
                      className={`text-left p-4 rounded-xl font-bold text-sm transition-all border-2 ${channel === c.id ? 'bg-pink-900/40 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800'}`}>
                      <span className="mr-3 text-lg">{c.icon}</span> {c.name}
                    </button>
                  ))}
                </div>
                <button onClick={handleFetch} className="w-full py-4 mt-2 bg-gray-700 border border-gray-500 text-white font-bold text-sm hover:bg-gray-600 transition-all rounded-xl shadow-md">
                  意見を聞く
                </button>
              </div>

              <div className="lg:col-span-3 bg-gray-900/80 rounded-2xl border border-gray-700 p-6 md:p-8 flex flex-col relative min-h-[250px] shadow-inner">
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                  <span className="text-sm text-pink-400 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                    メッセージ受信中
                  </span>
                </div>
                
                {loading ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500 font-bold text-base animate-pulse">Typing...</div>
                ) : msg ? (
                  <div className="flex-1 animate-reveal">
                    <p className="text-white text-base md:text-lg leading-loose font-bold">{msg}</p>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-600 font-bold text-sm">キャラを選択してボタンを押してください</div>
                )}

                {msg && (
                  <button onClick={() => setMsg("")} className="mt-8 text-xs text-gray-500 hover:text-white underline self-end font-bold">閉じる</button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* システム再起動 -> 再実行 */}
        <div className="flex justify-center mt-12">
          <button onClick={onReset} className="px-10 py-4 text-sm text-gray-400 hover:text-white transition-all font-bold tracking-widest border-2 border-gray-700 rounded-full hover:bg-gray-800 shadow-md">
            再実行
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState('input');
  const [result, setResult] = useState(null);
  const [data, setData] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  const start = (d) => {
    setData(d); 
    setResult(calculateLifeData(d)); 
    setStep('loading');
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch(()=>{});
    }
    setTimeout(() => setStep('result'), 2000);
  };

  return (
    <div className="bg-modern min-h-screen selection:bg-pink-500/30 overflow-x-hidden font-sans-jp">
      <style>{styles}</style>
      
      {/* 宇宙的なBGMから、サイバーな雰囲気に合うよう設定（音楽自体は同じURLを使用） */}
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=space-atmosphere-101538.mp3" loop />
      
      {step !== 'input' && (
        <button onClick={() => { 
          if(audioRef.current){ 
            audioRef.current.muted = !audioRef.current.muted; 
            setIsMuted(audioRef.current.muted);
            if(!audioRef.current.muted) audioRef.current.play().catch(()=>{});
          }
        }} className="fixed top-4 right-4 md:top-6 md:right-6 z-[200] p-3 rounded-full bg-gray-800/80 border border-gray-600 text-gray-300 hover:text-white transition-all shadow-lg backdrop-blur-md">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      <main className="relative z-10">
        {step === 'input' && <InputScreen onCalculate={start} />}
        {step === 'loading' && <LoadingScreen />}
        {step === 'result' && <ResultScreen result={result} formData={data} onReset={() => setStep('input')} />}
      </main>
    </div>
  );
}