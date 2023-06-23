async function getWalletAssets(wallet_id: number): Promise<WalletAsset[]> {
  const response = await fetch(
    `http://localhost:8000/wallet/${wallet_id}/asset`
  )
  return response.json()
}

export default async function HomePage({
  params,
}: {
  params: { wallet_id: string }
}) {
  const walletAssets = await getWalletAssets(Number(params.wallet_id))

  return (
    <div>
      <h1>Meus investimentos</h1>
      <ul>
        {walletAssets.map((walletAsset) => (
          <li key={walletAsset.id}>
            {walletAsset.Asset.id} - {walletAsset.shares} - R${" "}
            {walletAsset.Asset.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
