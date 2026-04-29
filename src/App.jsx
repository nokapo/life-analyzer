import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  User, 
  Wind, 
  Coffee, 
  Moon, 
  HeartPulse,
  Sparkles,
  BarChart3,
  ChevronDown,
  Volume2,
  VolumeX,
  Navigation
} from 'lucide-react';

/**
 * AI寿命判定システム (SNS/Modern Optimized Version)
 * 特徴: iPhoneで見やすい高コントラスト設計、シェアしたくなるポップなUI。
 */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&family=Outfit:wght@700;900&display=swap');

  :root {
    --primary: #6366f1;
    --secondary: #ec4899;
    --accent: #06b6d4;
    --bg-main: #0f172a;
    --panel-bg: #1e293b;
    --text-main: #f8fafc;
    color-scheme: dark;
  }

  body {
    color: var(--text-main);
    background-color: var(--bg-main);
    font-family: 'Noto Sans JP', sans-serif;
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }

  .font-en { font-family: 'Outfit', sans-serif; }

  .bg-gradient-modern {
    background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent),
                radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.1), transparent),
                #0f172a;
    background-attachment: fixed;
  }

  /* スマホで見やすい明るいパネル */
  .modern-card {
    background: #1e293b;
    border: 2px solid #334155;
    border-radius: 24px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  }

  .input-label {
    color: #94a3b8;
    font-size: 0.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: block;
    letter-spacing: 0.05em;
  }

  /* iPhone Safariでの表示崩れを徹底修正 */
  .modern-input {
    background-color: #0f172a !important;
    border: 2px solid #475569 !important;
    color: #ffffff !important;
    border-radius: 12px;
    padding: 1rem;
    font-size: 16px !important;
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    transition: all 0.2s;
  }

  .modern-input:focus {
    border-color: var(--primary) !important;
    outline: none;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  }

  .select-wrapper {
    position: relative;
  }

  .select-wrapper::after {
    content: '';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-size: contain;
    pointer-events: none;
  }

  .btn-submit {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
    color: white;
    font-weight: 900;
    font-size: 1.25rem;
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
    transition: all 0.2s;
    border: none;
    width: 100%;
    letter-spacing: 0.1em;
  }

  .btn-submit:active {
    transform: scale(0.97);
  }

  .progress-bar-bg {
    background-color: #0f172a;
    height: 12px;
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-bar-fill {
    background: linear-gradient(90deg, #6366f1, #ec4899);
    height: 100%;
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-reveal {
    animation: reveal 0.5s ease-out forwards;
  }

  @keyframes reveal {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// メッセージ生成
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
    const saved = localStorage.getItem('lifeAnalyzerData_sns_v2');
    if (saved) {
      try { setFormData(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="modern-card w-full max-w-md p-6 md:p-8 animate-reveal">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-indigo-500/20 rounded-full mb-4">
            <HeartPulse className="text-indigo-400 w-12 h-12" />
          </div>
          <h1 className="text-2xl font-black mb-2">AI寿命判定システム</h1>
          <p className="text-slate-400 text-sm font-bold">残りの時間を予測します</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem('lifeAnalyzerData_sns_v2', JSON.stringify(formData));
          const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
          onCalculate({ ...formData, birthDate });
        }} className="space-y-6">
          
          <div className="grid grid-cols-1 gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <h2 className="text-xs text-indigo-400 font-black tracking-widest flex items-center gap-2">
              <User className="w-3 h-3" /> 基本データ
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="select-wrapper">
                <span className="input-label">年</span>
                <select value={formData.birthYear} onChange={e => setFormData({...formData, birthYear: e.target.value})} className="modern-input">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="select-wrapper">
                <span className="input-label">月</span>
                <select value={formData.birthMonth} onChange={e => setFormData({...formData, birthMonth: e.target.value})} className="modern-input">
                  {Array.from({length:12}, (_, i) => i+1).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="select-wrapper">
                <span className="input-label">日</span>
                <select value={formData.birthDay} onChange={e => setFormData({...formData, birthDay: e.target.value})} className="modern-input">
                  {Array.from({length:31}, (_, i) => i+1).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="select-wrapper">
              <span className="input-label">性別</span>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="modern-input">
                <option value="male">男性</option>
                <option value="female">女性</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <h2 className="text-xs text-pink-400 font-black tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> ライフスタイル
            </h2>
            <div className="select-wrapper">
              <span className="input-label">喫煙習慣</span>
              <select value={formData.smoking} onChange={e => setFormData({...formData, smoking: e.target.value})} className="modern-input">
                <option value="none">吸わない</option>
                <option value="sometimes">時々吸う</option>
                <option value="everyday">毎日吸う</option>
              </select>
            </div>
            <div className="select-wrapper">
              <span className="input-label">飲酒習慣</span>
              <select value={formData.drinking} onChange={e => setFormData({...formData, drinking: e.target.value})} className="modern-input">
                <option value="none">飲まない</option>
                <option value="sometimes">時々飲む</option>
                <option value="everyday">毎日飲む</option>
              </select>
            </div>
            <div className="select-wrapper">
              <span className="input-label">睡眠の状態</span>
              <select value={formData.sleep} onChange={e => setFormData({...formData, sleep: e.target.value})} className="modern-input">
                <option value="short">不足している</option>
                <option value="normal">普通</option>
                <option value="good">十分寝ている</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit mt-4">
            予測を開始
          </button>
        </form>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-48 text-center">
        <Sparkles className="w-12 h-12 text-pink-500 animate-bounce mx-auto mb-6" />
        <div className="progress-bar-bg mb-4">
          <div className="progress-bar-fill w-1/2 animate-pulse"></div>
        </div>
        <p className="text-sm font-bold text-slate-400">未来を計算中...</p>
      </div>
    </div>
  );
}

function ResultScreen({ result, formData, onReset }) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState("ai");
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
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto flex flex-col items-center">
      <div className="modern-card w-full p-6 md:p-8 animate-reveal mt-8 mb-8 overflow-hidden">
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
            <p className="text-[10px] text-slate-400 font-bold mb-1">予測健康寿命</p>
            <p className="text-2xl font-en font-black text-white">{result.healthAge}<span className="text-xs ml-1 font-sans-jp text-slate-500">歳</span></p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
            <p className="text-[10px] text-slate-400 font-bold mb-1">予測平均寿命</p>
            <p className="text-2xl font-en font-black text-white">{result.lifeAge}<span className="text-xs ml-1 font-sans-jp text-slate-500">歳</span></p>
          </div>
          <div className="col-span-2 bg-pink-500/10 p-4 rounded-2xl border border-pink-500/20">
            <div className="flex justify-between items-baseline mb-2">
              <p className="text-xs text-pink-400 font-bold">人生の進行度</p>
              <p className="text-xl font-en font-black text-pink-400">{result.progressRate}%</p>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{width: `${result.progressRate}%`}}></div>
            </div>
          </div>
        </div>

        <div className="text-center py-10 bg-slate-900/30 rounded-3xl border border-slate-800 mb-8">
          <div className="mb-10">
            <p className="text-xs text-indigo-400 font-black tracking-widest mb-3">健康でいられる残り時間</p>
            <div className={`text-6xl font-en font-black leading-none ${result.isHealthOver ? 'text-red-500' : 'text-white'}`}>
              {result.isHealthOver ? "LIMIT" : result.healthDays.toLocaleString()}
              <span className="text-lg ml-2 font-sans-jp text-slate-500">日</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-pink-500 font-black tracking-widest mb-3">生命の残り時間</p>
            <div className="text-4xl font-en font-black text-pink-500 leading-none">
              {result.isLifeOver ? "ERROR" : result.lifeDays.toLocaleString()}
              <span className="text-lg ml-2 font-sans-jp text-slate-600">日</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-3xl border-2 border-indigo-500/30 relative mb-10 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-xs text-indigo-400 font-black">辛口AIからの助言</span>
          </div>
          <p className="text-white text-base leading-relaxed font-bold">{aiMessage}</p>
        </div>

        <div className="space-y-6">
          <button 
            onClick={() => setShowOthers(!showOthers)} 
            className="flex items-center gap-3 mx-auto px-6 py-3 rounded-full bg-slate-800 text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            <Navigation className={`w-4 h-4 transition-transform ${showOthers ? 'rotate-180' : ''}`} />
            他の人の意見も聞く
          </button>

          {showOthers && (
            <div className="space-y-6 animate-reveal">
              <div className="grid grid-cols-4 gap-2">
                {[
                  {id: 'gal', name: 'ギャル', icon: '💅'},
                  {id: 'okan', name: 'オカン', icon: '👵'},
                  {id: 'cat', name: 'ネコ', icon: '🐱'},
                  {id: 'chu2', name: '闇王', icon: '👁️'}
                ].map(c => (
                  <button key={c.id} onClick={() => setChannel(c.id)} 
                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${channel === c.id ? 'bg-indigo-500/20 border-indigo-500' : 'bg-slate-900 border-slate-700'}`}>
                    <span className="text-xl mb-1">{c.icon}</span>
                    <span className="text-[10px] font-bold">{c.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleFetch} className="btn-submit py-4 text-base">通信を開始する</button>

              {msg && (
                <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 animate-reveal">
                  <p className="text-white text-base leading-relaxed font-bold">{msg}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <button onClick={onReset} className="text-slate-500 hover:text-white text-xs font-bold underline px-4 py-2">再実行する</button>
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
    <div className="bg-gradient-modern min-h-screen">
      <style>{styles}</style>
      
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=space-atmosphere-101538.mp3" loop />
      
      {step !== 'input' && (
        <button onClick={() => { 
          if(audioRef.current){ 
            audioRef.current.muted = !audioRef.current.muted; 
            setIsMuted(audioRef.current.muted);
            if(!audioRef.current.muted) audioRef.current.play().catch(()=>{});
          }
        }} className="fixed top-4 right-4 z-50 p-3 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400">
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