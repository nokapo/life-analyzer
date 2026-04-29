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
 * 特徴: iPhone(iOS Safari)での表示崩れを完全解消。Geminiプレビューの美しさをそのまま実機で再現。
 */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Noto+Sans+JP:wght@400;500;700;900&display=swap');

  :root {
    color-scheme: dark;
    background-color: #0B0F19;
  }

  body, html, #root {
    background-color: #0B0F19 !important; /* より深みのあるネイビー背景 */
    color: #F8FAFC !important;
    font-family: 'Inter', 'Noto Sans JP', sans-serif;
    -webkit-font-smoothing: antialiased;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  /* プレビュー画面と同じ控えめな背景の光 */
  .bg-glow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at top center, rgba(99, 102, 241, 0.12), transparent 50%);
    z-index: -1;
    pointer-events: none;
  }

  /* グラスモーフィズム調のカード (プレビュー再現) */
  .glass-card {
    background: #111827 !important; /* 安定したダークネイビー */
    border: 1px solid #1F2937 !important;
    border-radius: 1.25rem !important;
    padding: 1.5rem !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  }

  /* 確実な3列・2列レイアウト (Tailwindパージ対策) */
  .flex-3-cols {
    display: flex !important;
    gap: 0.5rem !important;
    width: 100% !important;
  }
  .flex-3-cols > * { flex: 1 !important; }
  
  .grid-2-cols {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1rem !important;
  }

  /* iOS Safariのデフォルトスタイルを完全に上書きするセレクトボックス */
  .ui-select {
    width: 100% !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    background-color: #1F2937 !important;
    border: 1px solid #374151 !important;
    color: #F8FAFC !important;
    border-radius: 0.75rem !important;
    padding: 0.875rem 1rem !important;
    font-size: 16px !important; /* iOS自動ズーム防止 */
    font-weight: 500 !important;
    outline: none !important;
    transition: border-color 0.2s !important;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") !important;
    background-position: right 1rem center !important;
    background-repeat: no-repeat !important;
    background-size: 1.2em 1.2em !important;
    cursor: pointer !important;
  }

  .ui-select:focus {
    border-color: #8B5CF6 !important;
  }

  /* グラデーションボタン (プレビュー再現) */
  .btn-primary {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    background: linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%) !important;
    color: #FFFFFF !important;
    font-weight: 800 !important;
    font-size: 1.125rem !important;
    padding: 1.125rem !important;
    border-radius: 0.75rem !important;
    border: none !important;
    box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.4) !important;
    cursor: pointer !important;
    transition: transform 0.1s, box-shadow 0.1s !important;
    letter-spacing: 0.05em !important;
  }

  .btn-primary:active {
    transform: scale(0.98) !important;
    box-shadow: 0 5px 15px -3px rgba(139, 92, 246, 0.4) !important;
  }

  /* テキストのスタイル強制 (iPhoneで暗くなる問題の解消) */
  .text-title {
    color: #FFFFFF !important;
    font-size: 2rem !important;
    font-weight: 900 !important;
    letter-spacing: -0.025em !important;
    margin-bottom: 0.5rem !important;
  }
  .text-subtitle {
    color: #9CA3AF !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
  }
  .label-text {
    display: block !important;
    color: #D1D5DB !important;
    font-size: 0.75rem !important;
    font-weight: 600 !important;
    margin-bottom: 0.375rem !important;
  }
  .section-title {
    display: flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
    font-size: 0.875rem !important;
    font-weight: 700 !important;
    margin-bottom: 1.25rem !important;
  }
  .text-cyan { color: #38BDF8 !important; }
  .text-pink { color: #F472B6 !important; }

  /* 判定結果画面用 */
  .result-label {
    color: #9CA3AF !important;
    font-size: 0.75rem !important;
    font-weight: 700 !important;
    margin-bottom: 0.25rem !important;
  }
  .result-value-sm {
    color: #FFFFFF !important;
    font-size: 2.25rem !important;
    font-weight: 900 !important;
  }
  .result-unit {
    color: #6B7280 !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
    margin-left: 0.25rem !important;
  }

  /* プログレスバー */
  .progress-track {
    background-color: #1F2937 !important;
    height: 12px !important;
    border-radius: 999px !important;
    overflow: hidden !important;
  }
  .progress-fill {
    background: linear-gradient(90deg, #8B5CF6, #F472B6) !important;
    height: 100% !important;
    border-radius: 999px !important;
    transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
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
        <div className="flex justify-center mb-3">
          <HeartPulse size={48} color="#818CF8" />
        </div>
        <h1 className="text-title">AI寿命判定</h1>
        <p className="text-subtitle">あなたの残された時間を予測します</p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        localStorage.setItem('lifeAnalyzer_pro', JSON.stringify(formData));
        onCalculate(formData);
      }} className="w-full flex flex-col gap-6">
        
        {/* Basic Data Card */}
        <div className="glass-card">
          <h2 className="section-title text-cyan">
            <User size={18} /> 基本データ
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label-text">生年月日</label>
              <div className="flex-3-cols">
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
              <label className="label-text">性別</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="ui-select">
                <option value="male">男性</option>
                <option value="female">女性</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lifestyle Card */}
        <div className="glass-card">
          <h2 className="section-title text-pink">
            <Activity size={18} /> ライフスタイル
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label-text">喫煙習慣</label>
              <select value={formData.smoking} onChange={e => setFormData({...formData, smoking: e.target.value})} className="ui-select">
                <option value="none">吸わない</option>
                <option value="sometimes">時々吸う</option>
                <option value="everyday">毎日吸う</option>
              </select>
            </div>
            <div>
              <label className="label-text">飲酒習慣</label>
              <select value={formData.drinking} onChange={e => setFormData({...formData, drinking: e.target.value})} className="ui-select">
                <option value="none">飲まない</option>
                <option value="sometimes">時々飲む</option>
                <option value="everyday">毎日飲む</option>
              </select>
            </div>
            <div>
              <label className="label-text">睡眠の状態</label>
              <select value={formData.sleep} onChange={e => setFormData({...formData, sleep: e.target.value})} className="ui-select">
                <option value="short">不足している</option>
                <option value="normal">普通</option>
                <option value="good">十分寝ている</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" className="btn-primary">
            寿命を予測する <ChevronRight size={20} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </form>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5">
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <HeartPulse size={64} style={{ color: '#8B5CF6', position: 'absolute', opacity: 0.3, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
        <Sparkles size={64} style={{ color: '#F472B6', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
      </div>
      <p style={{ color: '#D1D5DB', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', animation: 'pulse 2s infinite' }}>
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
      <h2 style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800, textAlign: 'center', letterSpacing: '0.1em', marginTop: '0.5rem' }}>判定結果レポート</h2>

      {/* 予測年齢 Card */}
      <div className="grid-2-cols">
        <div className="glass-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <p className="result-label">予測健康寿命</p>
          <div className="result-value-sm">
            {result.healthAge}<span className="result-unit">歳</span>
          </div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <p className="result-label">予測平均寿命</p>
          <div className="result-value-sm">
            {result.lifeAge}<span className="result-unit">歳</span>
          </div>
        </div>
      </div>

      {/* メイン: 残り日数 Card */}
      <div className="glass-card" style={{ padding: '2rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.05), transparent)', pointerEvents: 'none' }}></div>
        
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#818CF8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>健康でいられる残り日数</p>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <span style={{ fontSize: '3.75rem', fontWeight: 900, color: result.isHealthOver ? '#EF4444' : '#FFFFFF', letterSpacing: '-0.05em', lineHeight: 1 }}>
              {result.isHealthOver ? "LIMIT" : result.healthDays.toLocaleString()}
            </span>
            {!result.isHealthOver && <span style={{ color: '#6B7280', fontSize: '1.25rem', fontWeight: 700, marginLeft: '0.25rem' }}>日</span>}
          </div>
        </div>
        
        <div>
          <p style={{ color: '#F472B6', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>生命の残り日数</p>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <span style={{ fontSize: '3rem', fontWeight: 900, color: '#F472B6', letterSpacing: '-0.05em', lineHeight: 1 }}>
              {result.isLifeOver ? "ERR" : result.lifeDays.toLocaleString()}
            </span>
            {!result.isLifeOver && <span style={{ color: '#6B7280', fontSize: '1.125rem', fontWeight: 700, marginLeft: '0.25rem' }}>日</span>}
          </div>
        </div>
      </div>

      {/* 進行度 Card */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
          <p style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>人生の進行度</p>
          <p style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800 }}>{result.progressRate}%</p>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{width: `${result.progressRate}%`}}></div>
        </div>
      </div>

      {/* メッセージ Card */}
      <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #8B5CF6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <MessageCircle size={16} color="#818CF8" />
          <span style={{ color: '#818CF8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
            {channel === 'ai' ? 'AI診断レポート' : 'キャラクターからの意見'}
          </span>
        </div>
        <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center' }}>
          {loading ? (
             <div style={{ width: '100%', textAlign: 'center', color: '#6B7280', fontSize: '0.875rem' }}>受信中...</div>
          ) : (
            <p style={{ color: '#F3F4F6', fontSize: '0.9375rem', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
              {msg}
            </p>
          )}
        </div>
      </div>

      {/* キャラクター選択 Grid */}
      <div style={{ marginTop: '0.5rem' }}>
        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>別の意見を聞く</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {[
            {id: 'gal', name: 'ギャル', icon: '💅'},
            {id: 'okan', name: 'オカン', icon: '👩‍🦳'},
            {id: 'cat', name: 'ネコ', icon: '🐱'},
            {id: 'chu2', name: '闇王', icon: '👹'}  
          ].map(c => (
            <button 
              key={c.id} 
              onClick={() => handleFetch(c.id)} 
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '0.75rem', borderRadius: '0.75rem', transition: 'all 0.2s', border: '1px solid',
                backgroundColor: channel === c.id ? 'rgba(139, 92, 246, 0.2)' : '#111827',
                borderColor: channel === c.id ? '#8B5CF6' : '#1F2937',
                color: channel === c.id ? '#FFFFFF' : '#9CA3AF',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{c.icon}</span>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#FFFFFF' }}>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 再実行 Button */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', paddingBottom: '2rem' }}>
        <button onClick={onReset} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.875rem',
          fontWeight: 700, padding: '0.75rem 1.5rem', backgroundColor: '#111827', borderRadius: '9999px',
          border: '1px solid #1F2937', cursor: 'pointer', transition: 'color 0.2s'
        }}>
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
    <div className="min-h-screen w-full relative overflow-hidden bg-[#0B0F19]">
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