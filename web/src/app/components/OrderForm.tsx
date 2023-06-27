"use client"

import { useState } from "react"
import { HiArrowUp, HiShoppingCart } from "react-icons/hi"
import { revalidateTag } from "next/cache"

async function initTransaction(formData: FormData) {
  const shares = formData.get("shares")
  const price = formData.get("price")
  const wallet_id = formData.get("wallet_id")
  const asset_id = formData.get("asset_id")
  const type = formData.get("type")
  const response = await fetch(`http://localhost:3000/order/${wallet_id}`, {
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
  })
  revalidateTag(`orders-wallet-${wallet_id}`)
  return await response.json()
}

export function OrderForm(props: { asset_id: string; wallet_id: string }) {
  const [tabValue, setTabValue] = useState<"BUY" | "SELL">("BUY")

  return (
    <aside className="bg-[#1a1c20] p-4 shadow-black/25 shadow-lg rounded-xl">
      <div className="flex items-center gap-x-1 mb-4">
        <button
          onClick={() => setTabValue("BUY")}
          className={`${
            tabValue === "BUY" ? "bg-blue-500" : "bg-transparent"
          }  rounded-md justify-center py-2 px-4 flex items-center gap-x-1`}
        >
          <HiShoppingCart size={20} /> Purchase
        </button>
        <button
          onClick={() => setTabValue("SELL")}
          className={`${
            tabValue === "SELL" ? "bg-green-500" : "bg-transparent"
          } rounded-md justify-center py-2 px-4 flex items-center gap-x-1`}
        >
          <HiArrowUp size={20} /> Sell
        </button>
      </div>
      <form action={initTransaction}>
        <input name="asset_id" type="hidden" defaultValue={props.asset_id} />
        <input name="wallet_id" type="hidden" defaultValue={props.wallet_id} />
        <input name="type" type="hidden" defaultValue={"BUY"} />
        <div>
          <div className="mb-2 block">
            <label htmlFor="shares">Amount</label>
          </div>
          <input
            id="shares"
            name="shares"
            required
            type="text"
            defaultValue={1}
            className="w-full p-1 bg-transparent border border-[#515359] rounded-md shadow-black/30 shadow-inner"
          />
        </div>
        <br />
        <div>
          <div className="mb-2 block">
            <label htmlFor="price">Price R$</label>
          </div>
          <input
            id="price"
            name="price"
            required
            type="text"
            defaultValue={1}
            className="w-full p-1 bg-transparent border border-[#515359] rounded-md shadow-black/30 shadow-inner"
          />
        </div>
        <br />
        <button
          type="submit"
          className={`${
            tabValue === "BUY" ? "bg-blue-500" : "bg-green-500"
          }  rounded-md transition-all hover:scale-105 active:scale-100 duration-300 px-4 font-semibold whitespace-nowrap justify-center py-2 flex items-center gap-x-1`}
        >
          Confirm {tabValue === "BUY" ? "purchase" : "sale"}
        </button>
      </form>
    </aside>
  )
}
