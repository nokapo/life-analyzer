import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  User, 
  Wind, 
  Coffee, 
  Moon, 
  HeartPulse,
  Sparkles,
  BarChart3,
  Navigation
} from 'lucide-react';

/**
 * AI寿命判定システム (SNS/Modern Optimized Version)
 * 特徴: 膨大な回答バリエーションを搭載。UI視認性をさらに向上。
 */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&family=Outfit:wght@700;900&display=swap');

  :root {
    --primary: #6366f1;
    --secondary: #ec4899;
    --accent: #22d3ee;
    --bg-main: #0a0f1e;
    --panel-bg: #1e293b;
    --text-main: #ffffff;
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
    background: radial-gradient(circle at 50% -10%, rgba(99, 102, 241, 0.2), transparent),
                radial-gradient(circle at 0% 100%, rgba(236, 72, 153, 0.1), transparent),
                #0a0f1e;
    background-attachment: fixed;
  }

  .title-gradient {
    background: linear-gradient(to bottom, #ffffff 30%, #a5f3fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 10px rgba(165, 243, 252, 0.3));
  }

  .modern-card {
    background: rgba(30, 41, 59, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 32px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .input-group {
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 1.5rem;
  }

  .section-label {
    color: #38bdf8;
    font-size: 0.9rem;
    font-weight: 900;
    margin-bottom: 1.2rem;
    display: flex; align-items: center; gap: 0.5rem;
    letter-spacing: 0.1em;
  }

  .modern-input {
    background-color: #0f172a !important;
    border: 2px solid #334155 !important;
    color: #ffffff !important;
    border-radius: 14px;
    padding: 1.1rem;
    font-size: 16px !important;
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    transition: all 0.2s;
    font-weight: 600;
  }

  .modern-input:focus {
    border-color: var(--primary) !important;
    background-color: #161e2e !important;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  }

  .select-wrapper {
    position: relative;
  }

  .select-wrapper::after {
    content: '';
    position: absolute;
    right: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.1rem;
    height: 1.1rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2338bdf8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none;
  }

  .btn-submit {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
    color: white;
    font-weight: 900;
    font-size: 1.6rem;
    padding: 1.8rem;
    border-radius: 20px;
    box-shadow: 0 15px 35px -5px rgba(99, 102, 241, 0.6);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: none;
    width: 100%;
    letter-spacing: 0.15em;
    cursor: pointer;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .btn-submit:active {
    transform: scale(0.96);
  }

  .progress-bar-bg {
    background-color: #020617;
    height: 18px;
    border-radius: 999px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .progress-bar-fill {
    background: linear-gradient(90deg, #6366f1, #ec4899);
    height: 100%;
    transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .animate-reveal {
    animation: reveal 0.7s cubic-bezier(0.2, 1, 0.3, 1) forwards;
  }

  @keyframes reveal {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
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
        `異常なし。細胞の劣化速度が極めて低速です。このままのパフォーマンスを期待しています。`,
        `完璧な計算結果です。あなたの自己管理能力は、次世代のAIモデルに採用すべきレベルに達しています。`,
        `全生体パラメータがグリーンゾーンです。あなたの存在は、統計上の理想個体としてアーカイブされるべきです。`
      ],
      bad: [
        `警告。現在の不摂生は論理的な破綻を招いています。このままでは予定より${Math.abs(result.healthDays)}日以上早く健康限界に達します。`,
        `エラー。生体パラメータが急速に悪化しています。特に${data.smoking === 'everyday' ? '喫煙' : data.drinking === 'everyday' ? '飲酒' : '睡眠不足'}による負荷が致命的です。`,
        `分析結果は絶望的です。現在の生活維持コストは未来の寿命を前借りして支払われています。早急な是正を。`,
        `予測モデルが赤信号を灯しています。あなたの肉体は現在、オーバーヒート状態にあり、冷却期間が必要です。`,
        `非効率的なエネルギー消費を確認。あなたの習慣は、肉体の減価償却を1.5倍速で早めています。`
      ],
      normal: [
        `解析完了。平均的なパラメータです。可もなく不可もありませんが、些細な不摂生が長期的なダウンタイムの原因となり得ます。`,
        `現状維持は可能ですが、向上は見られません。日々のルーチンに改善の余地を検出しました。`,
        `標準偏差内に収まっています。さらなる寿命の延長を望むなら、生活習慣の再定義が必要です。`,
        `安定した出力。しかし、ピーク時のパフォーマンスを維持するには、細部のパラメータ調整が必要です。`,
        `予測値は停滞中。生存確率を向上させるためのアップグレードを検討してください。`
      ]
    },
    gal: {
      good: [
        `え、マジで完璧じゃん！健康意識高すぎ！その調子で超ハッピーライフ満喫しちゃおー！テンション上げてこ！✨`,
        `ヤバい！肌ツヤまで良くなりそうな生活じゃん。そのまま100歳までギャルでいよーね！応援してるし！🌈`,
        `最高かよ！将来の不安とか全然なさそう。人生勝ち組決定だね！マジリスペクト！🤟`,
        `ちょ、無敵モード入ってない？その健康美、インスタ映え間違いなし！一生ついていくわ！💖`,
        `完璧すぎてビビる！健康優等生すぎて、逆にこっちが元気もらったし！マジサンキュー！🌟`
      ],
      bad: [
        `ちょ、マジでヤバくない？そんな生活してたらソッコーで終わっちゃよ！もっと自分のカラダ大事にしなよ、ガチで！💦`,
        `見てるこっちが怖いわ！お酒とかタバコ、ちょっとは控えないとマジで老けるよ？映えない人生とかヤじゃない？`,
        `無理無理！その生活、寿命の削り方がエグいって。今すぐ改善しよ？まだ間に合うからさ、マジで！😭`,
        `SOS出てるし！カラダが泣いてるよ？まずは今日1日だけでも早く寝てみよ！約束だよ！🙏`,
        `ヤバいレベルでオワコン感出てるよ…。そんなの悲しすぎる！もっと自分に優しくしなよ！💢`
      ],
      normal: [
        `んー、まあ普通？でもさ、もっと健康に気を使ったら、もっと長生きして楽しいこといっぱいできるっしょ！`,
        `悪くないけど、もっとキラキラできるはず！睡眠不足はメイクの敵だし、ちゃんと休も？💤`,
        `可もなく不可もなくって感じ。でもさ、もっと自分に課金（健康投資）してもいいんじゃない？がんばろ！`,
        `安定のフツー。でもアンタならもっと上狙えるっしょ！自分磨き、ここから本気出してみない？🔥`,
        `普通に生活できてるのはエライけど、もっと「自分最高！」って言えるくらい整えていこーよ！✌️`
      ]
    },
    okan: {
      good: [
        `あんた、ホンマにえらいわ！ちゃんと食べて寝てるんやね。おかん安心したわー。この調子やで！`,
        `健康第一やで！あんたが元気なのが一番の親孝行や。これからも無理せんと、今の生活続けなさいよ。`,
        `ええやんか！顔色も良さそうやし、言うことなしや。おかんも鼻が高いわ！`,
        `あんた、昔からやればできる子やって信じてたわ。そのまま自分の体、大事にしていきや。`,
        `ええ感じやね！今日はお祝いに、あんたの好きなもん作ったげるから早く帰っておいでや。`
      ],
      bad: [
        `ちょっと！またそんな不摂生して！おかん、あんたの体が心配で夜も眠れへんわ！今日から不摂生は禁止やで！💢`,
        `あんた、自分の体やと思って舐めてたらあかんよ！誰が悲しむか考えなさい。今日から野菜食べや！`,
        `もう、ええ加減にしなさい！そんな無茶ばっかりして…おかん、見てられへんわ。今すぐ生活直し！`,
        `夜更かしばっかりして…目の下にクマできてるで！今日こそは10時には寝なさいよ！`,
        `酒にタバコに…あんたはもう！体が資本やっていつも言ってるやろ。反省しなさい！`
      ],
      normal: [
        `まあまあやね。でも油断は禁物やで。野菜もしっかり食べなあかんよ。体冷やさんようにしなさいよ。`,
        `普通が一番やけど、もうちょっと気をつけたほうがええんちゃう？おかんの言うこと、ちゃんと聞きや。`,
        `あんまり無理したらあかんで。たまにはゆっくり休み。あんたの体はあんた一人のもんやないんやから。`,
        `ボチボチやな。負けないように、年取ってからガタが来るんやから、今から貯金するつもりで健康管理しとき。`,
        `平凡が一番幸せやけど、もう少しだけ自分を甘やかさんと、規律正しく過ごしてみ？`
      ]
    },
    cat: {
      good: [
        `ニャーオ。（お前が長生きしてくれないと、美味しいご飯が食べられないニャ。その調子で頼むニャ）🐈`,
        `ゴロゴロ…（良い匂いがするニャ. 健康な人間は撫で心地が良いニャ。そのまま生きてるが良いニャ）`,
        `フン。（お前は私よりも長く生きる義務があるニャ. 今の規律を崩すなニャ）`,
        `（お前の足をフミフミしている）…ニャ。お前は合格ニャ。私の忠実なしもべとして長く仕えるニャ。`,
        `パシパシ。（お前の健康が維持されていることを確認したニャ。褒めてやるから顎の下を撫でるニャ）`
      ],
      bad: [
        `シャーッ！（そんなボロボロの体で私を撫でる気ニャ！？早く寝て健康になるニャ！）🐾`,
        `ニャ…（なんだか寿命の匂いが薄くなってるニャ。お酒ばっかり飲んでると私が噛み付くニャよ）`,
        `（呆れた顔で見ている）…ニャー。お前の不摂生のせいで、私の未来のカリカリが危ういニャ。`,
        `（お前の手を甘噛みする）…痛いニャろ？その痛みはお前の体が悲鳴を上げてる合図ニャ. 反省するニャ.`,
        `ニャンニャン！（タバコは臭いし体に悪いニャ！お前の肺を私の毛並みくらい綺麗にするニャ！）`
      ],
      normal: [
        `ニャン。（まあ、普通ニャね。とりあえず私のトイレ掃除を優先するニャ。お前の健康はその次ニャ）🐟`,
        `（あくびをしながら）…ニャ。そこそこの健康か。まあ、長生きして私に仕え続けるなら許してやるニャ。`,
        `フニャ？（少し疲れてるように見えるニャ. もっと寝るが良いニャ. 私の隣でな）`,
        `ニャオーン。（そこそこ元気そうだけど、もっと遊んでほしいニャ。お前の体力温存は遊びに使うニャ）`,
        `（尻尾をパタパタさせている）…ニャ. まあ、悪くないニャ. 合格点ぎりぎりニャ.`
      ]
    },
    chu2: {
      good: [
        `フフフ…清浄なる魂の輝きか。終焉の刻印は未だ遠い。その光、闇に飲まれぬよう大切に守り抜くがいい…。👁️`,
        `覚醒せし力、聖なる均衡を保っているようだな。貴様の因果律は、今、最も美しく輝いている。`,
        `運命の鎖が、黄金の旋律を奏でている…。貴様の肉体という名の器は、神の領域に等しい。`,
        `見えるぞ…貴様の魂に宿る「真実の輝き」が。このまま魔界の瘴気を退け、高みを目指すがいい。`,
        `光あれ！貴様の歩む道は、既に星々に祝福されているのだから…。`
      ],
      bad: [
        `ククク…瘴気に蝕まれしその肉体、崩壊へのカウントダウンは既に始まっている。貴様に宿る闇を制御せねば、魂ごと消滅するぞ。⚡`,
        `悲鳴を上げているな…貴様の深淵が。禁忌を犯した報いは、余りにも重い。今すぐその負の連鎖を断ち切るのだ。`,
        `奈落の底が見える…。貴様の不摂生が生み出した影が、光を喰らい尽くそうとしている。絶望に染まる前に抗え。`,
        `血塗られた契約はまだ終わっていない。だが、このままでは貴様の「魂」が器から溢れ出してしまう…。愚かな。`,
        `静かにしろ、私の右腕が疼く…。貴様の未来から「無」の波動が伝わってくる。これ以上の堕落は許さん。`
      ],
      normal: [
        `運命の歯車は静かに、だが確実に回っている。光と闇が均衡を保つこの瞬間、己の中の混沌を鎮めることができるか。🌑`,
        `まだ混沌の中か…。貴様の可能性は閉ざされてはいないが、光へ手を伸ばす意志が足りぬようだ。`,
        `凡庸なる平穏…。だが、その静寂こそが嵐の前の静けさであることに、貴様はまだ気づいていないようだな。`,
        `貴様の物語はまだ中盤。ここから「英雄」になるか「屍」になるかは、日々の覚悟次第だ。`,
        `中途半端な覚醒は死を招く。己の内なるパラメータを極限まで引き上げるのだ…。`
      ]
    }
  };

  const type = isHealthy ? 'good' : isBad ? 'bad' : 'normal';
  return pick(patterns[channel][type]);
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
    const saved = localStorage.getItem('lifeAnalyzerData_v5');
    if (saved) {
      try { setFormData(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="modern-card w-full max-w-md p-8 md:p-10 animate-reveal">
        <div className="text-center mb-12">
          <div className="inline-block p-5 bg-indigo-500/10 rounded-[2rem] mb-6 border border-indigo-500/20 shadow-inner">
            <HeartPulse className="text-indigo-400 w-16 h-16" />
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tighter title-gradient">AI寿命判定システム</h1>
          <p className="text-slate-400 text-sm font-bold tracking-widest opacity-80 uppercase">AI Temporal Prediction</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem('lifeAnalyzerData_v5', JSON.stringify(formData));
          const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
          onCalculate({ ...formData, birthDate });
        }} className="space-y-8">
          
          <div className="input-group">
            <h2 className="section-label">
              <User className="w-5 h-5" /> 基本データ
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="select-wrapper">
                <span className="text-[10px] text-slate-400 mb-1.5 block font-black">誕生年</span>
                <select value={formData.birthYear} onChange={e => setFormData({...formData, birthYear: e.target.value})} className="modern-input">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="select-wrapper">
                <span className="text-[10px] text-slate-400 mb-1.5 block font-black">月</span>
                <select value={formData.birthMonth} onChange={e => setFormData({...formData, birthMonth: e.target.value})} className="modern-input">
                  {Array.from({length:12}, (_, i) => i+1).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="select-wrapper">
                <span className="text-[10px] text-slate-400 mb-1.5 block font-black">日</span>
                <select value={formData.birthDay} onChange={e => setFormData({...formData, birthDay: e.target.value})} className="modern-input">
                  {Array.from({length:31}, (_, i) => i+1).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="select-wrapper">
              <span className="text-[10px] text-slate-400 mb-1.5 block font-black">性別</span>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="modern-input">
                <option value="male">男性</option>
                <option value="female">女性</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <h2 className="section-label">
              <Sparkles className="w-5 h-5" /> ライフスタイル
            </h2>
            <div className="space-y-4">
              <div className="select-wrapper">
                <span className="text-[10px] text-slate-400 mb-1.5 block font-black">喫煙習慣</span>
                <select value={formData.smoking} onChange={e => setFormData({...formData, smoking: e.target.value})} className="modern-input">
                  <option value="none">吸わない</option>
                  <option value="sometimes">時々吸う</option>
                  <option value="everyday">毎日吸う</option>
                </select>
              </div>
              <div className="select-wrapper">
                <span className="text-[10px] text-slate-400 mb-1.5 block font-black">飲酒習慣</span>
                <select value={formData.drinking} onChange={e => setFormData({...formData, drinking: e.target.value})} className="modern-input">
                  <option value="none">飲まない</option>
                  <option value="sometimes">時々飲む</option>
                  <option value="everyday">毎日飲む</option>
                </select>
              </div>
              <div className="select-wrapper">
                <span className="text-[10px] text-slate-400 mb-1.5 block font-black">睡眠の状態</span>
                <select value={formData.sleep} onChange={e => setFormData({...formData, sleep: e.target.value})} className="modern-input">
                  <option value="short">不足している</option>
                  <option value="normal">普通</option>
                  <option value="good">十分寝ている</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-submit">
            寿命を判定する
          </button>
        </form>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1e]">
      <div className="w-64 text-center">
        <div className="relative mb-10">
           <HeartPulse className="w-20 h-20 text-indigo-500 animate-ping absolute inset-0 opacity-20 mx-auto" />
           <Sparkles className="w-20 h-20 text-pink-500 animate-pulse relative mx-auto" />
        </div>
        <div className="progress-bar-bg mb-6">
          <div className="progress-bar-fill w-1/2 animate-pulse"></div>
        </div>
        <p className="text-lg font-black text-white tracking-[0.3em] uppercase">Decoding Future...</p>
      </div>
    </div>
  );
}

function ResultScreen({ result, formData, onReset }) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState("gal"); // デフォルトをギャルに変更
  const [showOthers, setShowOthers] = useState(false);

  useEffect(() => {
    setMsg(generateLocalMessage(formData, result, "ai"));
  }, []);

  const handleFetch = () => {
    setLoading(true);
    setTimeout(() => {
      setMsg(generateLocalMessage(formData, result, channel));
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto flex flex-col items-center">
      <div className="modern-card w-full p-8 md:p-10 animate-reveal mt-6 mb-6 overflow-hidden">
        
        <h2 className="text-center text-2xl font-black mb-8 title-gradient">判定結果レポート</h2>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-slate-700/50 shadow-inner">
            <p className="text-sm text-slate-300 font-black mb-2 uppercase tracking-widest text-center">予測健康寿命</p>
            <p className="text-4xl font-en font-black text-white text-center">{result.healthAge}<span className="text-sm ml-1 font-sans-jp text-slate-500">歳</span></p>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-slate-700/50 shadow-inner">
            <p className="text-sm text-slate-300 font-black mb-2 uppercase tracking-widest text-center">予測平均寿命</p>
            <p className="text-4xl font-en font-black text-white text-center">{result.lifeAge}<span className="text-sm ml-1 font-sans-jp text-slate-500">歳</span></p>
          </div>
          <div className="col-span-2 bg-indigo-500/5 p-8 rounded-[2.5rem] border border-indigo-500/20">
            <div className="flex justify-between items-baseline mb-4">
              <p className="text-sm text-indigo-400 font-black tracking-widest uppercase">人生の進行度</p>
              <p className="text-3xl font-en font-black text-indigo-400">{result.progressRate}%</p>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{width: `${result.progressRate}%`}}></div>
            </div>
          </div>
        </div>

        <div className="text-center py-12 bg-slate-900/60 rounded-[3rem] border border-slate-800 mb-10 relative overflow-hidden shadow-2xl">
          <div className="mb-12 relative z-10">
            <p className="text-base text-indigo-400 font-black tracking-[0.2em] mb-4 uppercase">健康でいられる残り日数</p>
            <div className={`text-8xl font-en font-black leading-none tracking-tighter ${result.isHealthOver ? 'text-red-500' : 'text-white'}`}>
              {result.isHealthOver ? "LIMIT" : result.healthDays.toLocaleString()}
              <span className="text-2xl ml-2 font-sans-jp text-slate-600">日</span>
            </div>
          </div>
          
          <div className="relative z-10">
            <p className="text-base text-pink-500 font-black tracking-[0.2em] mb-4 uppercase">生命の残り日数</p>
            <div className="text-6xl font-en font-black text-pink-500 leading-none tracking-tighter">
              {result.isLifeOver ? "ERR" : result.lifeDays.toLocaleString()}
              <span className="text-2xl ml-2 font-sans-jp text-slate-700">日</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 p-8 rounded-[2.5rem] border-l-8 border-indigo-500 relative mb-12 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-xs text-indigo-400 font-black tracking-[0.3em] uppercase">AI診断レポート</span>
          </div>
          
          {loading ? (
             <div className="flex-1 flex items-center justify-center text-indigo-500 font-bold text-base animate-pulse py-4">
               受信中...
             </div>
          ) : (
            <p className="text-white text-xl leading-relaxed font-bold tracking-wide animate-reveal">
              {msg}
            </p>
          )}
        </div>

        <div className="space-y-10">
          <button 
            onClick={() => setShowOthers(!showOthers)} 
            className="flex items-center gap-4 mx-auto px-12 py-5 rounded-full bg-slate-800/80 text-sm font-black text-slate-300 hover:text-white transition-all border border-slate-700 shadow-xl"
          >
            <Navigation className={`w-5 h-5 transition-transform duration-300 ${showOthers ? 'rotate-180' : ''}`} />
            他のキャラクターの意見を聞く
          </button>

          {showOthers && (
            <div className="space-y-10 animate-reveal">
              <div className="grid grid-cols-4 gap-4">
                {[
                  {id: 'gal', name: 'ギャル', icon: '💅'},
                  {id: 'okan', name: 'オカン', icon: '👩‍🦳'},
                  {id: 'cat', name: 'ネコ', icon: '🐱'},
                  {id: 'chu2', name: '闇王', icon: '👹'}  
                ].map(c => (
                  <button key={c.id} onClick={() => setChannel(c.id)} 
                    className={`character-btn flex flex-col items-center p-5 rounded-[2rem] transition-all border-2 ${channel === c.id ? 'bg-indigo-500/20 border-indigo-500 scale-105' : 'bg-slate-900 border-slate-800 opacity-60'}`}>
                    <span className="text-4xl mb-3">{c.icon}</span>
                    <span className="text-sm font-black text-white">{c.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleFetch} className="btn-submit py-6 text-xl">
                メッセージを受信
              </button>
            </div>
          )}
        </div>

        <div className="mt-20 flex justify-center border-t border-slate-800 pt-10">
          <button onClick={onReset} className="text-slate-500 hover:text-indigo-400 text-sm font-black tracking-[0.4em] px-12 py-4 transition-all uppercase">
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

  const start = (d) => {
    setData(d); 
    setResult(calculateLifeData(d)); 
    setStep('loading');
    setTimeout(() => setStep('result'), 2000);
  };

  return (
    <div className="bg-gradient-modern min-h-screen">
      <style>{styles}</style>
      
      <main className="relative z-10">
        {step === 'input' && <InputScreen onCalculate={start} />}
        {step === 'loading' && <LoadingScreen />}
        {step === 'result' && <ResultScreen result={result} formData={data} onReset={() => setStep('input')} />}
      </main>
    </div>
  );
}