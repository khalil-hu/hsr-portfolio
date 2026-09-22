/* ============================================================
   作品数据文件
   ------------------------------------------------------------
   修改这里即可更新整个网页,无需动其他代码。
   视频文件放入 videos/ 文件夹,文件名与 video 路径保持一致。

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
   ============================================================ */

const TRACKS = [
  {
    id: "shajin",
    char: "砂金",
    path: "存护",
    element: "虚数",
    accent: "#46c894",
    quote: "「所有,或者一无所有。」",
    song: {
      title: "金手指",
      artist: "文驰",
      duration: "2:05",
      tools: "Cubase",
      date: "2026"
    },
    video: "videos/01-shajin.mp4",
    poster: "assets/characters/web/shajin-landscape.png",
    notes: [
      "这是我自学以来扒带的第一首，以铜管和打击乐为主，我也是了解到了铜管乐的很多表现技法，在我音乐表演的学习中还真的是从未接触过"
    ]
  },
  {
    id: "changyeyue",
    char: "长夜月",
    path: "记忆",
    element: "冰",
    accent: "#e04a4a",
    quote: "「晚安,全世界无眠。」",
    song: {
      title: "天黑请闭眼",
      artist: "王可鑫",
      duration: "2:14",
      tools: "Cubase",
      date: "2026"
    },
    video: "videos/02-changyeyue.mp4",
    poster: "assets/characters/web/changyeyue-landscape.png",
    notes: [
      "这首开始了解各类插件，扒带中不单单只用堆音色的方式还原，学习利用各种插件还原想要的效果"
    ]
  },
  {
    id: "yaoguang",
    char: "爻光",
    path: "欢愉",
    element: "物理",
    accent: "#2fb8a0",
    quote: "「执此一签，关照诸天」",
    song: {
      title: "万事如意",
      artist: "张迦南",
      duration: "1:44",
      tools: "Cubase",
      date: "2026"
    },
    video: "videos/03-yaoguang.mp4",
    poster: "assets/characters/web/yaoguang-landscape.png",
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
    quote: "「明天见」",
    song: {
      title: "再度与你",
      artist: "王可鑫/林一凡",
      duration: "3:24",
      tools: "Cubase",
      date: "2026"
    },
    video: "videos/04-xilian.mp4",
    poster: "assets/characters/web/xilian-landscape.png",
    notes: [
      "这首的钢琴肢体很多算是我比较熟悉的，更多的是合成器的选择，原曲很多合成器的声音我猜是融入了人声，不过我算尽量复刻了，合成器就铺了19轨"
    ]
  },
  {
    id: "xilang",
    char: "砂金·戏浪",
    path: "欢愉",
    element: "量子",
    accent: "#4fabe0",
    quote: "「All in！敬炽烈一夏」",
    song: {
      title: "曲名待填",
      artist: "原唱待填",
      duration: "1:47",
      tools: "Cubase",
      date: "2026"
    },
    video: "videos/05-xilang.mp4",
    poster: "assets/characters/web/xilang-landscape.png",
    notes: [
      "扒带手记待填写。可以写这首歌的难点:比如某个离调和弦花了多久听出来。",
      "也可以写音色还原思路、律动拆解方法、混音上的处理。"
    ]
  }
];
