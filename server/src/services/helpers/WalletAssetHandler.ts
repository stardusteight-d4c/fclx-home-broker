import { PrismaService } from "src/@orm/prisma/prisma.service";

export class WalletAssetHandler {
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
}
