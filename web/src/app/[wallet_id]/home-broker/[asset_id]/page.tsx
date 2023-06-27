import { Chart } from "@/app/components/Chart"
import MyOrders from "../../../components/MyOrders"
import { OrderForm } from "../../../components/OrderForm"
import { SyncOrders } from "@/app/components/SyncOrders"
import Navbar from "@/app/components/Navbar"

export default async function HomeBrokerPage({
  params,
}: {
  params: { wallet_id: string; asset_id: string }
}) {
  return (
    <>
      <Navbar />
      <main className="flex flex-grow flex-col max-w-7xl mx-auto">
        <h1 className="text-3xl font-light uppercase py-4 text-[#888888] tracking-wide">
          {params.asset_id}
        </h1>
        <div className="grid grid-cols-5 flex-grow gap-[20px] mt-2 mb-20">
          <div className="col-span-2 space-y-5">
            <OrderForm
              wallet_id={params.wallet_id}
              asset_id={params.asset_id}
            />
            <SyncOrders wallet_id={params.wallet_id}>
              <MyOrders wallet_id={params.wallet_id} />
            </SyncOrders>
          </div>
          <div className="col-span-3 flex flex-grow">
            <Chart header="Asset 1 - R$ 100" />
          </div>
        </div>
      </main>
    </>
  )
}
