import SmartLink from '../Elements/SmartLink'
import { usePathname as useNextPathname } from 'next/navigation'

const SiteLogo = () => {
  const nextPathname = useNextPathname();
  
  // 判断是否为英文站（根目录）- 使用真实的浏览器路径
  const isEnglishSite = !nextPathname.startsWith('/zh-cn');
  const actualLocale = isEnglishSite ? 'en' : 'zh-cn';
  
  // 对于中文站点，确保跳转到 /zh-cn/，而不是根目录
  // 对于英文站点，跳转到根目录 /
  const homeHref = actualLocale === 'zh-cn' ? '/zh-cn' : '/';
  
  return (
    <SmartLink href={homeHref} locale={actualLocale} className="flex items-center text-dark dark:text-light font-bold text-xl">
      CayDock
    </SmartLink>
  )
}

export default SiteLogo