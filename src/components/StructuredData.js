import siteMetadata from '@/src/utils/siteMetaData'

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "W3Cay",
    "alternateName": "World's Weird Websites Cay",
    "url": siteMetadata.siteUrl,
    "description": siteMetadata.description,
    "author": {
      "@type": "Person",
      "name": siteMetadata.author,
      "email": siteMetadata.email
    },
    "publisher": {
      "@type": "Organization",
      "name": "W3Cay",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteMetadata.siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": ["en", "zh-CN"],
    "sameAs": [
      "https://twitter.com/caydock"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
