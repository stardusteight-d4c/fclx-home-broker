"use client"

import useSWR from "swr"
import useSWRSubscription, { SWRSubscriptionOptions } from "swr/subscription"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableHeadCell,
  TableRow,
} from "../components/flowbite-components"
import { fetcher, isHomeBrokerClosed } from "../utils"

export default function MyWallet(props: { wallet_id: string }) {
  const { data: walletAssets, mutate: mutateWalletAssets } = useSWR<
    WalletAsset[]
  >(`http://localhost:3001/api/wallet/${props.wallet_id}/asset`, fetcher, {
    fallbackData: [],
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const { data: assetChanged } = useSWRSubscription(
    `http://localhost:3000/assets/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      
      const eventSource = new EventSource(path);
      eventSource.addEventListener("asset-price-changed", async (event) => {
        console.log(event);
        const assetChanged: Asset = JSON.parse(event.data);
        await mutateWalletAssets((prev) => {
          const foundIndex = prev!.findIndex(
            (walletAsset) => walletAsset.asset_id === assetChanged.id
          );
          
          if (foundIndex !== -1) {
            prev![foundIndex].Asset.price = assetChanged.price;
          }
          console.log(prev);
          return [...prev!];
        }, false);
        next(null, assetChanged);
      });

      eventSource.onerror = (event) => {
        console.error(event);
        eventSource.close();
      };
      return () => {
        console.log("close event source");
        eventSource.close();
      };
    },
    {}
  );

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
    <Table className="bg-black">
      <TableHead>
        <TableHeadCell>Nome</TableHeadCell>
        <TableHeadCell>Preço R$</TableHeadCell>
        <TableHeadCell>Quant.</TableHeadCell>
        <TableHeadCell>
          <span className="sr-only">Comprar/Vender</span>
        </TableHeadCell>
      </TableHead>
      <TableBody className="divide-y ">
        {walletAssets?.map((walletAsset, key) => (
          <TableRow className="border-gray-700 bg-gray-800" key={key}>
            <TableCell className="whitespace-nowrap font-medium text-white">
              {walletAsset.Asset.id} ({walletAsset.Asset.symbol})
            </TableCell>
            <TableCell>{walletAsset.Asset.price}</TableCell>
            <TableCell>{walletAsset.shares}</TableCell>
            <TableCell>
              <Link
                className="font-medium hover:underline text-cyan-500"
                href={`/${props.wallet_id}/home-broker/${walletAsset.Asset.id}`}
              >
                Comprar/Vender
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
