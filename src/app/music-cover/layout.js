import { getTranslations } from 'next-intl/server'
import { routing } from '@/src/i18n/routing'

export async function generateMetadata() {
	const t = await getTranslations({ locale: routing.defaultLocale, namespace: 'musicCover' })
	
	return {
		title: t('metaTitle'),
		description: t('metaDescription'),
		keywords: t('metaKeywords'),
		openGraph: {
			title: t('metaTitle'),
			description: t('metaDescription'),
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: t('metaTitle'),
			description: t('metaDescription'),
		},
	}
}

export default function MusicCoverLayout({ children }) {
	return <>{children}</>
}

