import MusicCover from '@/src/components/MusicCover/MusicCover'
import { createRootPageMetadata } from '@/src/utils/pageUtils'

export const generateMetadata = createRootPageMetadata('/music-cover', 'musicCover')

export default function MusicCoverPage() {
	return <MusicCover />
}

