import React, { useState, useEffect, useRef } from 'react';
import { Activity, Calendar, User, Wind, Coffee, Moon, AlertTriangle, Volume2, VolumeX } from 'lucide-react';

/**
 * 宇宙戦艦風 生命活動予測アプリ (GitHub Pages Optimized Version)
 * 特徴: APIキー不要。キャラクターメッセージは内蔵ロジックで生成されます。
 */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&display=swap');

  .yamato-font {
    font-family: 'Noto Serif JP', serif;
  }

  .fade-in-text {
    opacity: 0;
    animation: fadeIn 2s forwards;
  }

  .delay-1 { animation-delay: 0.5s; }
  .delay-2 { animation-delay: 2s; }
  .delay-3 { animation-delay: 3.5s; }
  .delay-4 { animation-delay: 5.5s; }
  .delay-5 { animation-delay: 8s; }

  .flash-red {
    color: #ff3333;
    text-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
    animation: pulse-red 3s infinite;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse-red {
    0% { opacity: 1; text-shadow: 0 0 15px rgba(255, 0, 0, 0.8); }
    50% { opacity: 0.8; text-shadow: 0 0 5px rgba(255, 0, 0, 0.4); }
    100% { opacity: 1; text-shadow: 0 0 15px rgba(255, 0, 0, 0.8); }
  }

  .scanline {
    width: 100%;
    height: 100px;
    z-index: 50;
    position: absolute;
    pointer-events: none;
    background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(255,0,0,0.1) 50%, rgba(0,0,0,0) 100%);
    opacity: 0.1;
    animation: scan 8s linear infinite;
  }

  @keyframes scan {
    0% { top: -100px; }
    100% { top: 100%; }
  }
`;

// --- メッセージ生成ロジック (API不要版) ---
const generateLocalMessage = (data, result, channel) => {
  const isHealthy = data.smoking === 'none' && data.drinking === 'none' && data.sleep === 'good';
  const isBad = data.smoking === 'everyday' || data.drinking === 'everyday' || data.sleep === 'short';

  const messages = {
    captain: {
      good: `諸君、対象のバイタルは極めて良好だ。このままの航路を維持せよ。我々人類の希望は、君のその規律ある生活にかかっている。`,
      bad: `警告！生命維持装置に致命的な負荷を検出！このままでは目的地への到達は不可能だ。直ちに生活習慣を修正し、エネルギーの浪費を食い止めろ！`,
      normal: `現在の生存確率は標準範囲内だ。だが宇宙は過酷だ。日々の自己管理こそが、生還への唯一の道であることを忘れるな。航海を続ける。`
    },
    muscle: {
      good: `ナイスバルク！素晴らしい規律だ！君の細胞が喜んでいるぞ！このままプロテインと筋肉を信じて、最強の肉体を維持するんだ！マッスル！`,
      bad: `コラァ！そんな不摂生は筋肉への冒涜だ！筋肉をいじめるな！今すぐスクワット100回、プロテイン1リットルだ！筋肉は裏切らないぞ！`,
      normal: `悪くない！だがもっと追い込めるはずだ。食事、睡眠、そしてトレーニング。この三位一体が君の寿命をパンプアップさせるんだ！`
    },
    okan: {
      good: `あんた、えらい健康的やん。おかん安心したわ。ちゃんと食べて寝てるんやね。この調子で自分の体、大事にせなあかんで。`,
      bad: `ちょっと！またそんな不摂生して！おかん、あんたの体が心配で夜も眠れへんわ。酒もタバコもほどほどにしときや、ホンマに！`,
      normal: `まあまあやね。でも油断は禁物やで。野菜もしっかり食べなあかんよ。あんたの体はあんた一人のもんやないんやから。`
    },
    ai: {
      good: `バイタル分析完了。個体状態は最適化されています。現在のプロトコルを継続することで、生存確率は最大値を維持します。`,
      bad: `エラー。生体データに致命的な不整合を検出。劣化速度が予測値を大幅に上回っています。速やかな自己修復措置を強く推奨します。`,
      normal: `分析完了。生存確率は標準偏差内に収容。特筆すべき異常なし。長期的な機能維持のため、定期的メンテナンスを推奨。`
    },
    chu2: {
      good: `フフフ…清浄なる魂の輝きか。終焉の刻印は未だ遠い。その光、闇に飲まれぬよう大切に守り抜くがいい。`,
      bad: `ククク…瘴気に蝕まれしその肉体、崩壊へのカウントダウンは既に始まっている。貴様に宿る闇を制御せねば、魂ごと消滅するぞ。`,
      normal: `運命の歯車は静かに、だが確実に回っている。光と闇が均衡を保つこの瞬間、己の中の混沌を鎮めることができるか。`
    }
  };

  const type = isHealthy ? 'good' : isBad ? 'bad' : 'normal';
  return messages[channel][type];
};

// --- 解析ロジック ---
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
    const saved = localStorage.getItem('yamatoLifeData');
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  const years = Array.from({ length: 110 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black z-0"></div>
      <form onSubmit={(e) => {
        e.preventDefault();
        localStorage.setItem('yamatoLifeData', JSON.stringify(formData));
        const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
        onCalculate({ ...formData, birthDate });
      }} className="max-w-md w-full bg-gray-900/80 backdrop-blur border border-gray-800 p-8 rounded-lg shadow-2xl z-10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-600 to-red-900"></div>
        <h1 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <Activity className="text-red-500" /> 生命活動予測システム
        </h1>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block font-mono">BIRTHDATE</label>
            <div className="flex gap-2">
              <select value={formData.birthYear} onChange={e => setFormData({...formData, birthYear: e.target.value})} className="flex-[2] bg-black border border-gray-700 rounded p-2 text-white">
                {years.map(y => <option key={y} value={y}>{y}年</option>)}
              </select>
              <select value={formData.birthMonth} onChange={e => setFormData({...formData, birthMonth: e.target.value})} className="flex-1 bg-black border border-gray-700 rounded p-2 text-white">
                {months.map(m => <option key={m} value={m}>{m}月</option>)}
              </select>
              <select value={formData.birthDay} onChange={e => setFormData({...formData, birthDay: e.target.value})} className="flex-1 bg-black border border-gray-700 rounded p-2 text-white">
                {days.map(d => <option key={d} value={d}>{d}日</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block font-mono">GENDER</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white">
                <option value="male">男性</option><option value="female">女性</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block font-mono">SMOKING</label>
              <select value={formData.smoking} onChange={e => setFormData({...formData, smoking: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white">
                <option value="none">なし</option><option value="sometimes">時々</option><option value="everyday">毎日</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block font-mono">ALCOHOL</label>
              <select value={formData.drinking} onChange={e => setFormData({...formData, drinking: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white">
                <option value="none">なし</option><option value="sometimes">時々</option><option value="everyday">毎日</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block font-mono">SLEEP</label>
              <select value={formData.sleep} onChange={e => setFormData({...formData, sleep: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white">
                <option value="short">不足</option><option value="normal">普通</option><option value="good">十分</option>
              </select>
            </div>
          </div>
        </div>
        <button type="submit" className="w-full bg-red-900/50 hover:bg-red-800 border border-red-800 text-white font-bold py-4 rounded tracking-widest transition-all mt-8">
          ANALYZE START
        </button>
      </form>
    </div>
  );
}

function LoadingScreen() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const msgs = ["INITIATING...", "ANALYZING BIOMETRICS...", "FETCHING STATS...", "SIMULATING TIME-AXIS...", "DECODING RESULTS...", "COMPLETE."];
    let i = 0;
    const interval = setInterval(() => {
      if (i < msgs.length) { setLogs(p => [...p, msgs[i]]); i++; }
      else clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 flex flex-col justify-end text-sm">
      <div className="space-y-1 max-w-xl mx-auto w-full">
        {logs.map((l, i) => <div key={i}>{'>'} {l}</div>)}
        <div className="animate-pulse">{'>'} _</div>
      </div>
    </div>
  );
}

function ResultScreen({ result, formData, onReset }) {
  const [barWidth, setBarWidth] = useState(0);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState("captain");

  useEffect(() => {
    setTimeout(() => setBarWidth(result.progressRate), 1500);
  }, [result.progressRate]);

  const handleFetch = () => {
    setLoading(true);
    setTimeout(() => {
      const m = generateLocalMessage(formData, result, channel);
      setMsg(m);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 yamato-font relative overflow-hidden">
      <div className="scanline"></div>
      <div className="z-10 w-full max-w-4xl text-center flex flex-col gap-10">
        <div className="fade-in-text delay-1 text-gray-400 flex flex-col md:flex-row justify-center gap-4 md:gap-12 text-xl tracking-widest font-mono">
          <div>PREDICTED HEALTH AGE: <span className="text-white font-bold">{result.healthAge}</span></div>
          <div>ESTIMATED LIFESPAN: <span className="text-white font-bold">{result.lifeAge}</span></div>
        </div>
        <div className="w-full max-w-xl mx-auto fade-in-text delay-2 px-4">
          <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-mono"><span>BIRTH</span><span>LIFE PROGRESS: {result.progressRate}%</span><span>END</span></div>
          <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
            <div className="h-full bg-red-700 transition-all duration-[2500ms]" style={{ width: `${barWidth}%` }}></div>
          </div>
        </div>
        <div className="fade-in-text delay-3">
          <div className="text-gray-400 text-xs md:text-sm mb-3 tracking-[0.3em] font-mono">HEALTHY LIFE ENDS IN</div>
          <div className="text-6xl md:text-8xl font-black flash-red tracking-widest flex items-baseline justify-center gap-4">
            <span className="text-xl md:text-3xl font-normal text-gray-400">{result.isHealthOver ? "" : "あと"}</span>
            {result.isHealthOver ? "LIMIT REACHED" : result.healthDays.toLocaleString()}
            <span className="text-xl md:text-3xl font-normal text-gray-400">{result.isHealthOver ? "" : "日"}</span>
          </div>
        </div>
        <div className="fade-in-text delay-4 border-t border-gray-900 pt-8">
          <div className="text-gray-400 text-xs md:text-sm mb-3 tracking-[0.3em] font-mono">COMPLETE SHUTDOWN IN</div>
          <div className="text-4xl md:text-6xl font-bold text-red-600 tracking-widest flex items-baseline justify-center gap-4">
            <span className="text-lg md:text-2xl font-normal text-gray-500">あと</span>
            {result.isLifeOver ? "ERROR" : result.lifeDays.toLocaleString()}
            <span className="text-lg md:text-2xl font-normal text-gray-500">日</span>
          </div>
        </div>
        <div className="mt-4 w-full max-w-xl mx-auto fade-in-text delay-5">
          {!msg && !loading ? (
            <div className="bg-blue-900/10 border border-blue-900/50 p-4 rounded flex flex-col gap-2">
              <select value={channel} onChange={e => setChannel(e.target.value)} className="bg-black text-blue-300 p-2 text-sm border border-blue-900/50 outline-none font-mono">
                <option value="captain">CH-01: 艦長 (SFドラマ風)</option>
                <option value="muscle">CH-02: 筋肉トレーナー (熱血)</option>
                <option value="okan">CH-03: 関西のおかん (愛情)</option>
                <option value="ai">CH-04: 管理AI (冷徹)</option>
                <option value="chu2">CH-05: 暗黒魔界の覇王 (中二病)</option>
              </select>
              <button onClick={handleFetch} className="bg-blue-900/30 hover:bg-blue-800/50 border border-blue-800 text-blue-200 py-3 font-bold transition-all font-mono">
                RECEIVE TRANSMISSION
              </button>
            </div>
          ) : (
            <div className="bg-gray-900/80 border border-blue-800 p-6 rounded text-left shadow-2xl relative min-h-[150px]">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500"></div>
              <h3 className="text-blue-400 text-[10px] tracking-widest mb-3 flex items-center gap-2 font-mono animate-pulse">INCOMING...</h3>
              {loading ? <div className="text-blue-300 text-sm animate-pulse font-mono">DECODING DATA...</div> : <p className="text-blue-100 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg}</p>}
              {!loading && <button onClick={() => setMsg("")} className="mt-6 text-blue-500 text-[10px] hover:text-blue-300 underline font-mono">CLOSE</button>}
            </div>
          )}
        </div>
        <button onClick={onReset} className="mt-8 text-gray-700 hover:text-white text-[10px] fade-in-text delay-5 tracking-[0.2em] font-mono">RE-ANALYZE SYSTEM</button>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState('input');
  const [result, setResult] = useState(null);
  const [data, setData] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const start = (d) => {
    setData(d); setResult(calculateLifeData(d)); setStep('loading');
    if (audioRef.current) { audioRef.current.volume = 0.1; audioRef.current.play().catch(()=>{}); }
    setTimeout(() => setStep('result'), 3500);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="w-full min-h-screen bg-black relative selection:bg-red-900/30">
        <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=space-atmosphere-101538.mp3" loop />
        {step !== 'input' && (
          <button onClick={() => { if(audioRef.current){ audioRef.current.muted = !audioRef.current.muted; setIsMuted(audioRef.current.muted); }}} className="absolute top-4 right-4 z-50 text-gray-500 p-2">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
        {step === 'input' && <InputScreen onCalculate={start} />}
        {step === 'loading' && <LoadingScreen />}
        {step === 'result' && <ResultScreen result={result} formData={data} onReset={() => setStep('input')} />}
      </div>
    </>
  );
}