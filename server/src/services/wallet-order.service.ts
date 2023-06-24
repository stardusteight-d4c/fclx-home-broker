import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Order, OrderStatus, OrderType } from "@prisma/client";
import { Observable } from "rxjs";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { Order as OrderSchema } from "../@mongoose/order.schema";
import {
  InitTransactionDto,
  InputExecuteTransactionDto,
} from "src/dtos/order.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class WalletOrderService {
  constructor(
    private prismaService: PrismaService,
    @Inject("ORDERS_PUBLISHER")
    private readonly kafkaClient: ClientKafka,
    @InjectModel(OrderSchema.name) private orderModel: Model<OrderSchema>
  ) {}

  async all(filter: { wallet_id: string }) {
    return await this.prismaService.order.findMany({
      where: {
        wallet_id: filter.wallet_id,
      },
      include: {
        Transactions: true,
        Asset: {
          select: {
            id: true,
            symbol: true,
          },
        },
      },
      orderBy: {
        updated_at: "desc",
      },
    });
  }

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
    this.kafkaClient.emit("input", {
      order_id: order.id,
      investor_id: order.wallet_id,
      asset_id: order.asset_id,
      current_shares: order.shares,
      shares: order.shares,
      price: order.price,
      order_type: order.type,
    });
    return order;
  }

  async executeTransaction(input: InputExecuteTransactionDto) {
    /**
     * A transaction is a way of grouping a set of related operations
     * into an indivisible unit, where all operations must execute
     * successfully or none of them must execute.
     */
    return await this.prismaService.$transaction(async (prisma) => {
      const order = await prisma.order.findUniqueOrThrow({
        where: { id: input.order_id },
      });
      // add the transaction in order
      await prisma.order.update({
        where: { id: input.order_id, version: order.version },
        data: {
          partial: order.partial - input.negotiated_shares,
          status: input.status,
          Transactions: {
            create: {
              broker_transaction_id: input.broker_transaction_id,
              related_investor_id: input.related_investor_id,
              shares: input.negotiated_shares,
              price: input.price,
            },
          },
          version: { increment: 1 },
        },
      });
      // count the amount of assets in the wallet
      if (input.status === OrderStatus.CLOSED) {
        await prisma.asset.update({
          where: { id: order.asset_id },
          data: {
            price: input.price,
          },
        });
        const walletAsset = await prisma.walletAsset.findUnique({
          where: {
            wallet_id_asset_id: {
              asset_id: order.asset_id,
              wallet_id: order.wallet_id,
            },
          },
        });
        if (walletAsset) {
          await prisma.walletAsset.update({
            where: {
              wallet_id_asset_id: {
                asset_id: order.asset_id,
                wallet_id: order.wallet_id,
              },
              version: walletAsset.version,
            },
            data: {
              shares:
                order.type === OrderType.BUY
                  ? walletAsset.shares + order.shares
                  : walletAsset.shares - order.shares,
              version: { increment: 1 },
            },
          });
        } else {
          await prisma.walletAsset.create({
            data: {
              asset_id: order.asset_id,
              wallet_id: order.wallet_id,
              shares: input.negotiated_shares,
              version: 1,
            },
          });
        }
      }
    });
  }

  subscribeEvents(
    wallet_id: string
  ): Observable<{ event: "order-created" | "order-updated"; data: Order }> {
    return new Observable((observer) => {
      this.orderModel
        .watch(
          [
            {
              $match: {
                $or: [{ operationType: "insert" }, { operationType: "update" }],
                "fullDocument.wallet_id": wallet_id,
              },
            },
          ],
          { fullDocument: "updateLookup" }
        )
        .on("change", async (data) => {
          const order = await this.prismaService.order.findUnique({
            where: {
              id: data.fullDocument._id + "",
            },
          });
          observer.next({
            event:
              data.operationType === "insert"
                ? "order-created"
                : "order-updated",
            data: order,
          });
        });
    });
  }
}
