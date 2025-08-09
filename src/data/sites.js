// Data source for recommended sites
// Screenshot service: en.w3cay.com

export const sites = [
  {
    id: 'paper-planes',
    url: 'https://paperplanes.world',
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
    url: 'https://pointerpointer.com',
    title: { en: 'Pointer Pointer', zh: '指针指针' },
    pitch: {
      en: 'It always finds a finger pointing at your cursor.',
      zh: '总能找到一根指着你鼠标的手指。'
    }
  },
  {
    id: 'cat-bounce',
    url: 'https://cat-bounce.com',
    title: { en: 'Cat Bounce', zh: '弹跳小猫' },
    pitch: { en: 'Bouncing cats. Need we say more?', zh: '弹跳的猫猫，还有什么好说的？' }
  },
  {
    id: 'theuselessweb',
    url: 'https://theuselessweb.site',
    title: { en: 'Another Useless Web', zh: '另一个无用之网' },
    pitch: { en: 'Useless, but oddly satisfying.', zh: '无用，但奇妙地令人满足。' }
  },
  {
    id: 'heeeeeeeey',
    url: 'https://heeeeeeeey.com',
    title: { en: 'Heeeeeeeey', zh: '嘿——' },
    pitch: { en: 'Say hey. That is it.', zh: '打个招呼，就这样。' }
  }
]

export function getScreenshotUrl(targetUrl) {
  const encoded = encodeURIComponent(targetUrl)
  return `https://en.w3cay.com/?url=${encoded}`
}

export function getScreenshotFallbackUrl(targetUrl) {
  const encoded = encodeURIComponent(targetUrl)
  // WordPress mShots service (returns an actual image)
  return `https://s.wordpress.com/mshots/v1/${encoded}?w=1200`
} 