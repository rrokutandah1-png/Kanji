import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Eraser,
  GraduationCap,
  Layers3,
  Lightbulb,
  Pencil,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

type Jukugo = {
  word: string;
  reading: string;
};

type Kanji = {
  char: string;
  yomi: string;
  kunyomi: string;
  meaning: string;
  jukugo: Jukugo[];
  sentence: string;
  hint: string;
  color: string;
};

type Mode = "card" | "jukugo" | "write";
type Grade = "grade3" | "grade5";

const grade5KanjiList: Kanji[] = [
  {
    char: "圧",
    yomi: "アツ",
    kunyomi: "",
    meaning: "おさえる力",
    jukugo: [
      { word: "圧力", reading: "あつりょく" },
      { word: "気圧", reading: "きあつ" },
      { word: "水圧", reading: "すいあつ" },
      { word: "圧勝", reading: "あっしょう" },
    ],
    sentence: "台風が近づくと、気圧の変化に注目します。",
    hint: "厂の中に土を書きます。",
    color: "coral",
  },
  {
    char: "移",
    yomi: "イ",
    kunyomi: "うつる・うつす",
    meaning: "場所を変える",
    jukugo: [
      { word: "移動", reading: "いどう" },
      { word: "移住", reading: "いじゅう" },
      { word: "推移", reading: "すいい" },
      { word: "移植", reading: "いしょく" },
    ],
    sentence: "グラフを見ると、人口の推移が分かります。",
    hint: "禾へんに多を合わせます。",
    color: "mint",
  },
  {
    char: "因",
    yomi: "イン",
    kunyomi: "よる",
    meaning: "もとになる理由",
    jukugo: [
      { word: "原因", reading: "げんいん" },
      { word: "要因", reading: "よういん" },
      { word: "因果", reading: "いんが" },
      { word: "勝因", reading: "しょういん" },
    ],
    sentence: "失敗の原因を考えると、次の作戦が立てられます。",
    hint: "囲いの中に大を書きます。",
    color: "violet",
  },
  {
    char: "永",
    yomi: "エイ",
    kunyomi: "ながい",
    meaning: "いつまでも続く",
    jukugo: [
      { word: "永久", reading: "えいきゅう" },
      { word: "永遠", reading: "えいえん" },
      { word: "永住", reading: "えいじゅう" },
      { word: "永続", reading: "えいぞく" },
    ],
    sentence: "平和が永遠に続くよう願います。",
    hint: "水の流れが長くのびる形を意識します。",
    color: "sky",
  },
  {
    char: "営",
    yomi: "エイ",
    kunyomi: "いとなむ",
    meaning: "仕事や活動を行う",
    jukugo: [
      { word: "営業", reading: "えいぎょう" },
      { word: "経営", reading: "けいえい" },
      { word: "運営", reading: "うんえい" },
      { word: "営利", reading: "えいり" },
    ],
    sentence: "委員会で学級新聞の運営方法を決めました。",
    hint: "上の小さな屋根と口を二つ組み合わせます。",
    color: "lemon",
  },
  {
    char: "衛",
    yomi: "エイ",
    kunyomi: "",
    meaning: "守る",
    jukugo: [
      { word: "衛生", reading: "えいせい" },
      { word: "守衛", reading: "しゅえい" },
      { word: "防衛", reading: "ぼうえい" },
      { word: "衛星", reading: "えいせい" },
    ],
    sentence: "手洗いは衛生を守る大切な習慣です。",
    hint: "行がまえの中に、韋の形が入ります。",
    color: "leaf",
  },
  {
    char: "易",
    yomi: "エキ・イ",
    kunyomi: "やさしい",
    meaning: "やさしい、変わる",
    jukugo: [
      { word: "容易", reading: "ようい" },
      { word: "安易", reading: "あんい" },
      { word: "貿易", reading: "ぼうえき" },
      { word: "簡易", reading: "かんい" },
    ],
    sentence: "安易に答えを決めず、理由を考えます。",
    hint: "日と勿を上下に組み合わせます。",
    color: "ocean",
  },
  {
    char: "益",
    yomi: "エキ・ヤク",
    kunyomi: "",
    meaning: "ためになること",
    jukugo: [
      { word: "利益", reading: "りえき" },
      { word: "有益", reading: "ゆうえき" },
      { word: "公益", reading: "こうえき" },
      { word: "益虫", reading: "えきちゅう" },
    ],
    sentence: "読書は知識を広げる有益な時間です。",
    hint: "上の形の下に皿を書きます。",
    color: "peach",
  },
  {
    char: "液",
    yomi: "エキ",
    kunyomi: "",
    meaning: "水のように流れるもの",
    jukugo: [
      { word: "液体", reading: "えきたい" },
      { word: "血液", reading: "けつえき" },
      { word: "消毒液", reading: "しょうどくえき" },
      { word: "溶液", reading: "ようえき" },
    ],
    sentence: "理科では、液体の性質を観察しました。",
    hint: "さんずいに夜を合わせます。",
    color: "aqua",
  },
  {
    char: "演",
    yomi: "エン",
    kunyomi: "",
    meaning: "人前で行う、くわしく述べる",
    jukugo: [
      { word: "演奏", reading: "えんそう" },
      { word: "演技", reading: "えんぎ" },
      { word: "講演", reading: "こうえん" },
      { word: "出演", reading: "しゅつえん" },
    ],
    sentence: "音楽会でリコーダーを演奏しました。",
    hint: "さんずいに寅を合わせます。",
    color: "sun",
  },
  {
    char: "往",
    yomi: "オウ",
    kunyomi: "",
    meaning: "行く",
    jukugo: [
      { word: "往復", reading: "おうふく" },
      { word: "往来", reading: "おうらい" },
      { word: "往年", reading: "おうねん" },
      { word: "往診", reading: "おうしん" },
    ],
    sentence: "家から学校までの往復時間を計算しました。",
    hint: "ぎょうにんべんに主を合わせます。",
    color: "pool",
  },
  {
    char: "桜",
    yomi: "オウ",
    kunyomi: "さくら",
    meaning: "春に咲く花の木",
    jukugo: [
      { word: "桜花", reading: "おうか" },
      { word: "桜色", reading: "さくらいろ" },
      { word: "夜桜", reading: "よざくら" },
      { word: "桜並木", reading: "さくらなみき" },
    ],
    sentence: "川沿いの桜並木を家族で歩きました。",
    hint: "木へんに、上の小さな形と女を合わせます。",
    color: "berry",
  },
  {
    char: "恩",
    yomi: "オン",
    kunyomi: "",
    meaning: "受けたありがたい気持ち",
    jukugo: [
      { word: "恩人", reading: "おんじん" },
      { word: "恩返し", reading: "おんがえし" },
      { word: "恩恵", reading: "おんけい" },
      { word: "謝恩", reading: "しゃおん" },
    ],
    sentence: "助けてくれた人に恩返しをしたいです。",
    hint: "因の下に心を書きます。",
    color: "lime",
  },
  {
    char: "可",
    yomi: "カ",
    kunyomi: "",
    meaning: "できる、よい",
    jukugo: [
      { word: "可能", reading: "かのう" },
      { word: "許可", reading: "きょか" },
      { word: "可決", reading: "かけつ" },
      { word: "不可欠", reading: "ふかけつ" },
    ],
    sentence: "実験には先生の許可が必要です。",
    hint: "口と曲がった線の位置に注意します。",
    color: "orange",
  },
  {
    char: "仮",
    yomi: "カ・ケ",
    kunyomi: "かり",
    meaning: "一時的なもの",
    jukugo: [
      { word: "仮説", reading: "かせつ" },
      { word: "仮名", reading: "かな" },
      { word: "仮定", reading: "かてい" },
      { word: "仮装", reading: "かそう" },
    ],
    sentence: "理科の観察では、まず仮説を立てました。",
    hint: "にんべんに反を合わせます。",
    color: "rose",
  },
  {
    char: "価",
    yomi: "カ",
    kunyomi: "あたい",
    meaning: "ねうち",
    jukugo: [
      { word: "価格", reading: "かかく" },
      { word: "価値", reading: "かち" },
      { word: "評価", reading: "ひょうか" },
      { word: "物価", reading: "ぶっか" },
    ],
    sentence: "友だちの作品のよい所を評価しました。",
    hint: "にんべんに西を合わせます。",
    color: "melon",
  },
  {
    char: "河",
    yomi: "カ",
    kunyomi: "かわ",
    meaning: "大きな川",
    jukugo: [
      { word: "河川", reading: "かせん" },
      { word: "運河", reading: "うんが" },
      { word: "銀河", reading: "ぎんが" },
      { word: "河口", reading: "かこう" },
    ],
    sentence: "社会で、運河が町の発展に役立ったことを学びました。",
    hint: "さんずいに可を合わせます。",
    color: "grape",
  },
  {
    char: "過",
    yomi: "カ",
    kunyomi: "すぎる・あやまつ",
    meaning: "通りすぎる、やりすぎる",
    jukugo: [
      { word: "過去", reading: "かこ" },
      { word: "通過", reading: "つうか" },
      { word: "過程", reading: "かてい" },
      { word: "過失", reading: "かしつ" },
    ],
    sentence: "結果だけでなく、考えた過程も説明します。",
    hint: "しんにょうに咼を合わせます。",
    color: "forest",
  },
  {
    char: "賀",
    yomi: "ガ",
    kunyomi: "",
    meaning: "お祝いする",
    jukugo: [
      { word: "年賀", reading: "ねんが" },
      { word: "祝賀", reading: "しゅくが" },
      { word: "賀状", reading: "がじょう" },
      { word: "慶賀", reading: "けいが" },
    ],
    sentence: "新年には年賀状であいさつを伝えます。",
    hint: "加の下に貝を書きます。",
    color: "coral",
  },
  {
    char: "快",
    yomi: "カイ",
    kunyomi: "こころよい",
    meaning: "気持ちがよい",
    jukugo: [
      { word: "快晴", reading: "かいせい" },
      { word: "快適", reading: "かいてき" },
      { word: "全快", reading: "ぜんかい" },
      { word: "快速", reading: "かいそく" },
    ],
    sentence: "快晴の日は、外で体を動かすと気持ちがよいです。",
    hint: "りっしんべんに夬を合わせます。",
    color: "mint",
  },
  {
    char: "解",
    yomi: "カイ・ゲ",
    kunyomi: "とく・とける",
    meaning: "分かる、ほどく",
    jukugo: [
      { word: "解決", reading: "かいけつ" },
      { word: "理解", reading: "りかい" },
      { word: "分解", reading: "ぶんかい" },
      { word: "正解", reading: "せいかい" },
    ],
    sentence: "問題を解決するために、意見を出し合いました。",
    hint: "角、刀、牛の形が集まっています。",
    color: "violet",
  },
  {
    char: "格",
    yomi: "カク・コウ",
    kunyomi: "",
    meaning: "きまり、くらい",
    jukugo: [
      { word: "合格", reading: "ごうかく" },
      { word: "性格", reading: "せいかく" },
      { word: "価格", reading: "かかく" },
      { word: "本格的", reading: "ほんかくてき" },
    ],
    sentence: "本格的な調べ学習に取り組みました。",
    hint: "木へんに各を合わせます。",
    color: "sky",
  },
  {
    char: "確",
    yomi: "カク",
    kunyomi: "たしか",
    meaning: "まちがいがない",
    jukugo: [
      { word: "確認", reading: "かくにん" },
      { word: "確実", reading: "かくじつ" },
      { word: "正確", reading: "せいかく" },
      { word: "確信", reading: "かくしん" },
    ],
    sentence: "計算が正確かどうか、もう一度確認しました。",
    hint: "石へんに隺を合わせます。",
    color: "lemon",
  },
  {
    char: "額",
    yomi: "ガク",
    kunyomi: "ひたい",
    meaning: "金額、ひたい",
    jukugo: [
      { word: "金額", reading: "きんがく" },
      { word: "半額", reading: "はんがく" },
      { word: "総額", reading: "そうがく" },
      { word: "額面", reading: "がくめん" },
    ],
    sentence: "買い物では、合計の金額を暗算しました。",
    hint: "客に頁を合わせます。",
    color: "leaf",
  },
  {
    char: "刊",
    yomi: "カン",
    kunyomi: "",
    meaning: "本などを出す",
    jukugo: [
      { word: "刊行", reading: "かんこう" },
      { word: "週刊", reading: "しゅうかん" },
      { word: "月刊", reading: "げっかん" },
      { word: "創刊", reading: "そうかん" },
    ],
    sentence: "図書室には月刊の科学雑誌があります。",
    hint: "干にりっとうを合わせます。",
    color: "ocean",
  },
  {
    char: "幹",
    yomi: "カン",
    kunyomi: "みき",
    meaning: "中心になる部分",
    jukugo: [
      { word: "幹線", reading: "かんせん" },
      { word: "新幹線", reading: "しんかんせん" },
      { word: "幹部", reading: "かんぶ" },
      { word: "根幹", reading: "こんかん" },
    ],
    sentence: "新幹線は遠くの町まで速く移動できます。",
    hint: "左側の形と干をバランスよく書きます。",
    color: "peach",
  },
  {
    char: "慣",
    yomi: "カン",
    kunyomi: "なれる・ならす",
    meaning: "くり返して身につく",
    jukugo: [
      { word: "習慣", reading: "しゅうかん" },
      { word: "慣用句", reading: "かんようく" },
      { word: "慣例", reading: "かんれい" },
      { word: "不慣れ", reading: "ふなれ" },
    ],
    sentence: "毎日読む習慣をつけると、語彙が増えます。",
    hint: "りっしんべんに貫を合わせます。",
    color: "aqua",
  },
  {
    char: "眼",
    yomi: "ガン・ゲン",
    kunyomi: "まなこ",
    meaning: "目",
    jukugo: [
      { word: "眼科", reading: "がんか" },
      { word: "肉眼", reading: "にくがん" },
      { word: "眼球", reading: "がんきゅう" },
      { word: "着眼点", reading: "ちゃくがんてん" },
    ],
    sentence: "資料を読むときは、着眼点を決めて調べます。",
    hint: "目へんに艮を合わせます。",
    color: "sun",
  },
  {
    char: "基",
    yomi: "キ",
    kunyomi: "もと・もとい",
    meaning: "土台、もと",
    jukugo: [
      { word: "基本", reading: "きほん" },
      { word: "基準", reading: "きじゅん" },
      { word: "基地", reading: "きち" },
      { word: "基礎", reading: "きそ" },
    ],
    sentence: "漢字学習では、基本の読みを大切にします。",
    hint: "其の下に土を書きます。",
    color: "pool",
  },
  {
    char: "寄",
    yomi: "キ",
    kunyomi: "よる・よせる",
    meaning: "近づく、集める",
    jukugo: [
      { word: "寄付", reading: "きふ" },
      { word: "寄港", reading: "きこう" },
      { word: "寄席", reading: "よせ" },
      { word: "最寄り", reading: "もより" },
    ],
    sentence: "最寄りの駅まで歩いて行きました。",
    hint: "うかんむりに奇を合わせます。",
    color: "berry",
  },
  {
    char: "規",
    yomi: "キ",
    kunyomi: "",
    meaning: "きまり",
    jukugo: [
      { word: "規則", reading: "きそく" },
      { word: "規準", reading: "きじゅん" },
      { word: "規模", reading: "きぼ" },
      { word: "定規", reading: "じょうぎ" },
    ],
    sentence: "安全に生活するために規則を守ります。",
    hint: "夫に見を合わせます。",
    color: "lime",
  },
  {
    char: "技",
    yomi: "ギ",
    kunyomi: "わざ",
    meaning: "身につけたわざ",
    jukugo: [
      { word: "技術", reading: "ぎじゅつ" },
      { word: "競技", reading: "きょうぎ" },
      { word: "演技", reading: "えんぎ" },
      { word: "特技", reading: "とくぎ" },
    ],
    sentence: "友だちの特技を紹介するスピーチをしました。",
    hint: "てへんに支を合わせます。",
    color: "orange",
  },
  {
    char: "義",
    yomi: "ギ",
    kunyomi: "",
    meaning: "正しい道すじ",
    jukugo: [
      { word: "意味", reading: "いみ" },
      { word: "正義", reading: "せいぎ" },
      { word: "義務", reading: "ぎむ" },
      { word: "主義", reading: "しゅぎ" },
    ],
    sentence: "権利と義務について社会科で学びました。",
    hint: "羊の下に我を書きます。",
    color: "rose",
  },
  {
    char: "逆",
    yomi: "ギャク",
    kunyomi: "さか・さからう",
    meaning: "反対の向き",
    jukugo: [
      { word: "逆転", reading: "ぎゃくてん" },
      { word: "逆上がり", reading: "さかあがり" },
      { word: "逆流", reading: "ぎゃくりゅう" },
      { word: "逆説", reading: "ぎゃくせつ" },
    ],
    sentence: "試合の最後に逆転して勝ちました。",
    hint: "しんにょうに屰を合わせます。",
    color: "melon",
  },
  {
    char: "久",
    yomi: "キュウ・ク",
    kunyomi: "ひさしい",
    meaning: "長い時間",
    jukugo: [
      { word: "永久", reading: "えいきゅう" },
      { word: "久遠", reading: "くおん" },
      { word: "持久走", reading: "じきゅうそう" },
      { word: "耐久", reading: "たいきゅう" },
    ],
    sentence: "体育で持久走の練習をしました。",
    hint: "はらいの向きと長さに気をつけます。",
    color: "grape",
  },
  {
    char: "旧",
    yomi: "キュウ",
    kunyomi: "",
    meaning: "昔の、古い",
    jukugo: [
      { word: "旧友", reading: "きゅうゆう" },
      { word: "旧暦", reading: "きゅうれき" },
      { word: "復旧", reading: "ふっきゅう" },
      { word: "旧式", reading: "きゅうしき" },
    ],
    sentence: "災害の後、道路の復旧作業が進みました。",
    hint: "たて線と日を組み合わせます。",
    color: "forest",
  },
  {
    char: "居",
    yomi: "キョ",
    kunyomi: "いる",
    meaning: "そこにいる、住む",
    jukugo: [
      { word: "居住", reading: "きょじゅう" },
      { word: "居間", reading: "いま" },
      { word: "同居", reading: "どうきょ" },
      { word: "住居", reading: "じゅうきょ" },
    ],
    sentence: "昔の住居のつくりを資料で調べました。",
    hint: "しかばねの下に古を書きます。",
    color: "coral",
  },
  {
    char: "許",
    yomi: "キョ",
    kunyomi: "ゆるす",
    meaning: "認める、ゆるす",
    jukugo: [
      { word: "許可", reading: "きょか" },
      { word: "免許", reading: "めんきょ" },
      { word: "許容", reading: "きょよう" },
      { word: "特許", reading: "とっきょ" },
    ],
    sentence: "体育館を使うには先生の許可が必要です。",
    hint: "ごんべんに午を合わせます。",
    color: "mint",
  },
  {
    char: "境",
    yomi: "キョウ・ケイ",
    kunyomi: "さかい",
    meaning: "さかいめ",
    jukugo: [
      { word: "境界", reading: "きょうかい" },
      { word: "環境", reading: "かんきょう" },
      { word: "国境", reading: "こっきょう" },
      { word: "心境", reading: "しんきょう" },
    ],
    sentence: "身近な環境を守る活動について話し合いました。",
    hint: "土へんに竟を合わせます。",
    color: "violet",
  },
  {
    char: "均",
    yomi: "キン",
    kunyomi: "",
    meaning: "同じくらいにそろえる",
    jukugo: [
      { word: "平均", reading: "へいきん" },
      { word: "均等", reading: "きんとう" },
      { word: "均一", reading: "きんいつ" },
      { word: "不均衡", reading: "ふきんこう" },
    ],
    sentence: "テストの平均点を計算しました。",
    hint: "土へんに匀を合わせます。",
    color: "sky",
  },
  {
    char: "禁",
    yomi: "キン",
    kunyomi: "",
    meaning: "してはいけない",
    jukugo: [
      { word: "禁止", reading: "きんし" },
      { word: "禁物", reading: "きんもつ" },
      { word: "禁煙", reading: "きんえん" },
      { word: "解禁", reading: "かいきん" },
    ],
    sentence: "図書室では飲食が禁止されています。",
    hint: "林の下に示を書きます。",
    color: "lemon",
  },
];

const grade5MoreJukugoVariants: Record<string, Jukugo[]> = {
  句: [
    { word: "俳句", reading: "はいく" },
    { word: "文句", reading: "もんく" },
    { word: "句読点", reading: "くとうてん" },
  ],
  群: [
    { word: "群集", reading: "ぐんしゅう" },
    { word: "群れる", reading: "むれる" },
    { word: "群馬県", reading: "ぐんまけん" },
  ],
  経: [
    { word: "経験", reading: "けいけん" },
    { word: "経る", reading: "へる" },
    { word: "経済", reading: "けいざい" },
  ],
  潔: [
    { word: "清潔", reading: "せいけつ" },
    { word: "潔白", reading: "けっぱく" },
    { word: "潔い", reading: "いさぎよい" },
  ],
  件: [
    { word: "事件", reading: "じけん" },
    { word: "条件", reading: "じょうけん" },
    { word: "用件", reading: "ようけん" },
  ],
  険: [
    { word: "危険", reading: "きけん" },
    { word: "保険", reading: "ほけん" },
    { word: "険しい", reading: "けわしい" },
  ],
  検: [
    { word: "検査", reading: "けんさ" },
    { word: "点検", reading: "てんけん" },
    { word: "検定", reading: "けんてい" },
  ],
  限: [
    { word: "限界", reading: "げんかい" },
    { word: "期限", reading: "きげん" },
    { word: "限る", reading: "かぎる" },
  ],
  現: [
    { word: "現在", reading: "げんざい" },
    { word: "現れる", reading: "あらわれる" },
    { word: "表現", reading: "ひょうげん" },
  ],
  減: [
    { word: "減少", reading: "げんしょう" },
    { word: "減る", reading: "へる" },
    { word: "加減", reading: "かげん" },
  ],
  故: [
    { word: "事故", reading: "じこ" },
    { word: "故郷", reading: "こきょう" },
    { word: "故人", reading: "こじん" },
  ],
  個: [
    { word: "個人", reading: "こじん" },
    { word: "一個", reading: "いっこ" },
    { word: "個性", reading: "こせい" },
  ],
  護: [
    { word: "保護", reading: "ほご" },
    { word: "看護", reading: "かんご" },
    { word: "護衛", reading: "ごえい" },
  ],
  効: [
    { word: "効果", reading: "こうか" },
    { word: "有効", reading: "ゆうこう" },
    { word: "効く", reading: "きく" },
  ],
  厚: [
    { word: "厚い", reading: "あつい" },
    { word: "温厚", reading: "おんこう" },
    { word: "厚生", reading: "こうせい" },
  ],
  耕: [
    { word: "耕作", reading: "こうさく" },
    { word: "農耕", reading: "のうこう" },
    { word: "耕す", reading: "たがやす" },
  ],
  鉱: [
    { word: "鉱山", reading: "こうざん" },
    { word: "鉱物", reading: "こうぶつ" },
    { word: "鉄鉱石", reading: "てっこうせき" },
  ],
  構: [
    { word: "構成", reading: "こうせい" },
    { word: "構える", reading: "かまえる" },
    { word: "構造", reading: "こうぞう" },
  ],
  興: [
    { word: "興味", reading: "きょうみ" },
    { word: "復興", reading: "ふっこう" },
    { word: "興行", reading: "こうぎょう" },
  ],
  講: [
    { word: "講演", reading: "こうえん" },
    { word: "講堂", reading: "こうどう" },
    { word: "講師", reading: "こうし" },
  ],
  告: [
    { word: "報告", reading: "ほうこく" },
    { word: "告げる", reading: "つげる" },
    { word: "広告", reading: "こうこく" },
  ],
  混: [
    { word: "混合", reading: "こんごう" },
    { word: "混ぜる", reading: "まぜる" },
    { word: "混雑", reading: "こんざつ" },
  ],
  査: [
    { word: "調査", reading: "ちょうさ" },
    { word: "検査", reading: "けんさ" },
    { word: "査定", reading: "さてい" },
  ],
  再: [
    { word: "再会", reading: "さいかい" },
    { word: "再び", reading: "ふたたび" },
    { word: "再生", reading: "さいせい" },
  ],
  災: [
    { word: "災害", reading: "さいがい" },
    { word: "火災", reading: "かさい" },
    { word: "防災", reading: "ぼうさい" },
  ],
  妻: [
    { word: "夫妻", reading: "ふさい" },
    { word: "妻", reading: "つま" },
    { word: "妻子", reading: "さいし" },
  ],
  採: [
    { word: "採集", reading: "さいしゅう" },
    { word: "採る", reading: "とる" },
    { word: "採点", reading: "さいてん" },
  ],
  際: [
    { word: "国際", reading: "こくさい" },
    { word: "実際", reading: "じっさい" },
    { word: "交際", reading: "こうさい" },
  ],
  在: [
    { word: "存在", reading: "そんざい" },
    { word: "在る", reading: "ある" },
    { word: "現在", reading: "げんざい" },
  ],
  財: [
    { word: "財産", reading: "ざいさん" },
    { word: "文化財", reading: "ぶんかざい" },
    { word: "財布", reading: "さいふ" },
  ],
  罪: [
    { word: "犯罪", reading: "はんざい" },
    { word: "罪", reading: "つみ" },
    { word: "謝罪", reading: "しゃざい" },
  ],
  雑: [
    { word: "雑誌", reading: "ざっし" },
    { word: "雑木林", reading: "ぞうきばやし" },
    { word: "混雑", reading: "こんざつ" },
  ],
  酸: [
    { word: "酸素", reading: "さんそ" },
    { word: "酸っぱい", reading: "すっぱい" },
    { word: "二酸化炭素", reading: "にさんかたんそ" },
  ],
  賛: [
    { word: "賛成", reading: "さんせい" },
    { word: "賞賛", reading: "しょうさん" },
    { word: "協賛", reading: "きょうさん" },
  ],
  支: [
    { word: "支える", reading: "ささえる" },
    { word: "支店", reading: "してん" },
    { word: "支度", reading: "したく" },
  ],
  志: [
    { word: "志望", reading: "しぼう" },
    { word: "志", reading: "こころざし" },
    { word: "有志", reading: "ゆうし" },
  ],
  枝: [
    { word: "枝葉", reading: "えだは" },
    { word: "枝豆", reading: "えだまめ" },
    { word: "枝", reading: "えだ" },
  ],
  師: [
    { word: "教師", reading: "きょうし" },
    { word: "師走", reading: "しわす" },
    { word: "医師", reading: "いし" },
  ],
  資: [
    { word: "資料", reading: "しりょう" },
    { word: "資源", reading: "しげん" },
    { word: "資格", reading: "しかく" },
  ],
  飼: [
    { word: "飼育", reading: "しいく" },
    { word: "飼う", reading: "かう" },
    { word: "飼料", reading: "しりょう" },
  ],
  示: [
    { word: "示す", reading: "しめす" },
    { word: "表示", reading: "ひょうじ" },
    { word: "指示", reading: "しじ" },
  ],
  似: [
    { word: "似顔絵", reading: "にがおえ" },
    { word: "類似", reading: "るいじ" },
    { word: "似る", reading: "にる" },
  ],
  識: [
    { word: "知識", reading: "ちしき" },
    { word: "意識", reading: "いしき" },
    { word: "識別", reading: "しきべつ" },
  ],
  質: [
    { word: "質問", reading: "しつもん" },
    { word: "品質", reading: "ひんしつ" },
    { word: "質屋", reading: "しちや" },
  ],
  舎: [
    { word: "校舎", reading: "こうしゃ" },
    { word: "田舎", reading: "いなか" },
    { word: "宿舎", reading: "しゅくしゃ" },
  ],
  謝: [
    { word: "感謝", reading: "かんしゃ" },
    { word: "謝る", reading: "あやまる" },
    { word: "謝罪", reading: "しゃざい" },
  ],
  授: [
    { word: "授業", reading: "じゅぎょう" },
    { word: "授ける", reading: "さずける" },
    { word: "教授", reading: "きょうじゅ" },
  ],
  修: [
    { word: "修学旅行", reading: "しゅうがくりょこう" },
    { word: "修める", reading: "おさめる" },
    { word: "研修", reading: "けんしゅう" },
  ],
  述: [
    { word: "述語", reading: "じゅつご" },
    { word: "述べる", reading: "のべる" },
    { word: "記述", reading: "きじゅつ" },
  ],
  術: [
    { word: "技術", reading: "ぎじゅつ" },
    { word: "美術", reading: "びじゅつ" },
    { word: "手術", reading: "しゅじゅつ" },
  ],
  準: [
    { word: "準備", reading: "じゅんび" },
    { word: "基準", reading: "きじゅん" },
    { word: "水準", reading: "すいじゅん" },
  ],
  序: [
    { word: "順序", reading: "じゅんじょ" },
    { word: "序章", reading: "じょしょう" },
    { word: "序列", reading: "じょれつ" },
  ],
  招: [
    { word: "招待", reading: "しょうたい" },
    { word: "招く", reading: "まねく" },
    { word: "招集", reading: "しょうしゅう" },
  ],
  承: [
    { word: "承知", reading: "しょうち" },
    { word: "承る", reading: "うけたまわる" },
    { word: "了承", reading: "りょうしょう" },
  ],
  証: [
    { word: "証明", reading: "しょうめい" },
    { word: "証拠", reading: "しょうこ" },
    { word: "保証", reading: "ほしょう" },
  ],
  条: [
    { word: "条件", reading: "じょうけん" },
    { word: "条約", reading: "じょうやく" },
    { word: "一条", reading: "いちじょう" },
  ],
  状: [
    { word: "状態", reading: "じょうたい" },
    { word: "年賀状", reading: "ねんがじょう" },
    { word: "形状", reading: "けいじょう" },
  ],
  常: [
    { word: "日常", reading: "にちじょう" },
    { word: "常に", reading: "つねに" },
    { word: "非常口", reading: "ひじょうぐち" },
  ],
  情: [
    { word: "感情", reading: "かんじょう" },
    { word: "情報", reading: "じょうほう" },
    { word: "情け", reading: "なさけ" },
  ],
  織: [
    { word: "組織", reading: "そしき" },
    { word: "織物", reading: "おりもの" },
    { word: "織る", reading: "おる" },
  ],
  職: [
    { word: "職員", reading: "しょくいん" },
    { word: "職人", reading: "しょくにん" },
    { word: "就職", reading: "しゅうしょく" },
  ],
  制: [
    { word: "制度", reading: "せいど" },
    { word: "制服", reading: "せいふく" },
    { word: "制限", reading: "せいげん" },
  ],
  性: [
    { word: "性格", reading: "せいかく" },
    { word: "個性", reading: "こせい" },
    { word: "性質", reading: "せいしつ" },
  ],
  政: [
    { word: "政治", reading: "せいじ" },
    { word: "政府", reading: "せいふ" },
    { word: "行政", reading: "ぎょうせい" },
  ],
  勢: [
    { word: "勢力", reading: "せいりょく" },
    { word: "勢い", reading: "いきおい" },
    { word: "姿勢", reading: "しせい" },
  ],
  精: [
    { word: "精神", reading: "せいしん" },
    { word: "精米", reading: "せいまい" },
    { word: "精進", reading: "しょうじん" },
  ],
  製: [
    { word: "製品", reading: "せいひん" },
    { word: "木製", reading: "もくせい" },
    { word: "製作", reading: "せいさく" },
  ],
  税: [
    { word: "税金", reading: "ぜいきん" },
    { word: "消費税", reading: "しょうひぜい" },
    { word: "税務署", reading: "ぜいむしょ" },
  ],
  責: [
    { word: "責任", reading: "せきにん" },
    { word: "責める", reading: "せめる" },
    { word: "責任感", reading: "せきにんかん" },
  ],
  績: [
    { word: "成績", reading: "せいせき" },
    { word: "実績", reading: "じっせき" },
    { word: "功績", reading: "こうせき" },
  ],
  接: [
    { word: "接続", reading: "せつぞく" },
    { word: "接する", reading: "せっする" },
    { word: "面接", reading: "めんせつ" },
  ],
  設: [
    { word: "設計", reading: "せっけい" },
    { word: "設ける", reading: "もうける" },
    { word: "建設", reading: "けんせつ" },
  ],
  舌: [
    { word: "舌", reading: "した" },
    { word: "舌打ち", reading: "したうち" },
    { word: "舌戦", reading: "ぜっせん" },
  ],
  絶: [
    { word: "絶対", reading: "ぜったい" },
    { word: "絶える", reading: "たえる" },
    { word: "絶景", reading: "ぜっけい" },
  ],
  銭: [
    { word: "金銭", reading: "きんせん" },
    { word: "小銭", reading: "こぜに" },
    { word: "銭湯", reading: "せんとう" },
  ],
  祖: [
    { word: "祖父", reading: "そふ" },
    { word: "祖母", reading: "そぼ" },
    { word: "先祖", reading: "せんぞ" },
  ],
  素: [
    { word: "酸素", reading: "さんそ" },
    { word: "素直", reading: "すなお" },
    { word: "素顔", reading: "すがお" },
  ],
  総: [
    { word: "総合", reading: "そうごう" },
    { word: "総理", reading: "そうり" },
    { word: "総額", reading: "そうがく" },
  ],
  造: [
    { word: "造船", reading: "ぞうせん" },
    { word: "造る", reading: "つくる" },
    { word: "構造", reading: "こうぞう" },
  ],
  像: [
    { word: "想像", reading: "そうぞう" },
    { word: "画像", reading: "がぞう" },
    { word: "銅像", reading: "どうぞう" },
  ],
  増: [
    { word: "増加", reading: "ぞうか" },
    { word: "増える", reading: "ふえる" },
    { word: "増す", reading: "ます" },
  ],
  則: [
    { word: "規則", reading: "きそく" },
    { word: "原則", reading: "げんそく" },
    { word: "反則", reading: "はんそく" },
  ],
  測: [
    { word: "観測", reading: "かんそく" },
    { word: "測る", reading: "はかる" },
    { word: "予測", reading: "よそく" },
  ],
  属: [
    { word: "金属", reading: "きんぞく" },
    { word: "所属", reading: "しょぞく" },
    { word: "付属", reading: "ふぞく" },
  ],
  率: [
    { word: "確率", reading: "かくりつ" },
    { word: "率いる", reading: "ひきいる" },
    { word: "効率", reading: "こうりつ" },
  ],
  損: [
    { word: "損害", reading: "そんがい" },
    { word: "損する", reading: "そんする" },
    { word: "破損", reading: "はそん" },
  ],
  退: [
    { word: "退場", reading: "たいじょう" },
    { word: "退く", reading: "しりぞく" },
    { word: "早退", reading: "そうたい" },
  ],
  貸: [
    { word: "貸出", reading: "かしだし" },
    { word: "貸す", reading: "かす" },
    { word: "貸借", reading: "たいしゃく" },
  ],
  態: [
    { word: "状態", reading: "じょうたい" },
    { word: "態度", reading: "たいど" },
    { word: "実態", reading: "じったい" },
  ],
  団: [
    { word: "団体", reading: "だんたい" },
    { word: "布団", reading: "ふとん" },
    { word: "集団", reading: "しゅうだん" },
  ],
  断: [
    { word: "判断", reading: "はんだん" },
    { word: "断る", reading: "ことわる" },
    { word: "横断", reading: "おうだん" },
  ],
  築: [
    { word: "建築", reading: "けんちく" },
    { word: "築く", reading: "きずく" },
    { word: "新築", reading: "しんちく" },
  ],
  張: [
    { word: "主張", reading: "しゅちょう" },
    { word: "張る", reading: "はる" },
    { word: "出張", reading: "しゅっちょう" },
  ],
  提: [
    { word: "提案", reading: "ていあん" },
    { word: "提出", reading: "ていしゅつ" },
    { word: "提示", reading: "ていじ" },
  ],
  程: [
    { word: "程度", reading: "ていど" },
    { word: "日程", reading: "にってい" },
    { word: "工程", reading: "こうてい" },
  ],
  適: [
    { word: "適切", reading: "てきせつ" },
    { word: "適する", reading: "てきする" },
    { word: "快適", reading: "かいてき" },
  ],
  敵: [
    { word: "敵", reading: "てき" },
    { word: "強敵", reading: "きょうてき" },
    { word: "敵味方", reading: "てきみかた" },
  ],
  統: [
    { word: "統一", reading: "とういつ" },
    { word: "統計", reading: "とうけい" },
    { word: "大統領", reading: "だいとうりょう" },
  ],
  銅: [
    { word: "銅像", reading: "どうぞう" },
    { word: "青銅", reading: "せいどう" },
    { word: "銅貨", reading: "どうか" },
  ],
  導: [
    { word: "指導", reading: "しどう" },
    { word: "導く", reading: "みちびく" },
    { word: "案内誘導", reading: "あんないゆうどう" },
  ],
  徳: [
    { word: "道徳", reading: "どうとく" },
    { word: "人徳", reading: "じんとく" },
    { word: "徳川", reading: "とくがわ" },
  ],
  独: [
    { word: "独立", reading: "どくりつ" },
    { word: "独り", reading: "ひとり" },
    { word: "独特", reading: "どくとく" },
  ],
  任: [
    { word: "責任", reading: "せきにん" },
    { word: "任せる", reading: "まかせる" },
    { word: "任命", reading: "にんめい" },
  ],
  燃: [
    { word: "燃料", reading: "ねんりょう" },
    { word: "燃える", reading: "もえる" },
    { word: "燃焼", reading: "ねんしょう" },
  ],
  能: [
    { word: "能力", reading: "のうりょく" },
    { word: "可能", reading: "かのう" },
    { word: "能楽", reading: "のうがく" },
  ],
  破: [
    { word: "破る", reading: "やぶる" },
    { word: "破損", reading: "はそん" },
    { word: "突破", reading: "とっぱ" },
  ],
  犯: [
    { word: "犯罪", reading: "はんざい" },
    { word: "犯人", reading: "はんにん" },
    { word: "犯す", reading: "おかす" },
  ],
  判: [
    { word: "判断", reading: "はんだん" },
    { word: "判子", reading: "はんこ" },
    { word: "判明", reading: "はんめい" },
  ],
  版: [
    { word: "出版", reading: "しゅっぱん" },
    { word: "黒板", reading: "こくばん" },
    { word: "版画", reading: "はんが" },
  ],
  比: [
    { word: "比較", reading: "ひかく" },
    { word: "比例", reading: "ひれい" },
    { word: "比べる", reading: "くらべる" },
  ],
  肥: [
    { word: "肥料", reading: "ひりょう" },
    { word: "肥える", reading: "こえる" },
    { word: "肥満", reading: "ひまん" },
  ],
  非: [
    { word: "非常", reading: "ひじょう" },
    { word: "非行", reading: "ひこう" },
    { word: "是非", reading: "ぜひ" },
  ],
  備: [
    { word: "準備", reading: "じゅんび" },
    { word: "備える", reading: "そなえる" },
    { word: "防備", reading: "ぼうび" },
  ],
  俵: [
    { word: "米俵", reading: "こめだわら" },
    { word: "土俵", reading: "どひょう" },
    { word: "俵", reading: "たわら" },
  ],
  評: [
    { word: "評価", reading: "ひょうか" },
    { word: "評判", reading: "ひょうばん" },
    { word: "批評", reading: "ひひょう" },
  ],
  貧: [
    { word: "貧しい", reading: "まずしい" },
    { word: "貧血", reading: "ひんけつ" },
    { word: "貧富", reading: "ひんぷ" },
  ],
  布: [
    { word: "布団", reading: "ふとん" },
    { word: "布", reading: "ぬの" },
    { word: "配布", reading: "はいふ" },
  ],
  婦: [
    { word: "夫婦", reading: "ふうふ" },
    { word: "主婦", reading: "しゅふ" },
    { word: "婦人", reading: "ふじん" },
  ],
  富: [
    { word: "富士山", reading: "ふじさん" },
    { word: "豊富", reading: "ほうふ" },
    { word: "富む", reading: "とむ" },
  ],
  武: [
    { word: "武士", reading: "ぶし" },
    { word: "武道", reading: "ぶどう" },
    { word: "武器", reading: "ぶき" },
  ],
  復: [
    { word: "復習", reading: "ふくしゅう" },
    { word: "往復", reading: "おうふく" },
    { word: "回復", reading: "かいふく" },
  ],
  複: [
    { word: "複数", reading: "ふくすう" },
    { word: "複雑", reading: "ふくざつ" },
    { word: "重複", reading: "ちょうふく" },
  ],
  仏: [
    { word: "仏像", reading: "ぶつぞう" },
    { word: "仏", reading: "ほとけ" },
    { word: "大仏", reading: "だいぶつ" },
  ],
  編: [
    { word: "編集", reading: "へんしゅう" },
    { word: "編む", reading: "あむ" },
    { word: "短編集", reading: "たんぺんしゅう" },
  ],
  弁: [
    { word: "弁当", reading: "べんとう" },
    { word: "花弁", reading: "かべん" },
    { word: "弁論", reading: "べんろん" },
  ],
  保: [
    { word: "保護", reading: "ほご" },
    { word: "保つ", reading: "たもつ" },
    { word: "保健", reading: "ほけん" },
  ],
  墓: [
    { word: "墓地", reading: "ぼち" },
    { word: "墓参り", reading: "はかまいり" },
    { word: "墓石", reading: "はかいし" },
  ],
  報: [
    { word: "報告", reading: "ほうこく" },
    { word: "情報", reading: "じょうほう" },
    { word: "報いる", reading: "むくいる" },
  ],
  豊: [
    { word: "豊作", reading: "ほうさく" },
    { word: "豊か", reading: "ゆたか" },
    { word: "豊富", reading: "ほうふ" },
  ],
  防: [
    { word: "防災", reading: "ぼうさい" },
    { word: "防ぐ", reading: "ふせぐ" },
    { word: "消防", reading: "しょうぼう" },
  ],
  貿: [
    { word: "貿易", reading: "ぼうえき" },
    { word: "貿易港", reading: "ぼうえきこう" },
    { word: "貿易品", reading: "ぼうえきひん" },
  ],
  暴: [
    { word: "暴風", reading: "ぼうふう" },
    { word: "暴れる", reading: "あばれる" },
    { word: "暴力", reading: "ぼうりょく" },
  ],
  務: [
    { word: "任務", reading: "にんむ" },
    { word: "事務", reading: "じむ" },
    { word: "務める", reading: "つとめる" },
  ],
  夢: [
    { word: "夢", reading: "ゆめ" },
    { word: "悪夢", reading: "あくむ" },
    { word: "夢中", reading: "むちゅう" },
  ],
  迷: [
    { word: "迷路", reading: "めいろ" },
    { word: "迷う", reading: "まよう" },
    { word: "迷子", reading: "まいご" },
  ],
  綿: [
    { word: "木綿", reading: "もめん" },
    { word: "綿毛", reading: "わたげ" },
    { word: "綿密", reading: "めんみつ" },
  ],
  輸: [
    { word: "輸送", reading: "ゆそう" },
    { word: "輸入", reading: "ゆにゅう" },
    { word: "運輸", reading: "うんゆ" },
  ],
  余: [
    { word: "余る", reading: "あまる" },
    { word: "余分", reading: "よぶん" },
    { word: "余白", reading: "よはく" },
  ],
  預: [
    { word: "預金", reading: "よきん" },
    { word: "預ける", reading: "あずける" },
    { word: "預かる", reading: "あずかる" },
  ],
  容: [
    { word: "内容", reading: "ないよう" },
    { word: "容器", reading: "ようき" },
    { word: "容易", reading: "ようい" },
  ],
  略: [
    { word: "省略", reading: "しょうりゃく" },
    { word: "略す", reading: "りゃくす" },
    { word: "攻略", reading: "こうりゃく" },
  ],
  留: [
    { word: "留守", reading: "るす" },
    { word: "留める", reading: "とめる" },
    { word: "留学", reading: "りゅうがく" },
  ],
  領: [
    { word: "領土", reading: "りょうど" },
    { word: "大統領", reading: "だいとうりょう" },
    { word: "領収書", reading: "りょうしゅうしょ" },
  ],
  停: [
    { word: "停止", reading: "ていし" },
    { word: "停車", reading: "ていしゃ" },
    { word: "停留所", reading: "ていりゅうじょ" },
  ],
  史: [
    { word: "歴史", reading: "れきし" },
    { word: "史料", reading: "しりょう" },
    { word: "日本史", reading: "にほんし" },
  ],
  喜: [
    { word: "喜ぶ", reading: "よろこぶ" },
    { word: "喜劇", reading: "きげき" },
    { word: "歓喜", reading: "かんき" },
  ],
  囲: [
    { word: "周囲", reading: "しゅうい" },
    { word: "囲む", reading: "かこむ" },
    { word: "囲い", reading: "かこい" },
  ],
  型: [
    { word: "模型", reading: "もけい" },
    { word: "型紙", reading: "かたがみ" },
    { word: "血液型", reading: "けつえきがた" },
  ],
  堂: [
    { word: "講堂", reading: "こうどう" },
    { word: "食堂", reading: "しょくどう" },
    { word: "堂々", reading: "どうどう" },
  ],
  士: [
    { word: "武士", reading: "ぶし" },
    { word: "博士", reading: "はかせ" },
    { word: "消防士", reading: "しょうぼうし" },
  ],
  得: [
    { word: "得点", reading: "とくてん" },
    { word: "得る", reading: "える" },
    { word: "納得", reading: "なっとく" },
  ],
  応: [
    { word: "応答", reading: "おうとう" },
    { word: "応える", reading: "こたえる" },
    { word: "応用", reading: "おうよう" },
  ],
  救: [
    { word: "救急", reading: "きゅうきゅう" },
    { word: "救う", reading: "すくう" },
    { word: "救助", reading: "きゅうじょ" },
  ],
  歴: [
    { word: "歴史", reading: "れきし" },
    { word: "学歴", reading: "がくれき" },
    { word: "履歴", reading: "りれき" },
  ],
  殺: [
    { word: "殺菌", reading: "さっきん" },
    { word: "殺す", reading: "ころす" },
    { word: "相殺", reading: "そうさい" },
  ],
  毒: [
    { word: "毒薬", reading: "どくやく" },
    { word: "消毒", reading: "しょうどく" },
    { word: "毒", reading: "どく" },
  ],
  粉: [
    { word: "粉末", reading: "ふんまつ" },
    { word: "粉", reading: "こな" },
    { word: "花粉", reading: "かふん" },
  ],
  紀: [
    { word: "紀元", reading: "きげん" },
    { word: "世紀", reading: "せいき" },
    { word: "紀行", reading: "きこう" },
  ],
  脈: [
    { word: "山脈", reading: "さんみゃく" },
    { word: "脈", reading: "みゃく" },
    { word: "文脈", reading: "ぶんみゃく" },
  ],
  航: [
    { word: "航海", reading: "こうかい" },
    { word: "航空", reading: "こうくう" },
    { word: "運航", reading: "うんこう" },
  ],
  象: [
    { word: "象", reading: "ぞう" },
    { word: "気象", reading: "きしょう" },
    { word: "印象", reading: "いんしょう" },
  ],
  貯: [
    { word: "貯金", reading: "ちょきん" },
    { word: "貯水", reading: "ちょすい" },
    { word: "貯える", reading: "たくわえる" },
  ],
  費: [
    { word: "費用", reading: "ひよう" },
    { word: "消費", reading: "しょうひ" },
    { word: "学費", reading: "がくひ" },
  ],
  賞: [
    { word: "賞品", reading: "しょうひん" },
    { word: "受賞", reading: "じゅしょう" },
    { word: "賞状", reading: "しょうじょう" },
  ],
};

const grade5AllowedChars =
  "久仏仮件任似余価保修個停備像再刊判制則効務勢厚句可史告喜営因団囲圧在均型基堂報境墓増士夢妻婦容寄導居属布師常幹序弁張往得復志応快性情態慣技招授採接提損支政故救断旧易暴条枝査格桜検構武歴殺毒比永河液混減測準演潔災燃版犯状独率現留略益眼破確示祖禁移程税築粉精紀素経統絶綿総編績織罪義耕職肥能脈興舎航術衛製複規解設許証評講謝識護豊象財貧責貯貸費貿資賛賞質輸述迷逆造過適酸鉱銅防限険際雑非領額飼";

const grade5FullKanjiList: Kanji[] = [
  ...grade5KanjiList,
  ...Object.entries(grade5MoreJukugoVariants).map(([char, jukugo], extraIndex) => ({
    char,
    yomi: "熟語で確認",
    kunyomi: "",
    meaning: "小学5年生で習う漢字",
    jukugo,
    sentence: `${jukugo[0].word}の読みを声に出して覚えます。`,
    hint: "音読みと訓読みの違いに気をつけます。",
    color: [
      "coral",
      "mint",
      "violet",
      "sky",
      "lemon",
      "leaf",
      "ocean",
      "peach",
      "aqua",
      "sun",
      "pool",
      "berry",
      "lime",
      "orange",
      "rose",
      "melon",
      "grape",
      "forest",
    ][extraIndex % 18],
  })),
].filter((kanji) => grade5AllowedChars.includes(kanji.char));

const grade3KanjiList: Kanji[] = [
  {
    char: "悪",
    yomi: "アク・オ",
    kunyomi: "わるい",
    meaning: "よくないこと",
    jukugo: [
      { word: "悪口", reading: "わるぐち" },
      { word: "悪天候", reading: "あくてんこう" },
      { word: "最悪", reading: "さいあく" },
      { word: "悪者", reading: "わるもの" },
    ],
    sentence: "悪天候の日は、早めに家へ帰ります。",
    hint: "心の上に、こまかい形がのっています。",
    color: "coral",
  },
  {
    char: "安",
    yomi: "アン",
    kunyomi: "やすい",
    meaning: "おだやか、やすらか",
    jukugo: [
      { word: "安全", reading: "あんぜん" },
      { word: "安心", reading: "あんしん" },
      { word: "安売り", reading: "やすうり" },
      { word: "安定", reading: "あんてい" },
    ],
    sentence: "安全に気をつけて横断歩道をわたります。",
    hint: "屋根の下に女という字が入ります。",
    color: "mint",
  },
  {
    char: "暗",
    yomi: "アン",
    kunyomi: "くらい",
    meaning: "光が少ない",
    jukugo: [
      { word: "暗記", reading: "あんき" },
      { word: "暗号", reading: "あんごう" },
      { word: "真っ暗", reading: "まっくら" },
      { word: "暗算", reading: "あんざん" },
    ],
    sentence: "夕方になると、森の中は暗くなります。",
    hint: "日へんに、音という字を合わせます。",
    color: "violet",
  },
  {
    char: "医",
    yomi: "イ",
    kunyomi: "",
    meaning: "病気をなおすこと",
    jukugo: [
      { word: "医者", reading: "いしゃ" },
      { word: "医学", reading: "いがく" },
      { word: "医院", reading: "いいん" },
      { word: "医薬品", reading: "いやくひん" },
    ],
    sentence: "医者は、熱をはかって体の様子を見ました。",
    hint: "箱の中に矢が入っている形です。",
    color: "sky",
  },
  {
    char: "育",
    yomi: "イク",
    kunyomi: "そだつ・そだてる",
    meaning: "大きくなる",
    jukugo: [
      { word: "体育", reading: "たいいく" },
      { word: "教育", reading: "きょういく" },
      { word: "育児", reading: "いくじ" },
      { word: "発育", reading: "はついく" },
    ],
    sentence: "毎日水をやると、花が元気に育ちます。",
    hint: "上の形と月を組み合わせます。",
    color: "leaf",
  },
  {
    char: "員",
    yomi: "イン",
    kunyomi: "",
    meaning: "なかま、係の人",
    jukugo: [
      { word: "店員", reading: "てんいん" },
      { word: "全員", reading: "ぜんいん" },
      { word: "委員", reading: "いいん" },
      { word: "駅員", reading: "えきいん" },
    ],
    sentence: "全員で力を合わせてそうじをしました。",
    hint: "口の下に貝を書きます。",
    color: "ocean",
  },
  {
    char: "院",
    yomi: "イン",
    kunyomi: "",
    meaning: "建物や場所",
    jukugo: [
      { word: "病院", reading: "びょういん" },
      { word: "医院", reading: "いいん" },
      { word: "入院", reading: "にゅういん" },
      { word: "院長", reading: "いんちょう" },
    ],
    sentence: "病院で薬をもらいました。",
    hint: "こざとへんに完を合わせます。",
    color: "peach",
  },
  {
    char: "飲",
    yomi: "イン",
    kunyomi: "のむ",
    meaning: "水などをのむ",
    jukugo: [
      { word: "飲食", reading: "いんしょく" },
      { word: "飲料", reading: "いんりょう" },
      { word: "飲み水", reading: "のみみず" },
      { word: "飲酒", reading: "いんしゅ" },
    ],
    sentence: "運動の後は水を飲みます。",
    hint: "食へんに欠を合わせます。",
    color: "aqua",
  },
  {
    char: "運",
    yomi: "ウン",
    kunyomi: "はこぶ",
    meaning: "動かす、めぐり合わせ",
    jukugo: [
      { word: "運動", reading: "うんどう" },
      { word: "運転", reading: "うんてん" },
      { word: "幸運", reading: "こううん" },
      { word: "運命", reading: "うんめい" },
    ],
    sentence: "朝の運動で体がぽかぽかしました。",
    hint: "しんにょうの中に軍を書きます。",
    color: "sun",
  },
  {
    char: "泳",
    yomi: "エイ",
    kunyomi: "およぐ",
    meaning: "水の中を進む",
    jukugo: [
      { word: "水泳", reading: "すいえい" },
      { word: "遠泳", reading: "えんえい" },
      { word: "平泳ぎ", reading: "ひらおよぎ" },
      { word: "泳法", reading: "えいほう" },
    ],
    sentence: "夏休みにプールで泳ぎました。",
    hint: "さんずいに永を合わせます。",
    color: "pool",
  },
  {
    char: "駅",
    yomi: "エキ",
    kunyomi: "",
    meaning: "電車に乗り降りする場所",
    jukugo: [
      { word: "駅前", reading: "えきまえ" },
      { word: "駅長", reading: "えきちょう" },
      { word: "駅員", reading: "えきいん" },
      { word: "駅名", reading: "えきめい" },
    ],
    sentence: "駅前で友だちと待ち合わせました。",
    hint: "馬へんに尺を合わせます。",
    color: "berry",
  },
  {
    char: "央",
    yomi: "オウ",
    kunyomi: "",
    meaning: "まんなか",
    jukugo: [
      { word: "中央", reading: "ちゅうおう" },
      { word: "中央口", reading: "ちゅうおうぐち" },
      { word: "中央線", reading: "ちゅうおうせん" },
      { word: "中央部", reading: "ちゅうおうぶ" },
    ],
    sentence: "校庭の中央に大きな木があります。",
    hint: "大の上に、かぶさる形があります。",
    color: "lime",
  },
  {
    char: "横",
    yomi: "オウ",
    kunyomi: "よこ",
    meaning: "たてではない向き",
    jukugo: [
      { word: "横断", reading: "おうだん" },
      { word: "横顔", reading: "よこがお" },
      { word: "横書き", reading: "よこがき" },
      { word: "横丁", reading: "よこちょう" },
    ],
    sentence: "横断歩道を手を上げてわたります。",
    hint: "木へんに黄を合わせます。",
    color: "orange",
  },
  {
    char: "屋",
    yomi: "オク",
    kunyomi: "や",
    meaning: "建物、店",
    jukugo: [
      { word: "屋上", reading: "おくじょう" },
      { word: "本屋", reading: "ほんや" },
      { word: "部屋", reading: "へや" },
      { word: "小屋", reading: "こや" },
    ],
    sentence: "本屋で物語の本を選びました。",
    hint: "しかばねの下に至を書きます。",
    color: "rose",
  },
  {
    char: "温",
    yomi: "オン",
    kunyomi: "あたたかい",
    meaning: "あたたかさ",
    jukugo: [
      { word: "温度", reading: "おんど" },
      { word: "体温", reading: "たいおん" },
      { word: "温泉", reading: "おんせん" },
      { word: "気温", reading: "きおん" },
    ],
    sentence: "体温をはかって、体調をたしかめます。",
    hint: "さんずいに日と皿の形を合わせます。",
    color: "melon",
  },
  {
    char: "化",
    yomi: "カ・ケ",
    kunyomi: "ばける",
    meaning: "形やようすが変わる",
    jukugo: [
      { word: "文化", reading: "ぶんか" },
      { word: "化石", reading: "かせき" },
      { word: "変化", reading: "へんか" },
      { word: "理科", reading: "りか" },
    ],
    sentence: "葉の色が秋になると変化します。",
    hint: "にんべんとヒの形です。",
    color: "grape",
  },
  {
    char: "荷",
    yomi: "カ",
    kunyomi: "に",
    meaning: "持ちはこぶ物",
    jukugo: [
      { word: "荷物", reading: "にもつ" },
      { word: "出荷", reading: "しゅっか" },
      { word: "重荷", reading: "おもに" },
      { word: "入荷", reading: "にゅうか" },
    ],
    sentence: "旅行の荷物をリュックに入れました。",
    hint: "くさかんむりに何を書きます。",
    color: "forest",
  },
  {
    char: "界",
    yomi: "カイ",
    kunyomi: "",
    meaning: "さかい、広い世界",
    jukugo: [
      { word: "世界", reading: "せかい" },
      { word: "境界", reading: "きょうかい" },
      { word: "学界", reading: "がっかい" },
      { word: "界面", reading: "かいめん" },
    ],
    sentence: "世界にはいろいろな国があります。",
    hint: "田の下に介を書きます。",
    color: "sky",
  },
  {
    char: "開",
    yomi: "カイ",
    kunyomi: "ひらく・あく",
    meaning: "あける、始める",
    jukugo: [
      { word: "開会", reading: "かいかい" },
      { word: "開始", reading: "かいし" },
      { word: "開店", reading: "かいてん" },
      { word: "公開", reading: "こうかい" },
    ],
    sentence: "朝、教室の窓を開けました。",
    hint: "門がまえの中に形が入ります。",
    color: "coral",
  },
  {
    char: "階",
    yomi: "カイ",
    kunyomi: "",
    meaning: "建物の段",
    jukugo: [
      { word: "階段", reading: "かいだん" },
      { word: "二階", reading: "にかい" },
      { word: "階級", reading: "かいきゅう" },
      { word: "上階", reading: "じょうかい" },
    ],
    sentence: "三階の図書室へ行きました。",
    hint: "こざとへんに皆を合わせます。",
    color: "mint",
  },
];

const grade3MoreJukugo: Array<[string, string, string]> = [
  ["委", "委員", "いいん"],
  ["意", "意味", "いみ"],
  ["寒", "寒気", "さむけ"],
  ["感", "感想", "かんそう"],
  ["漢", "漢字", "かんじ"],
  ["館", "図書館", "としょかん"],
  ["岸", "海岸", "かいがん"],
  ["起", "起立", "きりつ"],
  ["期", "学期", "がっき"],
  ["客", "客席", "きゃくせき"],
  ["究", "研究", "けんきゅう"],
  ["急", "急行", "きゅうこう"],
  ["級", "学級", "がっきゅう"],
  ["宮", "神宮", "じんぐう"],
  ["球", "地球", "ちきゅう"],
  ["去", "去年", "きょねん"],
  ["橋", "歩道橋", "ほどうきょう"],
  ["業", "授業", "じゅぎょう"],
  ["曲", "曲線", "きょくせん"],
  ["局", "郵便局", "ゆうびんきょく"],
  ["銀", "銀行", "ぎんこう"],
  ["区", "地区", "ちく"],
  ["苦", "苦手", "にがて"],
  ["具", "道具", "どうぐ"],
  ["君", "君主", "くんしゅ"],
  ["係", "係員", "かかりいん"],
  ["軽", "軽食", "けいしょく"],
  ["血", "血液", "けつえき"],
  ["決", "決定", "けってい"],
  ["研", "研究", "けんきゅう"],
  ["県", "県庁", "けんちょう"],
  ["庫", "倉庫", "そうこ"],
  ["湖", "湖水", "こすい"],
  ["向", "方向", "ほうこう"],
  ["幸", "幸福", "こうふく"],
  ["港", "港町", "みなとまち"],
  ["号", "番号", "ばんごう"],
  ["根", "根気", "こんき"],
  ["祭", "祭日", "さいじつ"],
  ["皿", "大皿", "おおざら"],
  ["仕", "仕事", "しごと"],
  ["死", "死亡", "しぼう"],
  ["使", "使用", "しよう"],
  ["始", "開始", "かいし"],
  ["指", "指名", "しめい"],
  ["歯", "歯科", "しか"],
  ["詩", "詩人", "しじん"],
  ["次", "次回", "じかい"],
  ["事", "行事", "ぎょうじ"],
  ["持", "持参", "じさん"],
  ["式", "式典", "しきてん"],
  ["実", "実験", "じっけん"],
  ["写", "写真", "しゃしん"],
  ["者", "医者", "いしゃ"],
  ["主", "主人", "しゅじん"],
  ["守", "守備", "しゅび"],
  ["取", "取材", "しゅざい"],
  ["酒", "日本酒", "にほんしゅ"],
  ["受", "受験", "じゅけん"],
  ["州", "九州", "きゅうしゅう"],
  ["拾", "拾得", "しゅうとく"],
  ["終", "終点", "しゅうてん"],
  ["習", "習字", "しゅうじ"],
  ["集", "集合", "しゅうごう"],
  ["住", "住所", "じゅうしょ"],
  ["重", "重量", "じゅうりょう"],
  ["宿", "宿題", "しゅくだい"],
  ["所", "住所", "じゅうしょ"],
  ["暑", "暑中", "しょちゅう"],
  ["助", "助手", "じょしゅ"],
  ["昭", "昭和", "しょうわ"],
  ["消", "消火", "しょうか"],
  ["商", "商店", "しょうてん"],
  ["章", "文章", "ぶんしょう"],
  ["勝", "勝利", "しょうり"],
  ["乗", "乗車", "じょうしゃ"],
  ["植", "植物", "しょくぶつ"],
  ["申", "申告", "しんこく"],
  ["身", "身体", "しんたい"],
  ["神", "神社", "じんじゃ"],
  ["真", "写真", "しゃしん"],
  ["深", "深海", "しんかい"],
  ["進", "進行", "しんこう"],
  ["世", "世界", "せかい"],
  ["整", "整理", "せいり"],
  ["昔", "昔話", "むかしばなし"],
  ["全", "全部", "ぜんぶ"],
  ["相", "相談", "そうだん"],
  ["送", "送信", "そうしん"],
  ["想", "感想", "かんそう"],
  ["息", "休息", "きゅうそく"],
  ["速", "速度", "そくど"],
  ["族", "家族", "かぞく"],
  ["他", "他人", "たにん"],
  ["打", "打者", "だしゃ"],
  ["対", "対話", "たいわ"],
  ["待", "待合", "まちあい"],
  ["代", "代表", "だいひょう"],
  ["第", "第一", "だいいち"],
  ["題", "問題", "もんだい"],
  ["炭", "石炭", "せきたん"],
  ["短", "短歌", "たんか"],
  ["談", "相談", "そうだん"],
  ["着", "到着", "とうちゃく"],
  ["注", "注意", "ちゅうい"],
  ["柱", "電柱", "でんちゅう"],
  ["丁", "丁寧", "ていねい"],
  ["帳", "手帳", "てちょう"],
  ["調", "調査", "ちょうさ"],
  ["追", "追走", "ついそう"],
  ["定", "予定", "よてい"],
  ["庭", "校庭", "こうてい"],
  ["笛", "汽笛", "きてき"],
  ["鉄", "鉄道", "てつどう"],
  ["転", "転校", "てんこう"],
  ["都", "都道府県", "とどうふけん"],
  ["度", "温度", "おんど"],
  ["投", "投手", "とうしゅ"],
  ["豆", "大豆", "だいず"],
  ["島", "半島", "はんとう"],
  ["湯", "熱湯", "ねっとう"],
  ["登", "登校", "とうこう"],
  ["等", "平等", "びょうどう"],
  ["動", "運動", "うんどう"],
  ["童", "童話", "どうわ"],
  ["農", "農家", "のうか"],
  ["波", "電波", "でんぱ"],
  ["配", "配達", "はいたつ"],
  ["倍", "二倍", "にばい"],
  ["箱", "箱根", "はこね"],
  ["畑", "畑作", "はたさく"],
  ["発", "発表", "はっぴょう"],
  ["反", "反対", "はんたい"],
  ["坂", "坂道", "さかみち"],
  ["板", "黒板", "こくばん"],
  ["皮", "皮膚", "ひふ"],
  ["悲", "悲鳴", "ひめい"],
  ["美", "美術", "びじゅつ"],
  ["鼻", "鼻血", "はなぢ"],
  ["筆", "筆箱", "ふでばこ"],
  ["氷", "氷山", "ひょうざん"],
  ["表", "発表", "はっぴょう"],
  ["秒", "秒針", "びょうしん"],
  ["病", "病院", "びょういん"],
  ["品", "作品", "さくひん"],
  ["負", "負担", "ふたん"],
  ["部", "部屋", "へや"],
  ["服", "洋服", "ようふく"],
  ["福", "幸福", "こうふく"],
  ["物", "動物", "どうぶつ"],
  ["平", "平和", "へいわ"],
  ["返", "返事", "へんじ"],
  ["勉", "勉強", "べんきょう"],
  ["放", "放送", "ほうそう"],
  ["味", "意味", "いみ"],
  ["命", "生命", "せいめい"],
  ["面", "表面", "ひょうめん"],
  ["問", "問題", "もんだい"],
  ["役", "役目", "やくめ"],
  ["薬", "薬品", "やくひん"],
  ["由", "理由", "りゆう"],
  ["油", "石油", "せきゆ"],
  ["有", "有名", "ゆうめい"],
  ["遊", "遊園地", "ゆうえんち"],
  ["予", "予定", "よてい"],
  ["羊", "羊毛", "ようもう"],
  ["洋", "太平洋", "たいへいよう"],
  ["葉", "落葉", "らくよう"],
  ["陽", "太陽", "たいよう"],
  ["様", "様子", "ようす"],
  ["落", "落下", "らっか"],
  ["流", "流行", "りゅうこう"],
  ["旅", "旅行", "りょこう"],
  ["両", "両手", "りょうて"],
  ["緑", "緑茶", "りょくちゃ"],
  ["礼", "礼儀", "れいぎ"],
  ["列", "行列", "ぎょうれつ"],
  ["練", "練習", "れんしゅう"],
  ["路", "道路", "どうろ"],
  ["和", "平和", "へいわ"],
];

const grade3MoreJukugoVariants: Record<string, Jukugo[]> = {
  委: [
    { word: "委員", reading: "いいん" },
    { word: "委員会", reading: "いいんかい" },
    { word: "委任", reading: "いにん" },
  ],
  意: [
    { word: "意味", reading: "いみ" },
    { word: "注意", reading: "ちゅうい" },
    { word: "意見", reading: "いけん" },
    { word: "用意", reading: "ようい" },
  ],
  寒: [
    { word: "寒気", reading: "さむけ" },
    { word: "寒波", reading: "かんぱ" },
    { word: "寒中", reading: "かんちゅう" },
  ],
  感: [
    { word: "感想", reading: "かんそう" },
    { word: "感動", reading: "かんどう" },
    { word: "予感", reading: "よかん" },
  ],
  館: [
    { word: "図書館", reading: "としょかん" },
    { word: "体育館", reading: "たいいくかん" },
    { word: "映画館", reading: "えいがかん" },
  ],
  岸: [
    { word: "海岸", reading: "かいがん" },
    { word: "岸辺", reading: "きしべ" },
    { word: "対岸", reading: "たいがん" },
  ],
  起: [
    { word: "起立", reading: "きりつ" },
    { word: "早起き", reading: "はやおき" },
    { word: "起点", reading: "きてん" },
  ],
  期: [
    { word: "学期", reading: "がっき" },
    { word: "期間", reading: "きかん" },
    { word: "期待", reading: "きたい" },
  ],
  客: [
    { word: "客席", reading: "きゃくせき" },
    { word: "来客", reading: "らいきゃく" },
    { word: "乗客", reading: "じょうきゃく" },
  ],
  急: [
    { word: "急行", reading: "きゅうこう" },
    { word: "急ぐ", reading: "いそぐ" },
    { word: "急用", reading: "きゅうよう" },
  ],
  級: [
    { word: "学級", reading: "がっきゅう" },
    { word: "上級", reading: "じょうきゅう" },
    { word: "階級", reading: "かいきゅう" },
  ],
  宮: [
    { word: "神宮", reading: "じんぐう" },
    { word: "宮中", reading: "きゅうちゅう" },
    { word: "宮様", reading: "みやさま" },
  ],
  球: [
    { word: "地球", reading: "ちきゅう" },
    { word: "野球", reading: "やきゅう" },
    { word: "球技", reading: "きゅうぎ" },
  ],
  去: [
    { word: "去年", reading: "きょねん" },
    { word: "過去", reading: "かこ" },
    { word: "去る", reading: "さる" },
  ],
  橋: [
    { word: "歩道橋", reading: "ほどうきょう" },
    { word: "鉄橋", reading: "てっきょう" },
    { word: "橋", reading: "はし" },
  ],
  曲: [
    { word: "曲線", reading: "きょくせん" },
    { word: "作曲", reading: "さっきょく" },
    { word: "曲がる", reading: "まがる" },
  ],
  銀: [
    { word: "銀行", reading: "ぎんこう" },
    { word: "銀色", reading: "ぎんいろ" },
    { word: "銀河", reading: "ぎんが" },
  ],
  苦: [
    { word: "苦手", reading: "にがて" },
    { word: "苦労", reading: "くろう" },
    { word: "苦しい", reading: "くるしい" },
  ],
  具: [
    { word: "道具", reading: "どうぐ" },
    { word: "具合", reading: "ぐあい" },
    { word: "家具", reading: "かぐ" },
  ],
  君: [
    { word: "君主", reading: "くんしゅ" },
    { word: "君たち", reading: "きみたち" },
    { word: "諸君", reading: "しょくん" },
  ],
  係: [
    { word: "係員", reading: "かかりいん" },
    { word: "関係", reading: "かんけい" },
    { word: "係数", reading: "けいすう" },
  ],
  軽: [
    { word: "軽食", reading: "けいしょく" },
    { word: "手軽", reading: "てがる" },
    { word: "軽い", reading: "かるい" },
  ],
  血: [
    { word: "血液", reading: "けつえき" },
    { word: "鼻血", reading: "はなぢ" },
    { word: "血管", reading: "けっかん" },
  ],
  庫: [
    { word: "倉庫", reading: "そうこ" },
    { word: "車庫", reading: "しゃこ" },
    { word: "金庫", reading: "きんこ" },
  ],
  向: [
    { word: "方向", reading: "ほうこう" },
    { word: "向こう", reading: "むこう" },
    { word: "上向き", reading: "うわむき" },
  ],
  祭: [
    { word: "祭日", reading: "さいじつ" },
    { word: "祭り", reading: "まつり" },
    { word: "文化祭", reading: "ぶんかさい" },
  ],
  仕: [
    { word: "仕事", reading: "しごと" },
    { word: "仕上げ", reading: "しあげ" },
    { word: "仕組み", reading: "しくみ" },
  ],
  始: [
    { word: "開始", reading: "かいし" },
    { word: "始業", reading: "しぎょう" },
    { word: "始める", reading: "はじめる" },
  ],
  指: [
    { word: "指名", reading: "しめい" },
    { word: "指先", reading: "ゆびさき" },
    { word: "指導", reading: "しどう" },
  ],
  歯: [
    { word: "歯科", reading: "しか" },
    { word: "前歯", reading: "まえば" },
    { word: "歯車", reading: "はぐるま" },
  ],
  詩: [
    { word: "詩人", reading: "しじん" },
    { word: "詩集", reading: "ししゅう" },
    { word: "詩", reading: "し" },
  ],
  次: [
    { word: "次回", reading: "じかい" },
    { word: "次の日", reading: "つぎのひ" },
    { word: "目次", reading: "もくじ" },
  ],
  持: [
    { word: "持参", reading: "じさん" },
    { word: "気持ち", reading: "きもち" },
    { word: "持久走", reading: "じきゅうそう" },
  ],
  写: [
    { word: "写真", reading: "しゃしん" },
    { word: "写生", reading: "しゃせい" },
    { word: "書き写す", reading: "かきうつす" },
  ],
  者: [
    { word: "医者", reading: "いしゃ" },
    { word: "悪者", reading: "わるもの" },
    { word: "作者", reading: "さくしゃ" },
  ],
  主: [
    { word: "主人", reading: "しゅじん" },
    { word: "持ち主", reading: "もちぬし" },
    { word: "主語", reading: "しゅご" },
  ],
  守: [
    { word: "守備", reading: "しゅび" },
    { word: "留守", reading: "るす" },
    { word: "守る", reading: "まもる" },
  ],
  取: [
    { word: "取材", reading: "しゅざい" },
    { word: "取り組む", reading: "とりくむ" },
    { word: "受け取る", reading: "うけとる" },
  ],
  酒: [
    { word: "日本酒", reading: "にほんしゅ" },
    { word: "酒屋", reading: "さかや" },
    { word: "飲酒", reading: "いんしゅ" },
  ],
  受: [
    { word: "受験", reading: "じゅけん" },
    { word: "受け取る", reading: "うけとる" },
    { word: "受信", reading: "じゅしん" },
  ],
  州: [
    { word: "九州", reading: "きゅうしゅう" },
    { word: "本州", reading: "ほんしゅう" },
    { word: "州都", reading: "しゅうと" },
  ],
  拾: [
    { word: "拾得", reading: "しゅうとく" },
    { word: "拾う", reading: "ひろう" },
    { word: "拾い物", reading: "ひろいもの" },
  ],
  終: [
    { word: "終点", reading: "しゅうてん" },
    { word: "終わる", reading: "おわる" },
    { word: "終了", reading: "しゅうりょう" },
  ],
  住: [
    { word: "住所", reading: "じゅうしょ" },
    { word: "住む", reading: "すむ" },
    { word: "住民", reading: "じゅうみん" },
  ],
  重: [
    { word: "重量", reading: "じゅうりょう" },
    { word: "重い", reading: "おもい" },
    { word: "重なる", reading: "かさなる" },
  ],
  暑: [
    { word: "暑中", reading: "しょちゅう" },
    { word: "暑い", reading: "あつい" },
    { word: "残暑", reading: "ざんしょ" },
  ],
  勝: [
    { word: "勝利", reading: "しょうり" },
    { word: "勝つ", reading: "かつ" },
    { word: "決勝", reading: "けっしょう" },
  ],
  乗: [
    { word: "乗車", reading: "じょうしゃ" },
    { word: "乗り物", reading: "のりもの" },
    { word: "乗客", reading: "じょうきゃく" },
  ],
  身: [
    { word: "身体", reading: "しんたい" },
    { word: "身近", reading: "みぢか" },
    { word: "中身", reading: "なかみ" },
  ],
  深: [
    { word: "深海", reading: "しんかい" },
    { word: "深い", reading: "ふかい" },
    { word: "深夜", reading: "しんや" },
  ],
  昔: [
    { word: "昔話", reading: "むかしばなし" },
    { word: "昔日", reading: "せきじつ" },
    { word: "大昔", reading: "おおむかし" },
  ],
  全: [
    { word: "全部", reading: "ぜんぶ" },
    { word: "全く", reading: "まったく" },
    { word: "安全", reading: "あんぜん" },
  ],
  相: [
    { word: "相談", reading: "そうだん" },
    { word: "相手", reading: "あいて" },
    { word: "首相", reading: "しゅしょう" },
  ],
  息: [
    { word: "休息", reading: "きゅうそく" },
    { word: "息子", reading: "むすこ" },
    { word: "息", reading: "いき" },
  ],
  族: [
    { word: "家族", reading: "かぞく" },
    { word: "水族館", reading: "すいぞくかん" },
    { word: "民族", reading: "みんぞく" },
  ],
  他: [
    { word: "他人", reading: "たにん" },
    { word: "その他", reading: "そのた" },
    { word: "他校", reading: "たこう" },
  ],
  打: [
    { word: "打者", reading: "だしゃ" },
    { word: "打つ", reading: "うつ" },
    { word: "打楽器", reading: "だがっき" },
  ],
  待: [
    { word: "待合", reading: "まちあい" },
    { word: "期待", reading: "きたい" },
    { word: "待つ", reading: "まつ" },
  ],
  代: [
    { word: "代表", reading: "だいひょう" },
    { word: "代金", reading: "だいきん" },
    { word: "代わり", reading: "かわり" },
  ],
  題: [
    { word: "問題", reading: "もんだい" },
    { word: "宿題", reading: "しゅくだい" },
    { word: "題名", reading: "だいめい" },
  ],
  着: [
    { word: "到着", reading: "とうちゃく" },
    { word: "着物", reading: "きもの" },
    { word: "着く", reading: "つく" },
  ],
  注: [
    { word: "注意", reading: "ちゅうい" },
    { word: "注文", reading: "ちゅうもん" },
    { word: "注ぐ", reading: "そそぐ" },
  ],
  丁: [
    { word: "丁寧", reading: "ていねい" },
    { word: "一丁目", reading: "いっちょうめ" },
    { word: "包丁", reading: "ほうちょう" },
  ],
  調: [
    { word: "調査", reading: "ちょうさ" },
    { word: "調べる", reading: "しらべる" },
    { word: "体調", reading: "たいちょう" },
  ],
  定: [
    { word: "予定", reading: "よてい" },
    { word: "定める", reading: "さだめる" },
    { word: "安定", reading: "あんてい" },
  ],
  笛: [
    { word: "汽笛", reading: "きてき" },
    { word: "横笛", reading: "よこぶえ" },
    { word: "笛", reading: "ふえ" },
  ],
  転: [
    { word: "転校", reading: "てんこう" },
    { word: "転ぶ", reading: "ころぶ" },
    { word: "運転", reading: "うんてん" },
  ],
  投: [
    { word: "投手", reading: "とうしゅ" },
    { word: "投げる", reading: "なげる" },
    { word: "投稿", reading: "とうこう" },
  ],
  島: [
    { word: "半島", reading: "はんとう" },
    { word: "島国", reading: "しまぐに" },
    { word: "列島", reading: "れっとう" },
  ],
  湯: [
    { word: "熱湯", reading: "ねっとう" },
    { word: "湯気", reading: "ゆげ" },
    { word: "温湯", reading: "おんとう" },
  ],
  登: [
    { word: "登校", reading: "とうこう" },
    { word: "登る", reading: "のぼる" },
    { word: "登山", reading: "とざん" },
  ],
  等: [
    { word: "平等", reading: "びょうどう" },
    { word: "等しい", reading: "ひとしい" },
    { word: "一等", reading: "いっとう" },
  ],
  農: [
    { word: "農家", reading: "のうか" },
    { word: "農業", reading: "のうぎょう" },
    { word: "農作物", reading: "のうさくぶつ" },
  ],
  配: [
    { word: "配達", reading: "はいたつ" },
    { word: "心配", reading: "しんぱい" },
    { word: "配る", reading: "くばる" },
  ],
  倍: [
    { word: "二倍", reading: "にばい" },
    { word: "倍率", reading: "ばいりつ" },
    { word: "人一倍", reading: "ひといちばい" },
  ],
  畑: [
    { word: "畑作", reading: "はたさく" },
    { word: "畑", reading: "はたけ" },
    { word: "田畑", reading: "たはた" },
  ],
  反: [
    { word: "反対", reading: "はんたい" },
    { word: "反る", reading: "そる" },
    { word: "反省", reading: "はんせい" },
  ],
  坂: [
    { word: "坂道", reading: "さかみち" },
    { word: "急坂", reading: "きゅうはん" },
    { word: "上り坂", reading: "のぼりざか" },
  ],
  皮: [
    { word: "皮膚", reading: "ひふ" },
    { word: "毛皮", reading: "けがわ" },
    { word: "皮", reading: "かわ" },
  ],
  悲: [
    { word: "悲鳴", reading: "ひめい" },
    { word: "悲しい", reading: "かなしい" },
    { word: "悲劇", reading: "ひげき" },
  ],
  鼻: [
    { word: "鼻血", reading: "はなぢ" },
    { word: "鼻音", reading: "びおん" },
    { word: "鼻先", reading: "はなさき" },
  ],
  筆: [
    { word: "筆箱", reading: "ふでばこ" },
    { word: "毛筆", reading: "もうひつ" },
    { word: "筆者", reading: "ひっしゃ" },
  ],
  表: [
    { word: "発表", reading: "はっぴょう" },
    { word: "表す", reading: "あらわす" },
    { word: "表面", reading: "ひょうめん" },
  ],
  品: [
    { word: "作品", reading: "さくひん" },
    { word: "品物", reading: "しなもの" },
    { word: "食品", reading: "しょくひん" },
  ],
  負: [
    { word: "負担", reading: "ふたん" },
    { word: "負ける", reading: "まける" },
    { word: "勝負", reading: "しょうぶ" },
  ],
  部: [
    { word: "部屋", reading: "へや" },
    { word: "全部", reading: "ぜんぶ" },
    { word: "部分", reading: "ぶぶん" },
  ],
  服: [
    { word: "洋服", reading: "ようふく" },
    { word: "服装", reading: "ふくそう" },
    { word: "服薬", reading: "ふくやく" },
  ],
  物: [
    { word: "動物", reading: "どうぶつ" },
    { word: "物語", reading: "ものがたり" },
    { word: "荷物", reading: "にもつ" },
  ],
  返: [
    { word: "返事", reading: "へんじ" },
    { word: "返す", reading: "かえす" },
    { word: "返信", reading: "へんしん" },
  ],
  放: [
    { word: "放送", reading: "ほうそう" },
    { word: "放す", reading: "はなす" },
    { word: "開放", reading: "かいほう" },
  ],
  味: [
    { word: "意味", reading: "いみ" },
    { word: "味方", reading: "みかた" },
    { word: "調味料", reading: "ちょうみりょう" },
  ],
  面: [
    { word: "表面", reading: "ひょうめん" },
    { word: "面白い", reading: "おもしろい" },
    { word: "画面", reading: "がめん" },
  ],
  役: [
    { word: "役目", reading: "やくめ" },
    { word: "主役", reading: "しゅやく" },
    { word: "役所", reading: "やくしょ" },
  ],
  由: [
    { word: "理由", reading: "りゆう" },
    { word: "自由", reading: "じゆう" },
    { word: "由来", reading: "ゆらい" },
  ],
  油: [
    { word: "石油", reading: "せきゆ" },
    { word: "油絵", reading: "あぶらえ" },
    { word: "給油", reading: "きゅうゆ" },
  ],
  遊: [
    { word: "遊園地", reading: "ゆうえんち" },
    { word: "遊ぶ", reading: "あそぶ" },
    { word: "遊具", reading: "ゆうぐ" },
  ],
  羊: [
    { word: "羊毛", reading: "ようもう" },
    { word: "子羊", reading: "こひつじ" },
    { word: "羊", reading: "ひつじ" },
  ],
  葉: [
    { word: "落葉", reading: "らくよう" },
    { word: "言葉", reading: "ことば" },
    { word: "葉っぱ", reading: "はっぱ" },
  ],
  陽: [
    { word: "太陽", reading: "たいよう" },
    { word: "陽気", reading: "ようき" },
    { word: "夕陽", reading: "ゆうひ" },
  ],
  様: [
    { word: "様子", reading: "ようす" },
    { word: "神様", reading: "かみさま" },
    { word: "同様", reading: "どうよう" },
  ],
  落: [
    { word: "落下", reading: "らっか" },
    { word: "落ちる", reading: "おちる" },
    { word: "落語", reading: "らくご" },
  ],
  流: [
    { word: "流行", reading: "りゅうこう" },
    { word: "流れる", reading: "ながれる" },
    { word: "水流", reading: "すいりゅう" },
  ],
  緑: [
    { word: "緑茶", reading: "りょくちゃ" },
    { word: "緑色", reading: "みどりいろ" },
    { word: "新緑", reading: "しんりょく" },
  ],
  礼: [
    { word: "礼儀", reading: "れいぎ" },
    { word: "お礼", reading: "おれい" },
    { word: "礼状", reading: "れいじょう" },
  ],
  列: [
    { word: "行列", reading: "ぎょうれつ" },
    { word: "列車", reading: "れっしゃ" },
    { word: "列島", reading: "れっとう" },
  ],
};

const grade3FullKanjiList: Kanji[] = [
  ...grade3KanjiList,
  ...grade3MoreJukugo.map(([char, word, reading], extraIndex) => ({
    char,
    yomi: "熟語で確認",
    kunyomi: "",
    meaning: "小学3年生で習う漢字",
    jukugo: grade3MoreJukugoVariants[char] ?? [{ word, reading }],
    sentence: `${word}の読みを声に出して覚えます。`,
    hint: "形をよく見て、ゆっくり書きます。",
    color: [
      "coral",
      "mint",
      "violet",
      "sky",
      "lemon",
      "leaf",
      "ocean",
      "peach",
      "aqua",
      "sun",
      "pool",
      "berry",
      "lime",
      "orange",
      "rose",
      "melon",
      "grape",
      "forest",
    ][extraIndex % 18],
  })),
];

function flattenJukugo(list: Kanji[]) {
  return list.flatMap((kanji) =>
    kanji.jukugo.map((item) => ({ ...item, char: kanji.char }))
  );
}

function colorClass(color: string) {
  return `tone-${color}`;
}

function buildChoices(correctReading: string, seed: string, allJukugo: ReturnType<typeof flattenJukugo>) {
  const pool = allJukugo
    .map((item) => item.reading)
    .filter((reading, index, array) => reading !== correctReading && array.indexOf(reading) === index);
  const start = seed.charCodeAt(0) % Math.max(1, pool.length);
  const wrong = [...pool.slice(start), ...pool.slice(0, start)].slice(0, 3);
  return [correctReading, ...wrong].sort((a, b) => a.localeCompare(b, "ja"));
}

export default function App() {
  const [grade, setGrade] = useState<Grade>("grade5");
  const [mode, setMode] = useState<Mode>("card");
  const [index, setIndex] = useState(0);
  const [jukugoIndex, setJukugoIndex] = useState(0);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [answer, setAnswer] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const kanjiList = grade === "grade3" ? grade3FullKanjiList : grade5FullKanjiList;
  const gradeLabel = grade === "grade3" ? "小学3年生" : "小学5年生";
  const appTitle = grade === "grade3" ? "漢字カラフルラボ" : "熟語読みマスター";
  const flatJukugo = useMemo(() => flattenJukugo(kanjiList), [kanjiList]);
  const current = kanjiList[index];
  const currentJukugo = flatJukugo[jukugoIndex % flatJukugo.length];
  const choices = useMemo(
    () => buildChoices(currentJukugo.reading, currentJukugo.word, flatJukugo),
    [currentJukugo.reading, currentJukugo.word, flatJukugo]
  );
  const progress = Math.round((known.size / flatJukugo.length) * 100);

  const goNextKanji = () => {
    setIndex((value) => (value + 1) % kanjiList.length);
    setAnswer(null);
  };

  const goNextJukugo = () => {
    setJukugoIndex((value) => (value + 1) % flatJukugo.length);
    setAnswer(null);
  };

  const selectAnswer = (choice: string) => {
    setAnswer(choice);
    if (choice === currentJukugo.reading) {
      setKnown((value) => new Set(value).add(currentJukugo.word));
      setStreak((value) => value + 1);
    } else {
      setStreak(0);
    }
  };

  const reset = () => {
    setKnown(new Set());
    setRevealed(new Set());
    setAnswer(null);
    setStreak(0);
    setIndex(0);
    setJukugoIndex(0);
  };

  const switchGrade = (nextGrade: Grade) => {
    setGrade(nextGrade);
    setIndex(0);
    setJukugoIndex(0);
    setKnown(new Set());
    setRevealed(new Set());
    setAnswer(null);
    setStreak(0);
    setMode("card");
  };

  return (
    <main className="app-shell">
      <section className="topbar" aria-label="学習状況">
        <div className="brand">
          <span className="brand-mark">
            <GraduationCap aria-hidden="true" />
          </span>
          <div>
            <p>{gradeLabel}</p>
            <h1>{appTitle}</h1>
          </div>
        </div>

        <div className="score-strip">
          <div>
            <Star aria-hidden="true" />
            <span>{known.size}</span>
            <small>読めた熟語</small>
          </div>
          <div>
            <Trophy aria-hidden="true" />
            <span>{streak}</span>
            <small>れんぞく</small>
          </div>
          <button type="button" onClick={reset} aria-label="リセット">
            <RotateCcw aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="grade-switcher" aria-label="学年切り替え">
        <button type="button" className={grade === "grade3" ? "active" : ""} onClick={() => switchGrade("grade3")}>
          小3版
          <span>{grade3FullKanjiList.length}漢字・{flattenJukugo(grade3FullKanjiList).length}熟語</span>
        </button>
        <button type="button" className={grade === "grade5" ? "active" : ""} onClick={() => switchGrade("grade5")}>
          小5版
          <span>{grade5FullKanjiList.length}漢字・{flattenJukugo(grade5FullKanjiList).length}熟語</span>
        </button>
      </section>

      <section className="progress-band" aria-label="進み具合">
        <div className="progress-copy">
          <Sparkles aria-hidden="true" />
          <span>熟語読みミッション</span>
          <strong>{progress}%</strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

      <nav className="mode-tabs" aria-label="学習モード">
        <button type="button" className={mode === "card" ? "active" : ""} onClick={() => setMode("card")}>
          <BookOpen aria-hidden="true" />
          漢字
        </button>
        <button type="button" className={mode === "jukugo" ? "active" : ""} onClick={() => setMode("jukugo")}>
          <Layers3 aria-hidden="true" />
          熟語
        </button>
        <button type="button" className={mode === "write" ? "active" : ""} onClick={() => setMode("write")}>
          <Pencil aria-hidden="true" />
          書く
        </button>
      </nav>

      <div className="main-grid">
        <section className={`kanji-stage ${colorClass(current.color)}`}>
          <div className="card-count">
            {index + 1} / {kanjiList.length}
          </div>
          <div className="kanji-orb" aria-label={`漢字 ${current.char}`}>
            {current.char}
          </div>
          <div className="kanji-meta">
            <span>音読み {current.yomi}</span>
            <span>訓読み {current.kunyomi || "なし"}</span>
          </div>
          <button type="button" className="next-button" onClick={goNextKanji}>
            つぎの漢字
            <ChevronRight aria-hidden="true" />
          </button>
        </section>

        <section className="work-panel">
          {mode === "card" && (
            <div className="lesson-view">
              <div className="kanji-summary">
                <span>意味</span>
                <strong>{current.meaning}</strong>
              </div>
              <div className="jukugo-list">
                {current.jukugo.map((item) => (
                  <button
                    type="button"
                    key={item.word}
                    className={known.has(item.word) ? "known" : ""}
                    onClick={() => {
                      setRevealed((value) => new Set(value).add(item.word));
                      setKnown((value) => new Set(value).add(item.word));
                    }}
                  >
                    <span>{item.word}</span>
                    {revealed.has(item.word) || known.has(item.word) ? (
                      <strong>{item.reading}</strong>
                    ) : (
                      <strong className="reading-hidden">タップで読み</strong>
                    )}
                  </button>
                ))}
              </div>
              <div className="sentence-box">
                <p>{current.sentence}</p>
              </div>
            </div>
          )}

          {mode === "jukugo" && (
            <div className="quiz-view">
              <div className="quiz-progress">
                {jukugoIndex + 1} / {flatJukugo.length}
              </div>
              <div className="jukugo-card">
                <span>この熟語の読みは？</span>
                <strong>{currentJukugo.word}</strong>
              </div>
              <div className="choices">
                {choices.map((choice) => {
                  const selected = answer === choice;
                  const correct = choice === currentJukugo.reading;
                  return (
                    <button
                      type="button"
                      key={choice}
                      className={[
                        selected ? "selected" : "",
                        answer && correct ? "correct" : "",
                        selected && !correct ? "wrong" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => selectAnswer(choice)}
                    >
                      {answer && correct ? <CheckCircle2 aria-hidden="true" /> : null}
                      {selected && !correct ? <XCircle aria-hidden="true" /> : null}
                      {choice}
                    </button>
                  );
                })}
              </div>
              <div className="feedback" aria-live="polite">
                {answer ? (
                  answer === currentJukugo.reading ? (
                    <strong>正解！ 読み名人に近づいた！</strong>
                  ) : (
                    <span>正解は「{currentJukugo.reading}」だよ。</span>
                  )
                ) : (
                  <span>読み方をえらんでね。</span>
                )}
              </div>
              <button type="button" className="next-button wide" onClick={goNextJukugo}>
                つぎの熟語
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          )}

          {mode === "write" && (
            <div className="write-view">
              <div className="grid-paper" aria-label="なぞり書き練習マス">
                <span>{current.char}</span>
              </div>
              <div className="hint-box">
                <Lightbulb aria-hidden="true" />
                <p>{current.hint}</p>
              </div>
              <button type="button" className="erase-button">
                <Eraser aria-hidden="true" />
                もう一回なぞる
              </button>
            </div>
          )}
        </section>
      </div>

      <section className="kanji-dock" aria-label="漢字一覧">
        {kanjiList.map((item, itemIndex) => (
          <button
            type="button"
            key={item.char}
            className={itemIndex === index ? "active" : ""}
            onClick={() => {
              setIndex(itemIndex);
              setAnswer(null);
            }}
            aria-label={`${item.char}を学習する`}
          >
            {item.char}
          </button>
        ))}
      </section>
    </main>
  );
}
