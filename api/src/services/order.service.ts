import { Injectable } from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { InitTransactionDto, InputExecuteTransactionDto } from "src/dtos/order.dto";

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async initTransaction(input: InitTransactionDto) {
    const order = await this.prismaService.order.create({
      data: {
        asset_id: input.asset_id,
        wallet_id: input.wallet_id,
        shares: input.shares,
        partial: input.shares,
        price: input.price,
        type: input.type,
        status: OrderStatus.PENDING,
        version: 1,
      },
    });
    // this.kafkaClient.emit('input', {
    //   order_id: order.id,
    //   investor_id: order.wallet_id,
    //   asset_id: order.asset_id,
    //   //current_shares: order.shares,
    //   shares: order.shares,
    //   price: order.price,
    //   order_type: order.type,
    // });
    return order;
  }

  executeTransaction(input: InputExecuteTransactionDto) {

  }

}