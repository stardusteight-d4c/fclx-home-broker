import MyWallet from "../components/MyWallet"
import Navbar from "../components/Navbar"

export default async function HomePage({
  params,
}: {
  params: { wallet_id: string }
}) {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-light uppercase py-4 text-[#888888] tracking-wide">
          My investments
        </h1>
        <MyWallet wallet_id={params.wallet_id} />
      </main>
    </>
  )
}
