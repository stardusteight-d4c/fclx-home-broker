import { Model } from "mongoose";
import { Observable } from "rxjs";
import { InjectModel } from "@nestjs/mongoose";
import { ClientKafka } from "@nestjs/microservices";
import { Inject, Injectable } from "@nestjs/common";
import { Order, OrderStatus, OrderType } from "@prisma/client";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { Order as OrderSchema } from "src/@mongoose/order.schema";
import {
  fullDocumentUpdateLookup,
  getInsertAndUpdatePipeline,
} from "./@helpers/data";
import { OrderHandler } from "./@helpers/order.handler";

@Injectable()
export class OrderService {
  #handler: OrderHandler;

  constructor(
    private prismaService: PrismaService,
    @Inject("ORDERS_PUBLISHER")
    private readonly kafkaClient: ClientKafka,
    @InjectModel(OrderSchema.name) private orderModel: Model<OrderSchema>
  ) {
    this.#handler = new OrderHandler({ prismaService });
  }

  private async createOrder(input: InitTransactionDto): Promise<Order> {
    return await this.prismaService.order.create({
      data: {
        asset_id: input.asset_id,
        wallet_id: input.wallet_id,
        shares: input.shares,
        partial: input.shares,
        price: input.price,
        type: input.type as unknown as OrderType,
        status: OrderStatus.PENDING,
        version: 1,
      },
    });
  }

  private async emitKafkaEvent(order: Order): Promise<void> {
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

  public async findAllOrdersByWalletId(wallet_id: string): Promise<Order[] | void> {
    return this.#handler
      .findAllOrdersByWalletId(wallet_id)
      .then((orders) => orders)
      .catch((err) => console.error(err));
  }

  public async initTransaction(input: InitTransactionDto): Promise<Order> {
    return this.createOrder(input)
      .then((order: any) => {
        this.emitKafkaEvent(order);
        return order;
      })
      .catch((err) => console.log(err));
  }

  public async executeTransaction(
    input: InputExecuteTransactionDto
  ): Promise<void> {
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

  public subscribeOrderEvents(
    wallet_id: string
  ): Observable<{ event: "order-created" | "order-updated"; data: Order }> {
    return new Observable((observer) => {
      this.orderModel
        .watch(getInsertAndUpdatePipeline(wallet_id), fullDocumentUpdateLookup)
        .on("change", async (data) =>
          this.#handler.handleOrderChanged({
            changedData: data,
            observer,
          })
        );
    });
  }
}
