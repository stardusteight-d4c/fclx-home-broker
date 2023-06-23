import MyWallet from "../components/MyWallet"

export default async function HomePage({
  params,
}: {
  params: { wallet_id: string }
}) {
  return (
    <div className="bg-black h-screen text-white">
      <h1>Meus investimentos</h1>
      <MyWallet wallet_id={params.wallet_id} />
    </div>
  )
}
