import MyWallet from "../components/MyWallet"

export default async function HomePage({
  params,
}: {
  params: { wallet_id: string }
}) {
  return (
    <main className="container mx-auto px-2">
      <h1>Meus investimentos</h1>
      <MyWallet wallet_id={params.wallet_id} />
    </main>
  )
}
