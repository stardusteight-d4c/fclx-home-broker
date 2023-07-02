interface InitTransactionDto {
  asset_id: string;
  wallet_id: string;
  shares: number;
  price: number;
  type: "SELL" | "BUY";
}

interface InputExecuteTransactionDto {
  order_id: string;
  status: "OPEN" | "CLOSED";
  related_investor_id: string;
  broker_transaction_id: string;
  negotiated_shares: number;
  price: number;
}

type CreateOrderDTO = {
  wallet_id: string;
  asset_id: string;
  shares: number;
};

type ExecuteTransactionMessage = {
  order_id: string;
  investor_id: string;
  asset_id: string;
  order_type: string;
  status: "OPEN" | "CLOSED";
  partial: number;
  shares: number;
  transactions: {
    transaction_id: string;
    buyer_id: string;
    seller_id: string;
    asset_id: string;
    shares: number;
    price: number;
  }[];
};

interface Order {
  id: string;
  wallet_id: string;
  asset_id: string;
  shares: number;
  price: number;
  type: OrderType;
  status: OrderStatus;
  partial: number;
  version: number;
  created_at: Date;
  updated_at: Date;
}
