/* ============================================================
   作品数据文件
   ------------------------------------------------------------
   修改这里即可更新整个网页,无需动其他代码。
   视频文件放入 videos/ 文件夹,文件名与 video 路径保持一致。
   数组顺序 = 页面展示顺序(按学习时间从第一首到最新作)。

   字段说明(全部可选:删掉或留空哪个字段,页面就不显示哪一项):
   song.title    曲名
   song.artist   原唱
   song.genre    风格
   song.bpm      速度 BPM
   song.key      调性
   song.duration 时长
   song.tracks   音轨数
   song.tools    制作工具
   song.date     制作时间
   notes         扒带手记,每个元素一段
   stage         成长阶段标签(第一首/最新作)
   growth        这一首当时学到什么(一句话)
   layout        章节布局(a/b/c/d/e 五选一,不能重复)
   ============================================================ */

const TRACKS = [
  {
    id: "shajin",
    char: "砂金",
    path: "存护",
    element: "虚数",
    accent: "#46c894",
    stage: "第一首",
    growth: "第一次听清铜管",
    layout: "a",
    quote: "「所有,或者一无所有。」",
    song: {
      title: "金手指",
      artist: "文驰",
      duration: "2:05",
      tools: "Cubase",
      date: "2026"
    },
    video: "videos/01-shajin.mp4",
    poster: "assets/characters/web/shajin-landscape.jpg",
    notes: [
      "这是我自学以来扒带的第一首，以铜管和打击乐为主，我也是了解到了铜管乐的很多表现技法，在我音乐表演的学习中还真的是从未接触过"
    ]
  },
  {
    id: "yaoguang",
    char: "爻光",
    path: "欢愉",
    element: "物理",
    accent: "#2fb8a0",
    stage: "第二首",
    growth: "在合成器里翻出古筝",
    layout: "c",
    quote: "「执此一签，关照诸天」",
    song: {
      title: "万事如意",
      artist: "张迦南",
      duration: "1:44",
      tools: "Cubase",
      date: "2026"
    },
    video: "videos/03-yaoguang.mp4",
    poster: "assets/characters/web/yaoguang-landscape.jpg",
    notes: [
      "这首是最能体现创造力的一集，学习初期我的音源库是cubase自带的音源，大多是合成器这样的缺乏中国乐器的位置，我在这茫茫音源之中挑选调试调出各种类似中国民乐的音色，比如其中有古筝的的音色就是我利用合成器加delay调出来的"
    ]
  },
  {
    id: "xilian",
    char: "昔涟",
    path: "记忆",
    element: "冰",
    accent: "#f0a8c8",
    stage: "第三首",
    growth: "利用合成器音色",
    layout: "d",
    quote: "「明天见」",
    song: {
      title: "再度与你",
      artist: "王可鑫/林一凡",
      duration: "3:24",
      tools: "Cubase",
      date: "2026"
    },
    video: "videos/04-xilian.mp4",
    poster: "assets/characters/web/xilian-landscape.jpg",
    notes: [
      "这首的钢琴肢体很多算是我比较熟悉的，更多的是合成器的选择，原曲很多合成器的声音我猜是融入了人声，不过我算尽量复刻了，合成器就铺了19轨"
    ]
  },
  {
    id: "changyeyue",
    char: "长夜月",
    path: "记忆",
    element: "冰",
    accent: "#e04a4a",
    stage: "第四首",
    growth: "从堆音色,到用插件",
    layout: "b",
    quote: "「晚安,全世界无眠。」",
    song: {
      title: "天黑请闭眼",
      artist: "王可鑫",
      duration: "2:14",
      tools: "Cubase",
      date: "2026"
    },
    video: "videos/02-changyeyue.mp4",
    poster: "assets/characters/web/changyeyue-landscape.jpg",
    notes: [
      "这首开始了解各类插件，扒带中不单单只用堆音色的方式还原，学习利用各种插件还原想要的效果"
    ]
  },
  {
    id: "xilang",
    char: "砂金·戏浪",
    path: "欢愉",
    element: "量子",
    accent: "#4fabe0",
    stage: "最新作",
    growth: "第一次动混音",
    layout: "e",
    quote: "「All in！敬炽烈一夏」",
    song: {
      title: "独家爆料",
      artist: "HoYo-Mix",
      duration: "1:47",
      tools: "Cubase",
      date: "2026"
    },
    video: "videos/05-xilang.mp4",
    poster: "assets/characters/web/xilang-landscape.jpg",
    notes: [
      "这首我主要学习了音频轨道的内容。鼓组我是用音频击点标记写的，跟着击点去标旋律的重音，比手打准很多。中间有段快速变奏，全是十六分和三十二分音符，单听根本抓不住，拆成轨道才看清走向。整首堆叠了许多音乐轨道，扒完之后我还混音了一点，丰满了听感。"
    ]
  }
];
