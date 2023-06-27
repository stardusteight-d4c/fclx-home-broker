"use client"

import { usePathname, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  const pathname = usePathname()
  const params = useParams()

  return (
    <nav className="py-4 border-b border-b-[#515359]">
      <div className="max-w-7xl flex items-center justify-between mx-auto">
        <Link href="/">
          <div className="flex items-center">
            <Image
              className="-ml-[3px] h-6 sm:w-[185px] sm:h-[40px]"
              alt="Full Cycle Invest"
              src="/logo-blue.svg"
              width={50}
              height={50}
              quality={100}
            />
          </div>
        </Link>
        <div className="flex md:order-2 text-white text-lg">
          <span className="font-semibold">Hello</span>,{" "}
          <Link href={`/${params.wallet_id}`}>
            <span className="text-[#0261FF] block ml-2 cursor-pointer hover:underline hover:underline-[#0261FF]">
              {params.wallet_id}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
