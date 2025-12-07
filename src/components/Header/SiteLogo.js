import SmartLink from '../Elements/SmartLink'
import { usePathname as useNextPathname } from 'next/navigation'

const SiteLogo = () => {
  const nextPathname = useNextPathname();
  
  // 判断是否为英文站（根目录）- 使用真实的浏览器路径
  const isEnglishSite = !nextPathname.startsWith('/zh-cn');
  const actualLocale = isEnglishSite ? 'en' : 'zh-cn';
  
  // 始终使用根路径 "/"，让 SmartLink 根据 locale 自动处理语言前缀
  // SmartLink 会根据 locale 自动添加语言前缀（对于 zh-cn）或不添加（对于 en）
  return (
    <SmartLink href="/" locale={actualLocale} className="flex items-center text-dark dark:text-light font-bold text-xl">
      CayDock
    </SmartLink>
  )
}

export default SiteLogo