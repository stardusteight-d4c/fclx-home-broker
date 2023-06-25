import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Post,
  Sse,
} from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Observable, map } from "rxjs";
import {
  InitTransactionDto,
  InputExecuteTransactionDto,
} from "src/dtos/order.dto";
import { WalletOrderService } from "src/services/WalletOrder.service";

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

@Controller("wallet/:wallet_id/order")
export class WalletOrderController {
  constructor(private readonly walletOrderService: WalletOrderService) {}

  @Get()
  async all(@Param("wallet_id") wallet_id: string) {
    return this.walletOrderService.all({ wallet_id });
  }

  @Post()
  async initTransactionDto(
    @Param("wallet_id") wallet_id: string,
    @Body() body: Omit<InitTransactionDto, "wallet_id">
  ) {
    return await this.walletOrderService.initTransaction({
      ...body,
      wallet_id,
    });
  }

  @Post("execute")
  executeTransactionRest(@Body() body: InputExecuteTransactionDto) {
    return this.walletOrderService.executeTransaction(body);
  }

  @MessagePattern("output")
  async executeTransactionConsumer(
    @Payload() message: ExecuteTransactionMessage
  ) {
    const transaction = message.transactions[message.transactions.length - 1];
    await this.walletOrderService.executeTransaction({
      order_id: message.order_id,
      status: message.status,
      related_investor_id:
        message.order_type === "BUY"
          ? transaction.seller_id
          : transaction.buyer_id,
      broker_transaction_id: transaction.transaction_id,
      negotiated_shares: transaction.shares,
      price: transaction.price,
    });
  }

  @Sse("events")
  events(@Param("wallet_id") wallet_id: string): Observable<MessageEvent> {
    return this.walletOrderService.subscribeEvents(wallet_id).pipe(
      map((event) => ({
        type: event.event,
        data: event.data,
      }))
    );
  }
}
