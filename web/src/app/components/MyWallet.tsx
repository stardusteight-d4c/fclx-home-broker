"use client"

import useSWR from "swr"
import useSWRSubscription, { SWRSubscriptionOptions } from "swr/subscription"
import Link from "next/link"
import { fetcher, isOdd } from "../utils"

export default function MyWallet(props: { wallet_id: string }) {
  const { data: walletAssets, mutate: mutateWalletAssets } = useSWR<
    WalletAsset[]
    // /api/wallet
  >(`http://localhost:3001/api/wallet/${props.wallet_id}/asset`, fetcher, {
    fallbackData: [],
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const { data: assetChanged } = useSWRSubscription(
    `http://localhost:3000/asset/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path)
      eventSource.addEventListener("asset-price-changed", async (event) => {
        console.log(event)
        const assetChanged: Asset = JSON.parse(event.data)
        await mutateWalletAssets((prev) => {
          const foundIndex = prev!.findIndex(
            (walletAsset) => walletAsset.asset_id === assetChanged.id
          )

          if (foundIndex !== -1) {
            prev![foundIndex].Asset.price = assetChanged.price
          }
          console.log(prev)
          return [...prev!]
        }, false)
        next(null, assetChanged)
      })
      eventSource.onerror = (event) => {
        console.error(event)
        eventSource.close()
      }
      return () => {
        console.log("close event source")
        eventSource.close()
      }
    },
    {}
  )

  const { data: walletAssetUpdated } = useSWRSubscription(
    `http://localhost:3000/wallet/${props.wallet_id}/asset/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path)
      eventSource.addEventListener("wallet-asset-updated", async (event) => {
        const walletAssetUpdated: WalletAsset = JSON.parse(event.data)
        await mutateWalletAssets((prev) => {
          const indexFound = prev?.findIndex(
            (walletAsset) =>
              walletAsset.asset_id === walletAssetUpdated.asset_id
          )
          if (indexFound !== -1) {
            prev![indexFound!].shares = walletAssetUpdated.shares
          }
          return [...prev!]
        }, false)
        next(null, walletAssetUpdated)
      })
      eventSource.onerror = (error) => {
        console.error(error)
        eventSource.close()
      }
      return () => {
        eventSource.close()
      }
    }
  )

  return (
    <div className="w-full pb-8">
      <table className="w-full shadow-black/25 shadow-lg rounded-xl block">
        <thead className="font-semibold bg-[#1a1c20] grid grid-cols-4 w-full py-2 rounded-t-xl">
          <th className="col-span-1 px-2 text-center uppercase">Name</th>
          <th className="col-span-1 px-2 text-center uppercase">Price</th>
          <th className="col-span-1 px-2 text-center uppercase">Amount</th>
          <th className="col-span-1 px-2 text-center uppercase">Operations</th>
        </thead>
        <tbody className="w-full block">
          {walletAssets?.map((walletAsset, index) => (
            <tr
              key={index}
              className={`${isOdd(index) ? "bg-[#1a1c20]" : "bg-transparent"} ${
                index === walletAssets.length - 1 ? "rounded-b-xl" : ""
              } border border-x-0 border-t border-b-0 border-[#515359] w-full grid grid-cols-4`}
            >
              <td className="col-span-1 py-2 font-medium px-2 text-[#999999] text-start">
                {walletAsset.Asset.id} ({walletAsset.Asset.symbol})
              </td>
              <td className="col-span-1 py-2 border-y-0 border-x border-[#515359] font-medium px-2 text-[#999999] text-start">
                {walletAsset.Asset.price}
              </td>
              <td className="col-span-1 py-2 border border-y-0 border-l-0 border-[#515359] font-medium px-2 text-[#999999] text-start">
                {walletAsset.shares}
              </td>
              <td className="col-span-1 py-2 border border-x-0 border-y-0 border-[#515359] font-medium px-2 text-[#999999] text-start">
                <Link
                  className="font-light hover:underline text-[#0261FF]"
                  // href={"/"}
                  href={`/${props.wallet_id}/home-broker/${walletAsset.Asset.id}`}
                >
                  Buy/Sell
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
