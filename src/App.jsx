import React, { useState, useEffect } from 'react';
import { 
  HeartPulse,
  Sparkles,
  User,
  Activity,
  ChevronRight,
  RefreshCw,
  MessageCircle,
  Info,
  ChevronDown
} from 'lucide-react';

/**
 * 寿命判定システム (Professional Mobile First UI Version)
 * 特徴: iPhone(iOS Safari)での表示崩れを完全解消。
 * 更新: 運動習慣の設問とロジックを追加。
 */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Noto+Sans+JP:wght@400;500;700;900&display=swap');

  :root {
    color-scheme: dark;
    background-color: #0B0F19;
  }

  body, html, #root {
    background-color: #0B0F19 !important;
    color: #F8FAFC !important;
    font-family: 'Inter', 'Noto Sans JP', sans-serif;
    -webkit-font-smoothing: antialiased;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

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

  .glass-card {
    background: #111827 !important;
    border: 1px solid #1F2937 !important;
    border-radius: 1.25rem !important;
    padding: 1.5rem !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  }

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
    font-size: 16px !important;
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

  .animate-reveal {
    animation: reveal 0.4s cubic-bezier(0.2, 1, 0.3, 1) forwards;
  }
  @keyframes reveal {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const generateLocalMessage = (data, result, channel) => {
  const isHealthy = data.smoking === 'none' && data.drinking === 'none' && data.sleep === 'good' && data.exercise !== 'none';
  const isBad = data.smoking === 'everyday' || data.drinking === 'everyday' || data.sleep === 'short';
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const patterns = {
    ai: {
      good: [
        `データ解析完了。あなたのバイタルは理想値です。現行プロトコルを維持することで、予測寿命をさらに更新できる可能性があります。`,
        `素晴らしい。統計学的に見て、あなたは同年代の中でも上位5%の健全性を維持しています。最適化された生活ですね。`,
        `完璧な計算結果です。あなたの自己管理能力は、次世代の健康モデルに採用すべきレベルに達しています。`,
        `全生体パラメータがグリーンゾーンです。あなたの存在は、統計上の理想個体としてアーカイブされるべきです。`,
        `解析の結果、細胞の劣化速度が極めて低速であることが判明しました。このままのパフォーマンスを期待しています。`,
        `あなたの生活習慣は完璧に制御されています。生存日数を最大化するための最適なルートを進行中です。`,
        `生体データのスコアが上限に達しています。日々の節制が明確な数値として表れました。`,
        `驚くべき結果です。現在の生活を続ける限り、健康寿命の限界を突破できる確率が高いです。`,
        `バランスの取れた素晴らしいライフスタイルです。あなたの身体は現在、最も効率的なエネルギー運用を行っています。`,
        `解析終了。あなたの身体的ポテンシャルは最高水準を維持しています。引き続き健康的な航海を。`
      ],
      bad: [
        `警告。現在の不摂生は論理的な破綻を招いています。このままでは予定より${Math.abs(result.healthDays)}日以上早く健康限界に達します。`,
        `エラー。生体パラメータが急速に悪化しています。特に日々の習慣による負荷が致命的です。早急な是正を推奨します。`,
        `予測モデルが赤信号を灯しています。あなたの肉体は現在、オーバーヒート状態にあり、冷却期間が必要です。`,
        `非効率的なエネルギー消費を確認。あなたの習慣は、肉体の減価償却を通常の1.5倍の速度で早めています。`,
        `分析結果は絶望的です。現在の生活維持コストは未来の寿命を前借りして支払われています。`,
        `重大な警告。この生活習慣を継続した場合、肉体の強制シャットダウンが早まる危険性があります。`,
        `生存確率の低下を検知しました。不摂生が、あなたの内部バッテリーを激しく消耗させています。`,
        `危険域に突入しています。寿命のパラメーターが急降下中です。今すぐ生活をリカバリーしてください。`,
        `解析システムが悲鳴を上げています。あなたの健康残高はすでにマイナスに差し掛かろうとしています。`,
        `緊急事態。このままでは予定されたライフスパンを全うできません。即座に生活習慣のオーバーホールが必要です。`
      ],
      normal: [
        `解析完了。平均的なパラメータです。可もなく不可もありませんが、些細な不摂生が長期的なダウンタイムの原因となり得ます。`,
        `現状維持は可能ですが、向上は見られません。日々のルーチンに改善の余地を検出しました。`,
        `安定した出力。しかし、ピーク時のパフォーマンスを維持するには、細部のパラメータ調整が必要です。`,
        `標準偏差内に収まっています。さらなる寿命の延長を望むなら、生活習慣の再定義が必要です。`,
        `予測値は停滞中。生存確率を向上させるための生活改善を検討してください。`,
        `あなたのデータは極めて「普通」です。健康と不健康の境界線上を歩いている状態と言えます。`,
        `リスクも少ないですが、アドバンテージもありません。少しの改善で劇的に数値が向上する可能性があります。`,
        `現在のステータスは安全圏です。しかし油断すればすぐに警告領域へと転落するでしょう。`,
        `特筆すべき異常はありませんが、褒められる点もありません。未来の自分のために、今から投資を始めませんか？`,
        `全体的に平均値に収束しています。ただし、年齢とともにこの維持は困難になります。早めの対策を。`
      ]
    },
    gal: {
      good: [
        `え、マジで完璧じゃん！健康意識高すぎ！その調子で超ハッピーライフ満喫しちゃおー！✨`,
        `ヤバい！肌ツヤまで良くなりそうな生活じゃん。そのまま100歳までギャルでいよーね！🌈`,
        `最高かよ！将来の不安とか全然なさそう。人生勝ち組決定だね！マジリスペクト！🤟`,
        `ちょ、無敵モード入ってない？その健康美、インスタ映え間違いなし！一生ついていくわ！💖`,
        `完璧すぎてビビる！健康優等生すぎて、逆にこっちが元気もらったし！マジサンキュー！🌟`,
        `美意識高すぎ！それ絶対モテるやつじゃん。健康的なオーラ出まくりで超いい感じ！💅`,
        `控えめに言って神！アンタの自己管理能力、マジでバズるレベルだよ！そのまま突っ走れ！🚀`,
        `超イケてる！長生きして楽しいこと全部やり尽くそ！うちもアンタみたいになりたいし！🥰`,
        `レベチな健康状態じゃん！毎日ちゃんと自分を労っててマジえらい！ご褒美にスイーツ食べよ！🍰`,
        `パーフェクト！健康寿命長すぎて、未来でも一緒にプリクラ撮れそう！最高かよ！✌️`
      ],
      bad: [
        `ちょ、マジでヤバくない？そんな生活してたらソッコーで終わっちゃうよ！もっと自分のカラダ大事にしなよ！💦`,
        `SOS出てるし！カラダが泣いてるよ？まずは今日1日だけでも早く寝てみよ！約束だよ！🙏`,
        `見てるこっちが怖いわ！お酒とかタバコ、ちょっとは控えないとマジで老けるよ？映えない人生とかヤじゃない？`,
        `無理無理！その生活、寿命の削り方がエグいって。今すぐ改善しよ？まだ間に合うからさ、マジで！😭`,
        `ヤバいレベルでオワコン感出てるよ…。そんなの悲しすぎる！もっと自分に優しくしなよ！💢`,
        `ストレス溜まりすぎじゃない？このままだとマジで倒れちゃうから、一回全部休んでリセットしよ！🛌`,
        `寿命の無駄遣いヤバい！アンタのポテンシャルこんなもんじゃないっしょ！？明日から本気出して！🔥`,
        `ちょ、一旦ストップ！今の生活続けてたら、マジで盛れない未来しか待ってないよ？気をつけて！⚠️`,
        `アンタのカラダ、マジでボロボロじゃん…。そんなんじゃ楽しいことも楽しめないよ？一旦寝よ！💤`,
        `ガチで寿命縮みすぎ！明日からスムージー飲んでヨガしなよ！うちが監視してあげるから！👀`
      ],
      normal: [
        `んー、まあ普通？でもさ、もっと健康に気を使ったら、長生きして楽しいこといっぱいできるっしょ！`,
        `安定のフツー。でもアンタならもっと上狙えるっしょ！自分磨き、ここから本気出してみない？🔥`,
        `悪くないけど、もっとキラキラできるはず！睡眠不足はメイクの敵だし、ちゃんと休も？💤`,
        `可もなく不可もなくって感じ。でもさ、もっと自分に課金（健康投資）してもいいんじゃない？がんばろ！`,
        `普通に生活できてるのはエライけど、もっと「自分最高！」って言えるくらい整えていこーよ！✌️`,
        `まぁまぁいけてるけど、ギリギリ感あるかも？もうちょっとだけ自分に優しくしてもいいんじゃない？🥺`,
        `フツーの毎日送れてるのは平和でいいけど、油断してたらあっという間にヤバくなるよ？気引き締めてこ！`,
        `良くも悪くもないって一番もったいない！ちょっと筋トレとか始めてみない？絶対変わるから！💪`,
        `今はまだ大丈夫だけど、歳とったらガタくるやつかも！今のうちに健康貯金しとこ！💰`,
        `まぁ、今のままでもいっか！でも無理だけは絶対しないでね。うちとの約束！🤝`
      ]
    },
    okan: {
      good: [
        `あんた、ホンマにえらいわ！ちゃんと食べて寝てるんやね。おかん安心したわー。この調子やで！`,
        `健康第一やで！あんたが元気なのが一番の親孝行や。これからも無理せんと、今の生活続けなさいよ。`,
        `ええやんか！顔色も良さそうやし、言うことなしや。おかんも鼻が高いわ！`,
        `あんた、昔からやればできる子やって信じてたわ。そのまま自分の体、大事にしていきや。`,
        `ええ感じやね！今日はお祝いに、あんたの好きなもん作ったげるから早く帰っておいでや。`,
        `健康診断もばっちりやろ？その生活習慣、ずっと守り抜くんやで。おかんの自慢の子や！`,
        `規則正しい生活が一番のクスリや。これからも油断せんと、しっかり生きなさいよ。`,
        `ちゃんと自分の面倒見れてて偉い偉い。これならどこに出しても恥ずかしないわ。`,
        `おかんが教えた通り、ちゃんと生活できてるみたいやね。その調子で長生きするんやで！`,
        `何事も体が資本やからね。あんたが元気にしてるだけで、おかんはもう十分幸せやわ。`
      ],
      bad: [
        `ちょっと！またそんな不摂生して！おかん、あんたの体が心配で夜も眠れへんわ！今日から不摂生は禁止やで！💢`,
        `夜更かしばっかりして…目の下にクマできてるで！今日こそは10時には寝なさいよ！`,
        `あんた、自分の体やと思って舐めてたらあかんよ！誰が悲しむか考えなさい。今日から野菜食べや！`,
        `もう、ええ加減にしなさい！そんな無茶ばっかりして…おかん、見てられへんわ。今すぐ生活直し！`,
        `酒にタバコに…あんたはもう！体が資本やっていつも言ってるやろ。反省しなさい！`,
        `あんた、将来病気になって泣きついてきても知らんよ！今のうちに生活改めなさい！`,
        `カップラーメンばっかり食べてるんちゃう？たまには実家帰ってきなさい、栄養あるもん食べさすから！`,
        `そんなボロボロの体でどないするん！あんたの代わりはおらんのやで。もっと自分を大事にしなさい！`,
        `言うこと聞かへん子やねぇ…。今からでも遅くないから、生活のリズム整えなさい！`,
        `毎日なんやかんや理由つけて不摂生してるんやろ！おかんにはお見通しや！明日から早起きしなさい！`
      ],
      normal: [
        `まあまあやね。でも油断は禁物やで。野菜もしっかり食べなあかんよ。体冷やさんようにしなさいよ。`,
        `ボチボチやな。年取ってからガタが来るんやから、今から貯金するつもりで健康管理しとき。`,
        `普通が一番やけど、もうちょっと気をつけたほうがええんちゃう？おかんの言うこと、ちゃんと聞きや。`,
        `あんまり無理したらあかんで。たまにはゆっくり休み。あんたの体はあんた一人のもんやないんやから。`,
        `平凡が一番幸せやけど、もう少しだけ自分を甘やかさんと、規律正しく過ごしてみ？`,
        `悪くはないんやけど、おかんから見たらまだまだやね。もうちょっと睡眠時間増やしなさい。`,
        `まぁ、ギリギリ合格点ってとこやろか。でも油断したらすぐ不健康になるで！`,
        `若いからって無理が効くと思ったら大間違いやで。今のうちからしっかりケアしとき。`,
        `普通に生きるのが一番難しいんやから、あんたはようやってるわ。でもたまには息抜きしや。`,
        `無茶はしてないみたいやけど、もうちょっと運動もせなあかんで。ラジオ体操から始めなさい！`
      ]
    },
    cat: {
      good: [
        `ニャーオ。（お前が長生きしてくれないと、美味しいご飯が食べられないニャ。その調子で頼むニャ）🐈`,
        `ゴロゴロ…（健康な人間は撫で心地が良いニャ。そのまま生きてるが良いニャ）`,
        `フン。（お前は私よりも長く生きる義務があるニャ。今の規律を崩すなニャ）`,
        `（お前の足をフミフミしている）…ニャ。お前は合格ニャ。私の忠実なしもべとして長く仕えるニャ。`,
        `パシパシ。（お前の健康が維持されていることを確認したニャ。褒めてやるから顎の下を撫でるニャ）`,
        `ニャーン！（お前の寿命が延びた分、私のおやつも増えるはずニャ！期待してるニャ！）`,
        `スリスリ…（お前の体から健康な匂いがするニャ。これなら安心して膝の上で眠れるニャ）`,
        `ニャッ。（お前が元気なら、私も元気に走り回れるニャ。これからも健康管理を怠るなニャ）`,
        `（満足げに毛づくろいをしている）…ニャ。お前の努力は認めてやるニャ。これからも精進するニャ。`,
        `ニャン。（お前が長生きすれば、私のブラッシングの回数も増えるニャ。いいこと尽くしニャ）`
      ],
      bad: [
        `シャーッ！（そんなボロボロの体で私を撫でる気ニャ！？早く寝て健康になるニャ！）🐾`,
        `（お前の手を甘噛みする）…痛いニャろ？その痛みはお前の体が悲鳴を上げてる合図ニャ。`,
        `ニャ…（なんだか寿命の匂いが薄くなってるニャ。お酒ばっかり飲んでると私が噛み付くニャよ）`,
        `（呆れた顔で見ている）…ニャー。お前の不摂生のせいで、私の未来のカリカリが危ういニャ。`,
        `ニャンニャン！（タバコは臭いし体に悪いニャ！お前の肺を私の毛並みくらい綺麗にするニャ！）`,
        `シャーッ！（お前の体から不健康な匂いがプンプンするニャ！近寄らないでニャ！）`,
        `（お前のお腹に乗って重みをかける）…ウッ！お前の体が悲鳴を上げてるのが伝わってくるニャ！`,
        `ニャーオ…（お前が倒れたら、誰が私のトイレ掃除をするニャ？もっと責任感を持つニャ！）`,
        `（猫パンチを繰り出す）…ニャ！目を覚ますニャ！お前の生活リズムは完全に崩壊してるニャ！`,
        `ニャッ！（私のおやつを減らしてでも、お前の健康に投資するべきニャ！…いや、おやつは減らさないニャ！）`
      ],
      normal: [
        `ニャン。（まあ、普通ニャね。とりあえず私のトイレ掃除を優先するニャ。）🐟`,
        `フニャ？（少し疲れてるように見えるニャ。もっと寝るが良いニャ。私の隣でな）`,
        `（あくびをしながら）…ニャ。そこそこの健康か。まあ、長生きして私に仕え続けるなら許してやるニャ。`,
        `ニャオーン。（そこそこ元気そうだけど、もっと遊んでほしいニャ。お前の体力温存は遊びに使うニャ）`,
        `（尻尾をパタパタさせている）…ニャ。まあ、悪くないニャ。合格点ぎりぎりニャ。`,
        `ニャ。（お前の健康状態には興味ないニャ。ただ、ご飯の時間だけは守るニャ）`,
        `ムニャムニャ…（普通が一番ニャ。お前も無理せず、私と一緒に一日中寝てればいいニャ）`,
        `ニャッ。（お前の寿命が尽きる前に、新しい猫じゃらしを買ってくるニャ。忘れるなニャ）`,
        `（お前をじっと見つめる）…ニャ。お前の寿命は、私の気分次第ニャ。だからもっと甘やかすニャ。`,
        `ニャーン。（今の生活を維持すれば、まあまあ生きられるニャ。でも油断はするなニャ）`
      ]
    },
    chu2: {
      good: [
        `フフフ…清浄なる魂の輝きか。終焉の刻印は未だ遠い。その光、大切に守り抜くがいい…。👁️`,
        `運命の鎖が、黄金の旋律を奏でている…。貴様の肉体という名の器は、神の領域に近い。`,
        `覚醒せし力、聖なる均衡を保っているようだな。貴様の因果律は、今、最も美しく輝いている。`,
        `見えるぞ…貴様の魂に宿る「真実の輝き」が。このまま魔界の瘴気を退け、高みを目指すがいい。`,
        `光あれ！貴様の歩む道は、既に星々に祝福されているのだから…。`,
        `素晴らしい…。貴様のステータスは、伝説の『不老不死』の片鱗を見せている。その力、解放する時が来るやもしれん。`,
        `魔眼が捉えた貴様の未来は、まばゆい光に満ちている。その健康なる肉体で、我と共に世界を統べるか？`,
        `貴様の細胞の一つ一つが、宇宙の真理と共鳴している…。この究極の調和、容易には崩せまい。`,
        `混沌の世において、これほどまでに澄み切ったオーラを放つとは…。貴様、ただ者ではないな。`,
        `刻の歯車が、貴様のためにゆっくりと回り始めた。悠久の時を生きる準備はできているか？`
      ],
      bad: [
        `ククク…瘴気に蝕まれしその肉体、崩壊へのカウントダウンは既に始まっている。魂ごと消滅するぞ。⚡`,
        `奈落の底が見える…。貴様の不摂生が生み出した影が、光を喰らい尽くそうとしている。`,
        `悲鳴を上げているな…貴様の深淵が。禁忌を犯した報いは、余りにも重い。今すぐその負の連鎖を断ち切るのだ。`,
        `血塗られた契約はまだ終わっていない。だが、このままでは貴様の「魂」が器から溢れ出してしまう…。愚かな。`,
        `静かにしろ、私の右腕が疼く…。貴様の未来から「無」の波動が伝わってくる。これ以上の堕落は許さん。`,
        `破滅のプレリュードが聞こえるか？貴様のライフポイントはすでにレッドゾーン。ダークマターに飲み込まれるのも時間の問題だ。`,
        `愚かしき定命の者よ…。己の命を削るその行為、魔界の悪魔すら呆れ果てているぞ。`,
        `貴様のオーラが、どす黒く濁っている…。このままでは『終焉の獣』の餌食となる運命は避けられん。`,
        `警告する…。貴様の存在確率が、時空の狭間へと消え去ろうとしている。即座にリザレクションの呪文を唱えよ！`,
        `虚無への扉が、今、開かれようとしている…。その身を滅ぼす前に、己の中の光を取り戻せ！`
      ],
      normal: [
        `運命の歯車は静かに、だが確実に回っている。光と闇が均衡を保つこの瞬間、己の混沌を鎮めよ。🌑`,
        `貴様の物語はまだ中盤。ここから「英雄」になるか「屍」になるかは、日々の覚悟次第だ。`,
        `まだ混沌の中か…。貴様の可能性は閉ざされてはいないが、光へ手を伸ばす意志が足りぬようだ。`,
        `凡庸なる平穏…。だが、その静寂こそが嵐の前の静けさであることに、貴様はまだ気づいていないようだな。`,
        `中途半端な覚醒は死を招く。己の内なるパラメータを極限まで引き上げるのだ…。`,
        `光と闇の境界線上で揺れ動く魂よ…。どちらに堕ちるかは、貴様の明日への選択にかかっている。`,
        `観測者として言わせてもらおう。貴様の未来は、確定には至っていない。シュレディンガーの寿命というわけだ。`,
        `凪の海のようなステータスだな。だが、深淵に潜む魔物は、わずかな隙を狙っていることを忘れるな。`,
        `この平穏な日常こそが、最大の幻術かもしれないぞ…。真の健康を手に入れるまで、気は抜けない。`,
        `運命の天秤は、まだどちらにも傾いていない。貴様の一歩が、世界の理を書き換えるだろう。`
      ]
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

  // シミュレーション補正ロジック
  if (data.smoking === 'sometimes') { baseHealth -= 1.0; baseLife -= 1.5; }
  else if (data.smoking === 'everyday') { baseHealth -= 3.5; baseLife -= 5.0; }
  
  if (data.drinking === 'none') { baseHealth += 0.5; baseLife += 0.5; }
  else if (data.drinking === 'everyday') { baseHealth -= 1.5; baseLife -= 2.0; }
  
  if (data.sleep === 'short') { baseHealth -= 1.5; baseLife -= 1.5; }
  else if (data.sleep === 'good') { baseHealth += 0.5; baseLife += 0.5; }

  // 運動習慣の補正ロジック
  if (data.exercise === 'none') { baseHealth -= 1.0; baseLife -= 1.0; }
  else if (data.exercise === 'sometimes') { baseHealth += 0.5; baseLife += 0.5; }
  else if (data.exercise === 'everyday') { baseHealth += 1.5; baseLife += 1.5; }

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
    gender: 'male', smoking: 'none', drinking: 'none', sleep: 'normal', exercise: 'none'
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
        <h1 className="text-title">寿命判定システム</h1>
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
              <label className="label-text">運動習慣</label>
              <select value={formData.exercise} onChange={e => setFormData({...formData, exercise: e.target.value})} className="ui-select">
                <option value="none">まったくしない</option>
                <option value="sometimes">週に数回する</option>
                <option value="everyday">ほぼ毎日する</option>
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
  const [showDetails, setShowDetails] = useState(false); // アコーディオン開閉状態

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
            {channel === 'ai' ? '診断レポート' : 'キャラクターからの意見'}
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

      {/* 算出の根拠アコーディオン */}
      <div style={{ marginTop: '0.5rem' }}>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            width: '100%', padding: '1rem', backgroundColor: 'transparent',
            border: 'none', color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700,
            cursor: 'pointer', transition: 'color 0.2s'
          }}
        >
          <Info size={16} /> 
          算出の根拠（シミュレーション仕様）
          <ChevronDown size={16} style={{ transform: showDetails ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        
        {showDetails && (
          <div className="glass-card animate-reveal" style={{ padding: '1.25rem', marginTop: '0.5rem', textAlign: 'left' }}>
            <p style={{ color: '#D1D5DB', fontSize: '0.75rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              本システムの予測値は、厚生労働省の統計データ（令和元年）をベースに、入力されたライフスタイルのリスク要因を加味した独自のシミュレーション値です。
            </p>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ display: 'block', color: '#9CA3AF', fontSize: '0.625rem', fontWeight: 700, marginBottom: '0.5rem' }}>■ 基準値</span>
              <div style={{ color: '#D1D5DB', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div><span style={{color:'#38BDF8', fontWeight: 'bold'}}>男性:</span> 健康寿命 72.6歳 / 平均寿命 81.5歳</div>
                <div><span style={{color:'#F472B6', fontWeight: 'bold'}}>女性:</span> 健康寿命 75.5歳 / 平均寿命 87.6歳</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ display: 'block', color: '#9CA3AF', fontSize: '0.625rem', fontWeight: 700, marginBottom: '0.5rem' }}>■ ライフスタイル補正</span>
              <ul style={{ color: '#D1D5DB', fontSize: '0.75rem', margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <li><strong style={{color:'#F8FAFC'}}>喫煙:</strong> 最大 -5.0年のペナルティ</li>
                <li><strong style={{color:'#F8FAFC'}}>飲酒:</strong> 毎日で -2.0年 / 飲まない場合はボーナス</li>
                <li><strong style={{color:'#F8FAFC'}}>運動:</strong> まったくしない場合 -1.0年 / 習慣がある場合はボーナス</li>
                <li><strong style={{color:'#F8FAFC'}}>睡眠:</strong> 不足で -1.5年 / 十分な場合はボーナス</li>
              </ul>
            </div>
            
            <p style={{ color: '#6B7280', fontSize: '0.625rem', lineHeight: 1.5, margin: 0 }}>
              ※ 本結果は医学的な診断を提供するものではありません。健康意識を啓発するためのエンターテインメントとしてお楽しみください。
            </p>
          </div>
        )}
      </div>

      {/* 再実行 Button */}
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', paddingBottom: '2rem' }}>
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