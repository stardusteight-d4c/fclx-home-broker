import { isHomeBrokerClosed, isOdd } from "../utils"

async function getOrders(wallet_id: string): Promise<Order[]> {
  const response = await fetch(
    `http://localhost:3000/order/${wallet_id}`,
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
    <div>
      <aside>
        <table className="w-full shadow-black/25 shadow-lg rounded-xl block">
          <thead className="font-semibold bg-[#1a1c20] text-sm grid grid-cols-5 w-full py-2 rounded-t-xl">
            <th className="col-span-1 px-2 text-center uppercase">asset_id</th>
            <th className="col-span-1 px-2 text-center uppercase">amount</th>
            <th className="col-span-1 px-2 text-center uppercase">price</th>
            <th className="col-span-1 px-2 text-center uppercase">type</th>
            <th className="col-span-1 px-2 text-center uppercase">status</th>
          </thead>
          <tbody className="w-full block">
            {orders.map((order, index) => (
              <tr
                key={index}
                className={`${
                  isOdd(index) ? "bg-[#1a1c20]" : "bg-transparent"
                } ${
                  index === orders.length - 1 ? "rounded-b-xl" : ""
                } border text-sm border-x-0 border-t border-b-0 border-[#515359] w-full grid grid-cols-5`}
              >
                <td className="col-span-1 py-2 px-2 text-[#999999] text-start">
                  {order.Asset.id}
                </td>
                <td className="col-span-1 py-2 border-y-0 border-x border-[#515359] px-2 text-[#999999] text-start">
                  {order.shares}
                </td>
                <td className="col-span-1 py-2 border border-y-0 border-l-0 border-[#515359] px-2 text-[#999999] text-start">
                  {order.price}
                </td>{" "}
                <td className="col-span-1 py-2 border border-y-0 border-l-0 border-[#515359] px-2 text-[#999999] text-center">
                  <span
                    className={`${
                      order.type === "BUY" ? "bg-blue-500" : "bg-green-500"
                    } text-white  w-[41px] block mx-auto p-1 rounded-md`}
                  >
                    {order.type}
                  </span>
                </td>
                <td className="col-span-1 flex items-center justify-center border border-y-0 border-x-0 border-[#515359] px-2 text-[#999999] text-center">
                  <span
                    className={`${
                      (order.status === "OPEN" &&
                        "text-green-500 text-shadow-green-500") ||
                      (order.status === "CLOSED" &&
                        "text-blue-500 text-shadow-blue-500") ||
                      (order.status === "PENDING" &&
                        "text-yellow-500 text-shadow-yellow-500") ||
                      (order.status === "FAILED" &&
                        "text-red-500 text-shadow-red-500")
                    } w-[70px] mx-auto drop-shadow-sm block rounded-md`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </aside>
    </div>
  )
}
