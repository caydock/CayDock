import SmartLink from '../Elements/SmartLink'
import { useLocale } from 'next-intl'

const SiteLogo = () => {
  const locale = useLocale();
  
  return (
    <SmartLink href="/" locale={locale} className="flex items-center text-dark dark:text-light font-bold text-xl">
      CayDock
    </SmartLink>
  )
}

export default SiteLogo