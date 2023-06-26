import { Subscriber } from "rxjs";
import { WalletAsset } from "@prisma/client";
import { PrismaService } from "src/@orm/prisma/prisma.service";

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
    changedData: any;
    observer: Subscriber<{
      event: "wallet-asset-updated";
      data: WalletAsset;
    }>;
  }) {
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
}
