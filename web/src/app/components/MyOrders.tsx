import { isHomeBrokerClosed } from "../utils"

async function getOrders(wallet_id: string): Promise<Order[]> {
  const response = await fetch(
    `http://localhost:8000/wallet/${wallet_id}/order`,
    {
      next: {
        tags: [`orders-wallet-${wallet_id}`],
        revalidate: isHomeBrokerClosed() ? 60 * 30 : 5,
      },
    }
  )
  return response.json()
}

export default async function MyOrders(props: { wallet_id: string }) {
  const orders = await getOrders(props.wallet_id)

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.Asset.id} - {order.shares} - R$ {order.price} - {order.status}
        </li>
      ))}
    </ul>
  )
}
