import Image from "next/image"
import Link from "next/link"
import logo from "@/public/logo.png"

const Logo = () => {
  return (
    <Link href="/" className="flex items-center justify-center text-dark dark:text-light mr-5">
        <div className=" w-[40px] md:w-[40px] rounded-full overflow-hidden dark:border-gray">
            <Image src={logo} alt="w3cay logo" className="w-full h-auto rounded-full" sizes="20vw" priority />
        </div>
    </Link>
  )
}

export default Logo