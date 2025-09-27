import Image from "next/image"
import { Link } from '@/src/i18n/routing'
import logo from "@/public/logo.png"
import { useLocale } from 'next-intl'

const Logo = () => {
  const locale = useLocale();
  const isZh = locale === 'zh-cn';
  
  return (
    <Link href="/" locale={locale} className="flex items-center justify-center text-dark dark:text-light mr-5">
        <div className=" w-[40px] md:w-[40px] rounded-full overflow-hidden dark:border-gray">
            <Image src={logo} alt="w3cay logo" className="w-full h-auto rounded-full" sizes="20vw" priority />
        </div>
    </Link>
  )
}

export default Logo