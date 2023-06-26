import { Order, OrderType, WalletAsset } from "@prisma/client";
import { Subscriber } from "rxjs";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { InputExecuteTransactionDto } from "src/dtos/order.dto";

export class WalletHandler {
  #prismaService: PrismaService;

  constructor(implementations: { prismaService: PrismaService }) {
    this.#prismaService = implementations.prismaService;
  }

  public async findAllAssetsWallet(wallet_id: string) {
    return await this.#prismaService.walletAsset.findMany({
      where: {
        wallet_id,
      },
      include: {
        Asset: {
          select: {
            id: true,
            symbol: true,
            price: true,
          },
        },
      },
    });
  }

  public async handleWalletAssetChanged(request: {
    changedData: any,
    observer: Subscriber<{
      event: "wallet-asset-updated";
      data: WalletAsset;
    }>}
  ) {
    const walletAsset = await this.#prismaService.walletAsset.findUnique({
      where: {
        id: String(request.changedData.fullDocument._id),
      },
    });
    request.observer.next({
      event: "wallet-asset-updated",
      data: walletAsset,
    });
  }

  public async updateAsset(order: any, price: number) {
    await this.#prismaService.asset.update({
      where: { id: order.asset_id },
      data: {
        price: price,
      },
    });
  }

  public async createAssetDaily(assetId: string, price: number) {
    await this.#prismaService.assetDaily.create({
      data: {
        asset_id: assetId,
        date: new Date(),
        price: price,
      },
    });
  }

  public async updateWalletAsset(order: any, negotiatedShares: number) {
    const walletAsset = await this.#prismaService.walletAsset.findUnique({
      where: {
        wallet_id_asset_id: {
          asset_id: order.asset_id,
          wallet_id: order.wallet_id,
        },
      },
    });

    if (walletAsset) {
      await this.#prismaService.walletAsset.update({
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
      await this.#prismaService.walletAsset.create({
        data: {
          asset_id: order.asset_id,
          wallet_id: order.wallet_id,
          shares: negotiatedShares,
          version: 1,
        },
      });
    }
  }

  public async updateOrderTransaction(
    input: InputExecuteTransactionDto,
    order: any
  ) {
    await this.#prismaService.order.update({
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
  }

  public async findAllOrdersById(wallet_id: string) {
    return await this.#prismaService.order.findMany({
      where: {
        wallet_id,
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

  public async handleOrderChanged(request: {
    changedData: any;
    observer: Subscriber<{
      event: "order-created" | "order-updated";
      data: Order;
    }>;
  }) {
    const order = await this.#prismaService.order.findUnique({
      where: {
        id: String(request.changedData.fullDocument._id),
      },
    });
    request.observer.next({
      event:
        request.changedData.operationType === "insert"
          ? "order-created"
          : "order-updated",
      data: order,
    });
  }
}
