import { Observable } from "rxjs";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Wallet, WalletAsset } from "@prisma/client";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { CreateOrderDTO } from "src/dtos/order.dto";
import { WalletAsset as WalletAssetSchema } from "src/@mongoose/WalletAsset.schema";
import { WalletHandler } from "./@helpers/WalletHandler";
import { fullDocumentUpdateLookup, getUpdatePipeline } from "./@helpers/data";

@Injectable()
export class WalletService {
  #handler: WalletHandler;
  constructor(
    private prismaService: PrismaService,
    @InjectModel(WalletAssetSchema.name)
    private walletAssetModel: Model<WalletAssetSchema>
  ) {
    this.#handler = new WalletHandler({ prismaService });
  }

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

  public async findAllAssetsWallet(wallet_id: string) {
    return this.#handler
      .findAllAssetsWallet(wallet_id)
      .then((assets) => assets)
      .catch((err) => console.error(err));
  }

  public async createWalletAsset(
    request: CreateOrderDTO
  ): Promise<WalletAsset> {
    const data = { ...request, version: 1 };
    return this.prismaService.walletAsset
      .create({
        data,
      })
      .then((walletAsset) => walletAsset as WalletAsset)
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  public async subscribeEvents(wallet_id: string): Promise<
    Observable<{
      event: "wallet-asset-updated";
      data: WalletAsset;
    }>
  > {
    return new Observable((observer) => {
      this.walletAssetModel
        .watch(getUpdatePipeline(wallet_id), fullDocumentUpdateLookup)
        .on("change", async (data) =>
          this.#handler.handleWalletAssetChanged({
            changedData: data,
            observer,
          })
        );
    });
  }
}
