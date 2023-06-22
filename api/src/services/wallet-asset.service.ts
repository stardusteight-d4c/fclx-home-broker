import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/@orm/prisma/prisma.service";

@Injectable()
export class WalletAssetService {
  constructor(private prismaService: PrismaService) {}

  async all(filter: { wallet_id: string }) {
    return await this.prismaService.walletAsset.findMany({
      where: {
        wallet_id: filter.wallet_id,
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

  async create(input: { wallet_id: string; asset_id: string; shares: number }) {
    return await this.prismaService.walletAsset.create({
      data: {
        wallet_id: input.wallet_id,
        asset_id: input.asset_id,
        shares: input.shares,
        version: 1,
      },
    });
  }
}
