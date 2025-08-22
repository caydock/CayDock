import Image from "next/image"
import Link from "next/link"
import siteLogoBlack from "@/public/site-logo.webp"
import siteLogoWhite from "@/public/site-logo-white.webp"

const SiteLogo = ({ sizeClass = "w-40 md:w-32" }) => {
  return (
    <Link href="/" className="flex items-center justify-center text-dark dark:text-light">
      <div className={`${sizeClass} rounded-full overflow-hidden dark:border-gray`}>
        <Image
          src={siteLogoBlack}
          alt="w3cay logo"
          className="w-full h-auto rounded-full dark:hidden"
          sizes="20vw"
          priority
        />
        <Image
          src={siteLogoWhite}
          alt="w3cay logo"
          className="hidden w-full h-auto rounded-full dark:block"
          sizes="20vw"
          priority
        />
      </div>
    </Link>
  )
}

export default SiteLogo