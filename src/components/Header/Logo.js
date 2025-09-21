import Image from "next/image"
import Link from "next/link"
import logo from "@/public/logo.png"
import { useLanguage } from "@/src/components/i18n/LanguageProvider"

const Logo = () => {
  const { language } = useLanguage();
  const isZh = language?.startsWith('zh');
  
  return (
    <Link href={isZh ? "/zh-cn" : "/"} className="flex items-center justify-center text-dark dark:text-light mr-5">
        <div className=" w-[40px] md:w-[40px] rounded-full overflow-hidden dark:border-gray">
            <Image src={logo} alt="w3cay logo" className="w-full h-auto rounded-full" sizes="20vw" priority />
        </div>
    </Link>
  )
}

export default Logo