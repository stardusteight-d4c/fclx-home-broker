import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Order, OrderStatus } from "@prisma/client";
import { Observable } from "rxjs";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { Order as OrderSchema } from "../@mongoose/Order.schema";
import {
  InitTransactionDto,
  InputExecuteTransactionDto,
} from "src/dtos/order.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { WalletOrderHandler } from "./helpers/WalletOrderHandler";
import { options, pipeline } from "./helpers/data";

@Injectable()
export class WalletOrderService {
  #handler: WalletOrderHandler;

  constructor(
    private prismaService: PrismaService,
    @Inject("ORDERS_PUBLISHER")
    private readonly kafkaClient: ClientKafka,
    @InjectModel(OrderSchema.name) private orderModel: Model<OrderSchema>
  ) {
    const handler = new WalletOrderHandler({ prismaService });
    this.#handler = handler;
  }

  private async createOrder(input: InitTransactionDto) {
    return await this.prismaService.order.create({
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
  }

  private async emitKafkaEvent(order: any) {
    this.kafkaClient.emit("input", {
      order_id: order.id,
      investor_id: order.wallet_id,
      asset_id: order.asset_id,
      current_shares: order.shares,
      shares: order.shares,
      price: order.price,
      order_type: order.type,
    });
  }

  public async all(filter: { wallet_id: string }) {
    return this.#handler
      .findAllOrders(filter)
      .then((orders) => orders)
      .catch((err) => console.error(err));
  }

  public async initTransaction(input: InitTransactionDto) {
    return this.createOrder(input)
      .then((order) => {
        this.emitKafkaEvent(order);
        return order;
      })
      .catch((err) => console.log(err));
  }

  public async executeTransaction(input: InputExecuteTransactionDto) {
    this.prismaService
      .$transaction(async (prisma) => {
        const order = await prisma.order.findUniqueOrThrow({
          where: { id: input.order_id },
        });
        await this.#handler.updateOrderTransaction(input, order);
        if (input.status === OrderStatus.CLOSED) {
          await this.#handler.updateAsset(order, input.price);
          await this.#handler.createAssetDaily(order.asset_id, input.price);
          await this.#handler.updateWalletAsset(order, input.negotiated_shares);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  public subscribeEvents(
    wallet_id: string
  ): Observable<{ event: "order-created" | "order-updated"; data: Order }> {
    try {
      return new Observable((observer) => {
        const changeStream = this.orderModel.watch(
          pipeline(wallet_id),
          options
        );
        changeStream.on("change", (data) =>
          this.#handler.handleOrderChange({ data, observer })
        );
        return () => {
          changeStream.removeListener("change", (data) =>
            this.#handler.handleOrderChange({ data, observer })
          );
          changeStream.close();
        };
      });
    } catch (err) {
      console.error(err);
    }
  }
}
