import Image from "next/image"
import Link from "next/link"
import profileImg from "@/public/site-logo.webp"

const SiteLogo = ({ sizeClass = "w-40 md:w-32" }) => {
  return (
    <Link href="/" className="flex items-center justify-center text-dark dark:text-light">
      <div className={`${sizeClass} rounded-full overflow-hidden dark:border-gray`}>
        <Image
          src={profileImg}
          alt="w3cay logo"
          className="w-full h-auto rounded-full"
          sizes="20vw"
          priority
        />
      </div>
    </Link>
  )
}

export default SiteLogo