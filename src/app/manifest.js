import siteMetadata from '@/src/utils/siteMetaData'

export default function manifest() {
  const name = 'CayDock'
  const shortName = 'CayDock'
  const description = siteMetadata.description || 'Personal Blog & Project Showcase'
  const themeColor = '#111111'
  const backgroundColor = '#ffffff'
  return {
    name,
    short_name: shortName,
    description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    theme_color: themeColor,
    background_color: backgroundColor,
    icons: [
      { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { src: '/logo.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}