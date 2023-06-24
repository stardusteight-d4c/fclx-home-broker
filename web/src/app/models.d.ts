type Asset = {
  id: string
  symbol: string
  price: string
}

type WalletAsset = {
  id: string
  wallet_id: string
  asset_id: string
  shares: string
  Asset: Asset
}

type Order = {
  id: string
  wallet_id: string
  asset_id: string
  shares: string
  partial: string
  price: string
  type: "BUY" | "SELL"
  created_at: string
  updated_at: string
  status: "PENDING" | "OPEN" | "CLOSED" | "FAILED"
  Asset: Pick<Asset, "id" | "symbol">
}

type AssetDaily = {
  id: string
  asset_id: string
  date: string
  price: number
}
