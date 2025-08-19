// Data source for recommended sites
// Screenshot service: en.w3cay.com

export const sites = [
  {
    id: 'paper-planes',
    url: 'https://paperplanes.world',
    abbrlink: '824079b14',
    title: {
      en: 'Paper Planes',
      zh: '纸飞机'
    },
    pitch: {
      en: 'Catch and throw virtual paper planes from around the world.',
      zh: '在世界地图上捡起并投掷虚拟纸飞机。'
    }
  },
  {
    id: 'pointer-pointer',
    abbrlink: '824079b13',
    url: 'https://pointerpointer.com',
    title: { en: 'Pointer Pointer', zh: '指针指针' },
    pitch: {
      en: 'It always finds a finger pointing at your cursor.',
      zh: '总能找到一根指着你鼠标的手指。'
    }
  },
  {
    id: 'cat-bounce',
    abbrlink: '824079b12',
    url: 'https://cat-bounce.com',
    title: { en: 'Cat Bounce', zh: '弹跳小猫' },
    pitch: { en: 'Bouncing cats. Need we say more?', zh: '弹跳的猫猫，还有什么好说的？' }
  },
  {
    id: 'theuselessweb',  
    abbrlink: '824079b11',
    url: 'https://theuselessweb.site',
    title: { en: 'Another Useless Web', zh: '另一个无用之网' },
    pitch: { en: 'Useless, but oddly satisfying.', zh: '无用，但奇妙地令人满足。' }
  },
  {
    id: 'heeeeeeeey',
    abbrlink: '824079b10',
    url: 'https://heeeeeeeey.com',
    title: { en: 'Heeeeeeeey', zh: '嘿——' },
    pitch: { en: 'Say hey. That is it.', zh: '打个招呼，就这样。' }
  },
  {
    id: 'figure-game',
    abbrlink: '824079b',
    url: 'https://figure.game',
    title: { en: 'Figure Game', zh: '消除挑战' },
    pitch: {
      en: 'Figure Game is a game website that is playable in the browser.',
      zh: '挑战小游戏，要求在9步之内，消除所有方块'
    }
  },
  {
    id: 'spaceis-cool',
    abbrlink: '824079b9',
    url: 'http://spaceis.cool',
    title: { en: 'Spaceis Cool', zh: 'Emoji太阳系' },
    pitch: {
      en: 'Spaceis Cool is a map/astronomy website that offers interactive visuals and data.',
      zh: '用 emoji 演绎太阳、地球与月球的奇妙运动'
    }
  },
  {
    id: '996-icu',
    abbrlink: '824079b8',
    url: 'https://996.icu',
    title: { en: '996 Icu', zh: '996.ICU' },
    pitch: {
      en: '996 Icu is a website website that offers an interesting online experience.',
      zh: '996.ICU是一个致力于抵制996工作制的网站，关注程序员的工作权益。'
    }
  },
  {
    id: 'kiomet-com',
    abbrlink: '824079b7',
    url: 'https://kiomet.com',
    title: { en: 'Kiomet Com', zh: 'Kiomet' },
    pitch: {
      en: 'Kiomet Com is a website website that offers an interesting online experience.',
      zh: 'Kiomet是一个多人实时战略游戏，玩家可以在网页浏览器中免费在线游玩，无需安装。'
    }
  },
  {
    id: 'missile-game-bwhmather-com',
    abbrlink: '824079b6',
    url: 'https://missile-game.bwhmather.com',
    title: { en: 'Missile Game Bwhmather Com', zh: '躲避小游戏' },
    pitch: {
      en: 'Missile Game Bwhmather Com is a game website that is playable in the browser.',
      zh: 'Missile Game是一个用SVG和JavaScript制作的3D躲避游戏'
    }
  },
  {
    id: 'tank-war-top',
    abbrlink: '824079b5',
    url: 'http://tank-war.top',
    title: { en: 'Tank War Top', zh: '坦克大战' },
    pitch: {
      en: 'Tank War Top is a website website that offers an interesting online experience.',
      zh: '坦克大战简易版，让您重温经典游戏，挑战自己的操作技巧。'
    }
  },
  {
    id: 'doge2048-com',
    abbrlink: '824079b4',
    url: 'https://doge2048.com',
    title: { en: 'Doge2048 Com', zh: '狗头 2048' },
    pitch: {
      en: 'Doge2048 Com is a website website that offers an interesting online experience.',
      zh: '2048游戏的狗头版本'
    }
  },
  {
    id: 'richup-io',
    abbrlink: '824079b3',
    url: 'https://richup.io',
    title: { en: 'Richup Io', zh: '在线大富翁游戏' },
    pitch: {
      en: 'Richup Io is a game website that is playable in the browser.',
      zh: '一个免费在线替代地产大亨的游戏。与朋友、陌生人或机器人一起玩。无需注册或下载！'
    }
  },
  {
    id: 'www-worldlicenseplates-com',
    abbrlink: '824079b2',
    url: 'http://www.worldlicenseplates.com',
    title: { en: 'Www Worldlicenseplates Com', zh: '世界车牌大全' },
    pitch: {
      en: 'Www Worldlicenseplates Com is a website website that offers an interesting online experience.',
      zh: '一个收集全球车牌信息的网站，让您可以了解各国的车牌设计、含义以及历史。'
    }
  },
  {
    id: 'mecabricks-com',
    abbrlink: '824079b1',
    url: 'https://mecabricks.com',
    title: { en: 'Mecabricks Com', zh: '在线玩乐高积木' },
    pitch: {
      en: 'Mecabricks Com is a website website that offers an interesting online experience.',
      zh: '一个专业的在线乐高积木模型设计和分享平台'
    }
  },
]

export function getScreenshotUrl(targetUrl) {
  const encoded = encodeURIComponent(targetUrl)
  return `https://en.w3cay.com/?url=${encoded}`
}

export function getScreenshotFallbackUrl(targetUrl) {
  const encoded = encodeURIComponent(targetUrl)
  // Disabled: WordPress mShots service is not available
  return ''
} 