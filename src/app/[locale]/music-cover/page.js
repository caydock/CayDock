import MusicCover from '@/src/components/MusicCover/MusicCover'
import { createLocalePageMetadata } from '@/src/utils/pageUtils'
import { notFound } from 'next/navigation'
import { routing } from '@/src/i18n/routing'

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export const generateMetadata = createLocalePageMetadata('/music-cover', 'musicCover')

export default async function MusicCoverPage({ params }) {
	const { locale } = await params
	
	if (!routing.locales.includes(locale)) {
		notFound()
	}
	
	return <MusicCover />
}

