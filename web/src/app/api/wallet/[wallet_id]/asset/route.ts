import { isHomeBrokerClosed } from "@/app/utils"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _: NextRequest,
  { params }: { params: { wallet_id: string } }
) {
  const response = await fetch(
    `http://host.docker.internal:3000/wallets/${params.wallet_id}/assets`,
    {
      //cache: 'no-store', does not cache the request
      next: {
        revalidate: isHomeBrokerClosed() ? 60 * 30 : 5,
      },
    }
  )
  return NextResponse.json(await response.json())
}
