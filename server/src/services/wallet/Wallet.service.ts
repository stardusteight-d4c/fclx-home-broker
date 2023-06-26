import { Injectable } from "@nestjs/common";
import { Wallet } from "@prisma/client";
import { PrismaService } from "src/@orm/prisma/prisma.service";

@Injectable()
export class WalletService {
  constructor(private prismaService: PrismaService) {}

  public async getAllWallets(): Promise<Wallet[]> {
    return await this.prismaService.wallet
      .findMany()
      .then((wallets) => wallets)
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  public async createWallet(wallet_id: string): Promise<Wallet> {
    return this.prismaService.wallet
      .create({
        data: {
          id: wallet_id,
        },
      })
      .then((wallet) => wallet)
      .catch((err) => {
        console.error(err);
        return null;
      });
  }
}
