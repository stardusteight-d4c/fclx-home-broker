import { Body, Controller, Param, Post } from "@nestjs/common";
import { InitTransactionDto, InputExecuteTransactionDto } from "src/dtos/order.dto";
import { OrderService } from "src/services/order.service";

@Controller("wallet/:wallet_id/order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  initTransactionDto(
    @Param("wallet_id") wallet_id: string,
    @Body() body: Omit<InitTransactionDto, "wallet_id">
  ) {
    return this.orderService.initTransaction({
      ...body,
      wallet_id,
    });
  }

  @Post('execute')
  executeTransactionRest(
    @Param('wallet_id') wallet_id: string,
    @Body() body: InputExecuteTransactionDto,
  ) {
    return this.orderService.executeTransaction(body);
  }
}
