import { Observable, map } from "rxjs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Post,
  Sse,
} from "@nestjs/common";
import { OrderService } from "src/services/order.service";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(":wallet_id")
  public async initTransactionDto(
    @Param("wallet_id") wallet_id: string,
    @Body() body: Omit<InitTransactionDto, "wallet_id">
  ) {
    return await this.orderService.initTransaction({
      ...body,
      wallet_id,
    });
  }

  @Post("execute")
  public async executeTransactionRest(
    @Body() body: InputExecuteTransactionDto
  ) {
    return await this.orderService.executeTransaction(body);
  }

  @Get(":wallet_id")
  public async all(@Param("wallet_id") wallet_id: string) {
    return this.orderService.findAllOrdersByWalletId(wallet_id);
  }

  @MessagePattern("output")
  async executeTransactionConsumer(
    @Payload() message: ExecuteTransactionMessage
  ) {
    const transaction = message.transactions[message.transactions.length - 1];
    await this.orderService.executeTransaction({
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

  @Sse(":wallet_id/events")
  subscribeOrderEvents(
    @Param("wallet_id") wallet_id: string
  ): Observable<MessageEvent> {
    return this.orderService.subscribeOrderEvents(wallet_id).pipe(
      map((event) => ({
        type: event.event,
        data: event.data,
      }))
    );
  }
}
