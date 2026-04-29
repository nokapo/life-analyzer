import React, { useState, useEffect } from 'react';
import { 
  HeartPulse,
  Sparkles,
  User,
  Activity,
  ChevronRight,
  RefreshCw,
  MessageCircle
} from 'lucide-react';

/**
 * AI寿命判定システム (Professional Mobile First UI Version)
 * 特徴: iPhone等のスマホ画面に最適化。適切な余白、視認性の高いタイポグラフィ、モダンなカードUI。
 */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Noto+Sans+JP:wght@400;500;700;900&display=swap');

  :root {
    color-scheme: dark;
    background-color: #020617;
  }

  body, html, #root {
    background-color: #020617 !important; /* Tailwind slate-950 */
    color: #f8fafc !important; /* Tailwind slate-50 */
    font-family: 'Inter', 'Noto Sans JP', sans-serif;
    -webkit-font-smoothing: antialiased;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  /* 背景の装飾的な光 */
  .bg-glow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: 
      radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.15), transparent 25%),
      radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.1), transparent 25%);
    z-index: -1;
    pointer-events: none;
  }

  /* グラスモーフィズム調のカード */
  .glass-card {
    background: rgba(15, 23, 42, 0.6); /* slate-900 with opacity */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 1.5rem;
    padding: 1.5rem;
  }

  /* ネイティブっぽさを残しつつ綺麗なセレクトボックス */
  .ui-select {
    width: 100%;
    appearance: none;
    background-color: #0f172a; /* slate-900 */
    border: 1px solid #334155; /* slate-700 */
    color: #f1f5f9; /* slate-100 */
    border-radius: 0.75rem;
    padding: 0.875rem 1rem;
    font-size: 16px; /* iOS自動ズーム防止のため16px以上必須 */
    font-weight: 500;
    outline: none;
    transition: border-color 0.2s;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 1rem center;
    background-repeat: no-repeat;
    background-size: 1.2em 1.2em;
  }

  .ui-select:focus {
    border-color: #6366f1; /* indigo-500 */
  }

  /* グラデーションボタン */
  .btn-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: linear-gradient(135deg, #6366f1 0%, #d946ef 100%);
    color: white;
    font-weight: 800;
    font-size: 1.125rem;
    padding: 1.125rem;
    border-radius: 1rem;
    border: none;
    box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
    letter-spacing: 0.05em;
  }

  .btn-primary:active {
    transform: scale(0.98);
    box-shadow: 0 5px 15px -3px rgba(99, 102, 241, 0.4);
  }

  /* プログレスバー */
  .progress-track {
    background-color: #1e293b; /* slate-800 */
    height: 12px;
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-fill {
    background: linear-gradient(90deg, #6366f1, #ec4899);
    height: 100%;
    border-radius: 999px;
    transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

const generateLocalMessage = (data, result, channel) => {
  const isHealthy = data.smoking === 'none' && data.drinking === 'none' && data.sleep === 'good';
  const isBad = data.smoking === 'everyday' || data.drinking === 'everyday' || data.sleep === 'short';
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const patterns = {
    ai: {
      good: [
        `データ解析完了。あなたのバイタルは理想値です。現行プロトコルを維持することで、予測寿命をさらに更新できる可能性があります。`,
        `素晴らしい。統計学的に見て、あなたは同年代の中でも上位5%の健全性を維持しています。最適化された生活ですね。`,
        `完璧な計算結果です。あなたの自己管理能力は、次世代のAIモデルに採用すべきレベルに達しています。`
      ],
      bad: [
        `警告。現在の不摂生は論理的な破綻を招いています。このままでは予定より${Math.abs(result.healthDays)}日以上早く健康限界に達します。`,
        `エラー。生体パラメータが急速に悪化しています。特に日々の習慣による負荷が致命的です。早急な是正を推奨します。`,
        `予測モデルが赤信号を灯しています。あなたの肉体は現在、オーバーヒート状態にあり、冷却期間が必要です。`
      ],
      normal: [
        `解析完了。平均的なパラメータです。可もなく不可もありませんが、些細な不摂生が長期的なダウンタイムの原因となり得ます。`,
        `現状維持は可能ですが、向上は見られません。日々のルーチンに改善の余地を検出しました。`,
        `安定した出力。しかし、ピーク時のパフォーマンスを維持するには、細部のパラメータ調整が必要です。`
      ]
    },
    gal: {
      good: [`え、マジで完璧じゃん！健康意識高すぎ！その調子で超ハッピーライフ満喫しちゃおー！✨`, `ヤバい！肌ツヤまで良くなりそうな生活じゃん。そのまま100歳までギャルでいよーね！🌈`],
      bad: [`ちょ、マジでヤバくない？そんな生活してたらソッコーで終わっちゃうよ！もっと自分のカラダ大事にしなよ！💦`, `SOS出てるし！カラダが泣いてるよ？まずは今日1日だけでも早く寝てみよ！約束だよ！🙏`],
      normal: [`んー、まあ普通？でもさ、もっと健康に気を使ったら、長生きして楽しいこといっぱいできるっしょ！`, `安定のフツー。でもアンタならもっと上狙えるっしょ！自分磨き、ここから本気出してみない？🔥`]
    },
    okan: {
      good: [`あんた、ホンマにえらいわ！ちゃんと食べて寝てるんやね。おかん安心したわー。この調子やで！`, `健康第一やで！あんたが元気なのが一番の親孝行や。これからも無理せんと、今の生活続けなさいよ。`],
      bad: [`ちょっと！またそんな不摂生して！おかん、あんたの体が心配で夜も眠れへんわ！今日から不摂生は禁止やで！💢`, `夜更かしばっかりして…目の下にクマできてるで！今日こそは10時には寝なさいよ！`],
      normal: [`まあまあやね。でも油断は禁物やで。野菜もしっかり食べなあかんよ。体冷やさんようにしなさいよ。`, `ボチボチやな。年取ってからガタが来るんやから、今から貯金するつもりで健康管理しとき。`]
    },
    cat: {
      good: [`ニャーオ。（お前が長生きしてくれないと、美味しいご飯が食べられないニャ。その調子で頼むニャ）🐈`, `ゴロゴロ…（健康な人間は撫で心地が良いニャ。そのまま生きてるが良いニャ）`],
      bad: [`シャーッ！（そんなボロボロの体で私を撫でる気ニャ！？早く寝て健康になるニャ！）🐾`, `（お前の手を甘噛みする）…痛いニャろ？その痛みはお前の体が悲鳴を上げてる合図ニャ。`],
      normal: [`ニャン。（まあ、普通ニャね。とりあえず私のトイレ掃除を優先するニャ。）🐟`, `フニャ？（少し疲れてるように見えるニャ。もっと寝るが良いニャ。私の隣でな）`]
    },
    chu2: {
      good: [`フフフ…清浄なる魂の輝きか。終焉の刻印は未だ遠い。その光、大切に守り抜くがいい…。👁️`, `運命の鎖が、黄金の旋律を奏でている…。貴様の肉体という名の器は、神の領域に近い。`],
      bad: [`ククク…瘴気に蝕まれしその肉体、崩壊へのカウントダウンは既に始まっている。魂ごと消滅するぞ。⚡`, `奈落の底が見える…。貴様の不摂生が生み出した影が、光を喰らい尽くそうとしている。`],
      normal: [`運命の歯車は静かに、だが確実に回っている。光と闇が均衡を保つこの瞬間、己の混沌を鎮めよ。🌑`, `貴様の物語はまだ中盤。ここから「英雄」になるか「屍」になるかは、日々の覚悟次第だ。`]
    }
  };

  const type = isHealthy ? 'good' : isBad ? 'bad' : 'normal';
  return pick(patterns[channel][type]);
};

const calculateLifeData = (data) => {
  const birth = new Date(`${data.birthYear}-${data.birthMonth.padStart(2,'0')}-${data.birthDay.padStart(2,'0')}`);
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
    d.setDate(d.getDate() + Math.floor((years % 1) * 365.25));
    return d;
  };

  const healthDate = getTargetDate(baseHealth);
  const lifeDate = getTargetDate(baseLife);
  const diffHealth = Math.ceil((healthDate - now) / (1000 * 60 * 60 * 24));
  const diffLife = Math.ceil((lifeDate - now) / (1000 * 60 * 60 * 24));
  const totalLifeDays = Math.ceil((lifeDate - birth) / (1000 * 60 * 60 * 24));
  const livedDays = Math.ceil((now - birth) / (1000 * 60 * 60 * 24));
  let progressRate = ((livedDays / totalLifeDays) * 100).toFixed(1);
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
    const saved = localStorage.getItem('lifeAnalyzer_pro');
    if (saved) { try { setFormData(JSON.parse(saved)); } catch (e) {} }
  }, []);

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  
  return (
    <div className="min-h-screen py-10 px-5 flex flex-col items-center justify-center max-w-md mx-auto">
      
      {/* Header */}
      <div className="text-center mb-10 w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
          <HeartPulse size={32} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">AI寿命判定</h1>
        <p className="text-sm text-slate-400 font-medium">あなたの残された時間を予測します</p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        localStorage.setItem('lifeAnalyzer_pro', JSON.stringify(formData));
        onCalculate(formData);
      }} className="w-full space-y-6">
        
        {/* Basic Data Card */}
        <div className="glass-card">
          <h2 className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-5 uppercase tracking-widest">
            <User size={16} /> 基本データ
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">生年月日</label>
              <div className="grid grid-cols-3 gap-2">
                <select value={formData.birthYear} onChange={e => setFormData({...formData, birthYear: e.target.value})} className="ui-select">
                  {years.map(y => <option key={y} value={y}>{y}年</option>)}
                </select>
                <select value={formData.birthMonth} onChange={e => setFormData({...formData, birthMonth: e.target.value})} className="ui-select">
                  {Array.from({length:12}, (_, i) => i+1).map(m => <option key={m} value={m}>{m}月</option>)}
                </select>
                <select value={formData.birthDay} onChange={e => setFormData({...formData, birthDay: e.target.value})} className="ui-select">
                  {Array.from({length:31}, (_, i) => i+1).map(d => <option key={d} value={d}>{d}日</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">性別</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="ui-select">
                <option value="male">男性</option>
                <option value="female">女性</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lifestyle Card */}
        <div className="glass-card">
          <h2 className="flex items-center gap-2 text-sm font-bold text-pink-400 mb-5 uppercase tracking-widest">
            <Activity size={16} /> ライフスタイル
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">喫煙習慣</label>
              <select value={formData.smoking} onChange={e => setFormData({...formData, smoking: e.target.value})} className="ui-select">
                <option value="none">吸わない</option>
                <option value="sometimes">時々吸う</option>
                <option value="everyday">毎日吸う</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">飲酒習慣</label>
              <select value={formData.drinking} onChange={e => setFormData({...formData, drinking: e.target.value})} className="ui-select">
                <option value="none">飲まない</option>
                <option value="sometimes">時々飲む</option>
                <option value="everyday">毎日飲む</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">睡眠の状態</label>
              <select value={formData.sleep} onChange={e => setFormData({...formData, sleep: e.target.value})} className="ui-select">
                <option value="short">不足している</option>
                <option value="normal">普通</option>
                <option value="good">十分寝ている</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="btn-primary">
            寿命を予測する <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5">
      <div className="relative mb-8">
        <HeartPulse size={64} className="text-indigo-500 animate-ping absolute inset-0 opacity-30" />
        <Sparkles size={64} className="text-pink-500 animate-pulse relative" />
      </div>
      <p className="text-sm font-bold text-slate-300 tracking-[0.2em] uppercase animate-pulse">
        Calculating Future...
      </p>
    </div>
  );
}

function ResultScreen({ result, formData, onReset }) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState("ai");

  useEffect(() => {
    setMsg(generateLocalMessage(formData, result, "ai"));
  }, []);

  const handleFetch = (ch) => {
    setChannel(ch);
    setLoading(true);
    setTimeout(() => {
      setMsg(generateLocalMessage(formData, result, ch));
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen py-10 px-5 max-w-md mx-auto flex flex-col gap-6">
      
      {/* Header Title */}
      <h2 className="text-center text-xl font-bold tracking-widest text-slate-200 mt-2">判定結果レポート</h2>

      {/* 予測年齢 Card */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card text-center p-5">
          <p className="text-xs text-slate-400 font-bold mb-1">予測健康寿命</p>
          <div className="text-3xl font-extrabold text-white">
            {result.healthAge}<span className="text-sm font-medium text-slate-500 ml-1">歳</span>
          </div>
        </div>
        <div className="glass-card text-center p-5">
          <p className="text-xs text-slate-400 font-bold mb-1">予測平均寿命</p>
          <div className="text-3xl font-extrabold text-white">
            {result.lifeAge}<span className="text-sm font-medium text-slate-500 ml-1">歳</span>
          </div>
        </div>
      </div>

      {/* メイン: 残り日数 Card */}
      <div className="glass-card p-8 text-center relative overflow-hidden border-indigo-500/30">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
        
        <div className="mb-8">
          <p className="text-xs font-bold text-indigo-400 tracking-widest mb-3">健康でいられる残り日数</p>
          <div className="flex items-baseline justify-center">
            <span className={`text-6xl font-black tracking-tighter ${result.isHealthOver ? 'text-red-500' : 'text-white'}`}>
              {result.isHealthOver ? "LIMIT" : result.healthDays.toLocaleString()}
            </span>
            {!result.isHealthOver && <span className="text-xl text-slate-500 font-bold ml-1">日</span>}
          </div>
        </div>
        
        <div>
          <p className="text-xs font-bold text-pink-400 tracking-widest mb-3">生命の残り日数</p>
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-black text-pink-500 tracking-tighter">
              {result.isLifeOver ? "ERR" : result.lifeDays.toLocaleString()}
            </span>
            {!result.isLifeOver && <span className="text-lg text-slate-500 font-bold ml-1">日</span>}
          </div>
        </div>
      </div>

      {/* 進行度 Card */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-end mb-3">
          <p className="text-xs font-bold text-slate-400">人生の進行度</p>
          <p className="text-xl font-bold text-white">{result.progressRate}%</p>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{width: `${result.progressRate}%`}}></div>
        </div>
      </div>

      {/* メッセージ Card */}
      <div className="glass-card p-6 border-l-4 border-indigo-500">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle size={16} className="text-indigo-400" />
          <span className="text-xs font-bold text-indigo-400 tracking-widest">
            {channel === 'ai' ? 'AI診断レポート' : 'キャラクターからの意見'}
          </span>
        </div>
        <div className="min-h-[80px] flex items-center">
          {loading ? (
             <div className="w-full text-center text-slate-500 text-sm animate-pulse">受信中...</div>
          ) : (
            <p className="text-slate-100 text-[15px] leading-relaxed font-medium">
              {msg}
            </p>
          )}
        </div>
      </div>

      {/* キャラクター選択 Grid */}
      <div className="mt-2">
        <p className="text-center text-xs text-slate-500 mb-3 font-bold">別の意見を聞く</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            {id: 'gal', name: 'ギャル', icon: '💅'},
            {id: 'okan', name: 'オカン', icon: '👩‍🦳'},
            {id: 'cat', name: 'ネコ', icon: '🐱'},
            {id: 'chu2', name: '闇王', icon: '👹'}  
          ].map(c => (
            <button 
              key={c.id} 
              onClick={() => handleFetch(c.id)} 
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors border ${channel === c.id ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
            >
              <span className="text-2xl mb-1">{c.icon}</span>
              <span className="text-[10px] font-bold">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 再実行 Button */}
      <div className="mt-8 flex justify-center pb-8">
        <button onClick={onReset} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold px-6 py-3 transition-colors bg-slate-900 rounded-full border border-slate-800">
          <RefreshCw size={16} /> 最初からやり直す
        </button>
      </div>

    </div>
  );
}

export default function App() {
  const [step, setStep] = useState('input');
  const [result, setResult] = useState(null);
  const [data, setData] = useState(null);

  const start = (d) => {
    setData(d); 
    setResult(calculateLifeData(d)); 
    setStep('loading');
    setTimeout(() => setStep('result'), 1500);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#020617] text-white">
      <style>{styles}</style>
      <div className="bg-glow"></div>
      <div className="relative z-10 w-full h-full min-h-screen">
        {step === 'input' && <InputScreen onCalculate={start} />}
        {step === 'loading' && <LoadingScreen />}
        {step === 'result' && <ResultScreen result={result} formData={data} onReset={() => setStep('input')} />}
      </div>
    </div>
  );
}