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
  ShieldAlert,
  Zap,
  BarChart3
} from 'lucide-react';

/**
 * 宇宙戦艦風 生命活動予測システム (Premium UI Version)
 * 特徴: 高度なSFインターフェースデザイン、API不要のローカルロジック。
 */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700;900&family=Share+Tech+Mono&display=swap');

  :root {
    --hull-color: #0a0c10;
    --panel-color: rgba(20, 25, 35, 0.85);
    --accent-red: #ff3333;
    --accent-cyan: #00f2ff;
    --border-color: rgba(0, 242, 255, 0.2);
  }

  .font-mono { font-family: 'Share Tech Mono', monospace; }
  .font-serif { font-family: 'Noto Serif JP', serif; }

  .bg-space {
    background-color: var(--hull-color);
    background-image: 
      radial-gradient(circle at 50% 50%, rgba(20, 30, 50, 1) 0%, rgba(5, 5, 10, 1) 100%),
      linear-gradient(rgba(0, 242, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 242, 255, 0.05) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
  }

  .glass-panel {
    background: var(--panel-color);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border-color);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 242, 255, 0.05);
  }

  .scanline {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 2px;
    background: rgba(0, 242, 255, 0.1);
    opacity: 0.5;
    z-index: 100;
    pointer-events: none;
    animation: scan 10s linear infinite;
  }

  @keyframes scan {
    0% { transform: translateY(-100px); }
    100% { transform: translateY(100vh); }
  }

  .glow-text-red {
    text-shadow: 0 0 10px rgba(255, 51, 51, 0.8), 0 0 20px rgba(255, 51, 51, 0.4);
  }

  .glow-text-cyan {
    text-shadow: 0 0 10px rgba(0, 242, 255, 0.8);
  }

  .animate-reveal {
    animation: reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }

  @keyframes reveal {
    from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  .input-field {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 242, 255, 0.2);
    color: white;
    transition: all 0.3s;
  }

  .input-field:focus {
    border-color: var(--accent-cyan);
    box-shadow: 0 0 10px rgba(0, 242, 255, 0.3);
    outline: none;
  }

  .btn-primary {
    background: linear-gradient(180deg, rgba(255, 51, 51, 0.2) 0%, rgba(150, 0, 0, 0.4) 100%);
    border: 1px solid var(--accent-red);
    position: relative;
    overflow: hidden;
  }

  .btn-primary::after {
    content: '';
    position: absolute;
    top: -50%; left: -50%; width: 200%; height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
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
      normal: `悪くない！だがもっと追い込めるはずだ。食事、睡眠、トレーニング。この三位一体が君の寿命をパンプアップさせるんだ！`
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

  // 前回入力したデータをブラウザから読み込む処理を追加
  useEffect(() => {
    const saved = localStorage.getItem('yamatoLifeData_premium');
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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-panel max-w-2xl w-full p-8 rounded-xl relative animate-reveal">
        <div className="flex items-center gap-3 mb-8 border-b border-cyan-900/50 pb-4">
          <Activity className="text-cyan-400 w-8 h-8 glow-text-cyan" />
          <div>
            <h1 className="text-xl font-bold tracking-widest text-white">生命活動予測システム</h1>
            <p className="text-[10px] text-cyan-500 font-mono">システムバージョン 4.0 // プレミアム版</p>
          </div>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          
          // 解析開始時に入力データをブラウザに保存する処理を追加
          localStorage.setItem('yamatoLifeData_premium', JSON.stringify(formData));
          
          const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
          onCalculate({ ...formData, birthDate });
        }} className="space-y-6">
          
          <section className="space-y-4">
            <h2 className="text-xs font-mono text-cyan-600 flex items-center gap-2">
              <User className="w-3 h-3" /> 個体識別データ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 ml-1">誕生年</label>
                <select value={formData.birthYear} onChange={e => setFormData({...formData, birthYear: e.target.value})} className="input-field w-full p-3 rounded font-mono text-sm">
                  {years.map(y => <option key={y} value={y}>{y}年</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 ml-1">月</label>
                <select value={formData.birthMonth} onChange={e => setFormData({...formData, birthMonth: e.target.value})} className="input-field w-full p-3 rounded font-mono text-sm">
                  {Array.from({length:12}, (_, i) => i+1).map(m => <option key={m} value={m}>{m}月</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 ml-1">日</label>
                <select value={formData.birthDay} onChange={e => setFormData({...formData, birthDay: e.target.value})} className="input-field w-full p-3 rounded font-mono text-sm">
                  {Array.from({length:31}, (_, i) => i+1).map(d => <option key={d} value={d}>{d}日</option>)}
                </select>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 ml-1">性別</label>
              <div className="flex gap-2">
                {['male', 'female'].map(g => (
                  <button key={g} type="button" onClick={() => setFormData({...formData, gender: g})} 
                    className={`flex-1 p-3 rounded font-mono text-xs transition-all ${formData.gender === g ? 'bg-cyan-900/50 border border-cyan-500 text-white' : 'bg-black/40 border border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                    {g === 'male' ? '男性' : '女性'}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-gray-800">
            <h2 className="text-xs font-mono text-cyan-600 flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" /> 生命リスク要因
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 flex items-center gap-1"><Wind className="w-3 h-3" /> 喫煙</label>
                <select value={formData.smoking} onChange={e => setFormData({...formData, smoking: e.target.value})} className="input-field w-full p-3 rounded text-xs">
                  <option value="none">なし</option><option value="sometimes">時々</option><option value="everyday">毎日</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 flex items-center gap-1"><Coffee className="w-3 h-3" /> 飲酒</label>
                <select value={formData.drinking} onChange={e => setFormData({...formData, drinking: e.target.value})} className="input-field w-full p-3 rounded text-xs">
                  <option value="none">なし</option><option value="sometimes">時々</option><option value="everyday">毎日</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 flex items-center gap-1"><Moon className="w-3 h-3" /> 睡眠</label>
                <select value={formData.sleep} onChange={e => setFormData({...formData, sleep: e.target.value})} className="input-field w-full p-3 rounded text-xs">
                  <option value="short">不足</option><option value="normal">普通</option><option value="good">十分</option>
                </select>
              </div>
            </div>
          </section>

          <button type="submit" className="btn-primary w-full py-5 rounded-lg text-white font-bold tracking-[0.5em] text-lg shadow-lg shadow-red-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            解析シーケンス開始
          </button>
          
          {/* Reference Data Disclosure */}
          <div className="mt-6 text-[10px] text-cyan-700/60 font-mono text-center leading-relaxed">
            [ REFERENCE DATA ]<br/>
            本システムの予測ベース値は、厚生労働省「令和元年簡易生命表」<br/>
            および「健康寿命の令和元年値」の統計データを参照しています。<br/>
            ※生活習慣による寿命増減は独自シミュレーションに基づく推計です。
          </div>
        </form>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-cyan-500 font-mono">
      <div className="w-64 space-y-4">
        <div className="h-1 bg-gray-900 w-full overflow-hidden relative rounded-full">
          <div className="absolute inset-0 bg-cyan-500 w-1/3 animate-[loading_2s_infinite]"></div>
        </div>
        <div className="flex justify-between text-[10px] animate-pulse">
          <span>時間軸予測シミュレーション実行中...</span>
          <span>準備完了</span>
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
  const [channel, setChannel] = useState("captain");
  const [showOthers, setShowOthers] = useState(false);

  const aiMessage = generateLocalMessage(formData, result, "ai");

  const handleFetch = () => {
    setLoading(true);
    setTimeout(() => {
      setMsg(generateLocalMessage(formData, result, channel));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-20">
      <div className="glass-panel max-w-5xl w-full p-4 md:p-10 rounded-2xl animate-reveal relative overflow-hidden">
        
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-black/40 p-4 border border-gray-800 rounded-lg">
            <p className="text-[10px] text-cyan-600 font-mono mb-1 tracking-tighter">予測健康寿命</p>
            <p className="text-3xl font-bold font-mono text-white glow-text-cyan">{result.healthAge}<span className="text-xs ml-1 text-gray-500">歳</span></p>
          </div>
          <div className="bg-black/40 p-4 border border-gray-800 rounded-lg">
            <p className="text-[10px] text-cyan-600 font-mono mb-1">予測平均寿命</p>
            <p className="text-3xl font-bold font-mono text-white glow-text-cyan">{result.lifeAge}<span className="text-xs ml-1 text-gray-500">歳</span></p>
          </div>
          <div className="col-span-2 bg-red-950/20 p-4 border border-red-900/30 rounded-lg relative overflow-hidden">
            <p className="text-[10px] text-red-500 font-mono mb-1">生命活動進行度</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold font-mono text-red-500 glow-text-red">{result.progressRate}%</p>
              <div className="flex-1 h-2 bg-black/60 rounded-full mb-2 overflow-hidden border border-red-900/20">
                <div className="h-full bg-red-600 shadow-[0_0_10px_rgba(255,0,0,0.5)] transition-all duration-1000" style={{width: `${result.progressRate}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Countdown */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center py-10 border-y border-cyan-900/20 mb-10">
          <div className="text-center space-y-2">
            <h3 className="text-xs text-cyan-500 font-mono tracking-[0.4em]">健康活動限界まで</h3>
            <div className={`text-5xl md:text-7xl font-black font-mono tracking-tighter flex items-baseline justify-center gap-2 ${result.isHealthOver ? 'text-red-600 animate-pulse' : 'text-white'}`}>
              <span className="text-xl md:text-3xl font-normal text-gray-500">{result.isHealthOver ? "" : "あと"}</span>
              {result.isHealthOver ? "限界突破" : result.healthDays.toLocaleString()}
              <span className="text-xl md:text-3xl font-normal text-gray-500">{result.isHealthOver ? "" : "日"}</span>
            </div>
            <p className="text-gray-500 text-xs font-mono uppercase">{result.isHealthOver ? "限界値を超過しています" : "残存日数"}</p>
          </div>
          
          <div className="hidden md:block w-px h-32 bg-gradient-to-b from-transparent via-cyan-900/50 to-transparent"></div>

          <div className="text-center space-y-2">
            <h3 className="text-xs text-red-600 font-mono tracking-[0.4em]">完全生命活動停止まで</h3>
            <div className="text-4xl md:text-6xl font-black font-mono text-red-800 tracking-tighter flex items-baseline justify-center gap-2">
              <span className="text-lg md:text-2xl font-normal text-gray-600">あと</span>
              {result.isLifeOver ? "測定不能" : result.lifeDays.toLocaleString()}
              <span className="text-lg md:text-2xl font-normal text-gray-600">日</span>
            </div>
            <p className="text-gray-600 text-xs font-mono uppercase">残存猶予期間</p>
          </div>
        </div>

        {/* AI System Report (Default Display) */}
        <div className="bg-black/60 rounded-xl border border-cyan-900/30 p-6 mb-8 flex flex-col relative animate-reveal delay-3">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-500/50"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] text-cyan-600 font-mono">● CH-04: 管理AI システムレポート</span>
            <BarChart3 className="text-cyan-900 w-4 h-4" />
          </div>
          <p className="text-white font-serif text-lg leading-relaxed">{aiMessage}</p>
        </div>

        {/* Communication Block (Other Channels) */}
        <div className="space-y-6 mb-12">
          <button 
            onClick={() => setShowOthers(!showOthers)} 
            className="text-[10px] font-mono text-cyan-500 hover:text-cyan-300 flex items-center gap-2 transition-all border border-cyan-900/50 bg-cyan-900/10 px-6 py-3 rounded-full mx-auto"
          >
            <Navigation className={`w-3 h-3 transition-transform ${showOthers ? 'rotate-180' : ''}`} /> 
            他の助言も聞きたい？
          </button>

          {showOthers && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-reveal">
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-[10px] font-mono text-cyan-700 flex items-center gap-2"><Navigation className="w-3 h-3" /> 通信チャンネル選択</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    {id: 'captain', name: 'CH-01: 艦長', icon: '艦'},
                    {id: 'muscle', name: 'CH-02: 筋肉トレーナー', icon: '筋'},
                    {id: 'okan', name: 'CH-03: 関西のおかん', icon: '母'},
                    {id: 'chu2', name: 'CH-05: 暗黒魔界の覇王', icon: '魔'}
                  ].map(c => (
                    <button key={c.id} onClick={() => setChannel(c.id)} 
                      className={`text-left p-3 rounded font-mono text-[10px] transition-all border ${channel === c.id ? 'bg-cyan-900/40 border-cyan-500 text-white shadow-[0_0_15px_rgba(0,242,255,0.2)]' : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                      <span className="mr-2 text-cyan-600 opacity-50">[{c.icon}]</span> {c.name}
                    </button>
                  ))}
                </div>
                <button onClick={handleFetch} className="w-full py-4 bg-cyan-900/20 border border-cyan-800 text-cyan-400 font-bold tracking-widest text-xs hover:bg-cyan-800/40 transition-all">
                  通信を受信する
                </button>
              </div>

              <div className="lg:col-span-3 bg-black/60 rounded-xl border border-cyan-900/30 p-6 flex flex-col relative min-h-[200px]">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-500/50"></div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] text-cyan-600 font-mono animate-pulse">● シグナル受信中...</span>
                  <BarChart3 className="text-cyan-900 w-4 h-4" />
                </div>
                
                {loading ? (
                  <div className="flex-1 flex items-center justify-center text-cyan-800 font-mono text-sm animate-pulse">暗号解読中...</div>
                ) : msg ? (
                  <div className="flex-1 animate-reveal">
                    <p className="text-white font-serif text-lg leading-relaxed">{msg}</p>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-800 font-mono text-[10px] tracking-[0.5em]">スタンバイ</div>
                )}

                {msg && (
                  <button onClick={() => setMsg("")} className="mt-4 text-[10px] text-gray-600 hover:text-cyan-500 underline self-start font-mono">通信を切断</button>
                )}
              </div>
            </div>
          )}
        </div>

        <button onClick={onReset} className="absolute bottom-4 right-6 text-[10px] text-gray-800 hover:text-white transition-all font-mono tracking-widest">
          システム再起動
        </button>
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
    setTimeout(() => setStep('result'), 2500);
  };

  return (
    <div className="bg-space min-h-screen selection:bg-cyan-500/30 text-gray-200 overflow-x-hidden font-sans">
      <style>{styles}</style>
      <div className="scanline"></div>
      
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=space-atmosphere-101538.mp3" loop />
      
      {step !== 'input' && (
        <button onClick={() => { 
          if(audioRef.current){ 
            audioRef.current.muted = !audioRef.current.muted; 
            setIsMuted(audioRef.current.muted);
            if(!audioRef.current.muted) audioRef.current.play().catch(()=>{});
          }
        }} className="fixed top-6 right-6 z-[200] p-3 rounded-full bg-black/50 border border-gray-800 text-gray-500 hover:text-white transition-all">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}

      <main className="relative z-10">
        {step === 'input' && <InputScreen onCalculate={start} />}
        {step === 'loading' && <LoadingScreen />}
        {step === 'result' && <ResultScreen result={result} formData={data} onReset={() => setStep('input')} />}
      </main>

      {/* Footer Branding with Reference */}
      <footer className="fixed bottom-4 left-6 z-10 hidden md:block">
        <div className="flex flex-col gap-1">
          <div className="text-[8px] text-cyan-800/50 font-mono tracking-wider">
            [REF] 厚生労働省 令和元年簡易生命表 / 健康寿命データ
          </div>
          <div className="flex items-center gap-2 opacity-20 hover:opacity-50 transition-all cursor-default">
            <Zap className="w-3 h-3 text-cyan-500" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-500">神台ヤマト・システムズ株式会社</span>
          </div>
        </div>
      </footer>
    </div>
  );
}