import { revalidateTag } from "next/cache"

async function initTransaction(formData: FormData) {
  "use server"
  const shares = formData.get("shares")
  const price = formData.get("price")
  const wallet_id = formData.get("wallet_id")
  const asset_id = formData.get("asset_id")
  const type = formData.get("type")
  console.log(`http://localhost:8000/wallet/${wallet_id}/order`)
  const response = await fetch(
    `http://localhost:8000/wallet/${wallet_id}/order`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        shares,
        price,
        asset_id,
        type,
        status: "OPEN",
        Asset: {
          id: asset_id,
          symbol: "PETR4",
          price: 30,
        },
      }),
    }
  )
  // in MyOrders.tsx
  revalidateTag(`orders-wallet-${wallet_id}`)
  return await response.json()
}

export function OrderForm(props: { asset_id: string; wallet_id: string }) {
  return (
    <div>
      <h1>Order Form</h1>
      <form action={initTransaction}>
        <input
          name="asset_id"
          type="hidden"
          className="hidden"
          defaultValue={props.asset_id}
        />
        <input
          name="wallet_id"
          type="hidden"
          className="hidden"
          defaultValue={props.wallet_id}
        />
        <input
          name="type"
          type="hidden"
          className="hidden"
          defaultValue={`BUY`}
        />
        <input
          name="shares"
          type="number"
          min={1}
          step={1}
          placeholder="quantity"
        />
        <input
          name="price"
          type="number"
          min={1}
          step={0.1}
          placeholder="price"
        />
        <button>Buy</button>
      </form>
    </div>
  )
}
