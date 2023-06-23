import MyOrders from "@/app/components/MyOrders"
import { OrderForm } from "@/app/components/OrderForm"

export default async function HomeBrokerPage({
  params,
}: {
  params: { wallet_id: string; asset_id: string }
}) {
  return (
    <div>
      <h1>Home Broker</h1>
      <div className="flex">
        <div className="flex flex-col">
          <div>
            <OrderForm
              wallet_id={params.wallet_id}
              asset_id={params.asset_id}
            />
          </div>
          <div>
            <MyOrders wallet_id={params.wallet_id} />
          </div>
        </div>
        <div>gráfico</div>
      </div>
    </div>
  )
}
