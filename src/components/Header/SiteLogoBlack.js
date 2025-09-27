import Image from "next/image"
import SmartLink from '../Elements/SmartLink'
import logoImg from "@/public/site-logo-white.webp"

const SiteLogo = ({ sizeClass = "w-40 md:w-32", locale }) => {
  return (
    <SmartLink href="/" locale={locale} className="flex items-center justify-center text-dark dark:text-light">
      <div className={`${sizeClass} rounded-full overflow-hidden dark:border-gray`}>
        <Image
          src={logoImg}
          alt="w3cay logo"
          className="w-full h-auto rounded-full"
          sizes="30vw"
          priority
        />
      </div>
    </SmartLink>
  )
}

export default SiteLogo