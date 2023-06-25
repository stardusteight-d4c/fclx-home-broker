import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { WalletAsset } from "@prisma/client";
import { Model } from "mongoose";
import { Observable } from "rxjs";
import { WalletAsset as WalletAssetSchema } from "src/@mongoose/WalletAsset.schema";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { WalletAssetHandler } from "./helpers/WalletAssetHandler";

@Injectable()
export class WalletAssetService {
  #handler: WalletAssetHandler;

  constructor(
    private prismaService: PrismaService,
    @InjectModel(WalletAssetSchema.name)
    private walletAssetModel: Model<WalletAssetSchema>
  ) {
    const handler = new WalletAssetHandler({ prismaService });
    this.#handler = handler;
  }

  public async findAllAssetsWallet(filter: { wallet_id: string }) {
    return this.#handler
      .findAllAssetsWallet(filter.wallet_id)
      .then((assets) => assets)
      .catch((err) => console.error(err));
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

  async subscribeEvents(wallet_id: string): Promise<
    Observable<{
      event: "wallet-asset-updated";
      data: WalletAsset;
    }>
  > {
    return new Observable((observer) => {
      this.walletAssetModel
        .watch(
          [
            {
              $match: {
                operationType: "update",
                "fullDocument.wallet_id": wallet_id,
              },
            },
          ],
          { fullDocument: "updateLookup" }
        )
        .on("change", async (data) => {
          console.log(data);
          const walletAsset = await this.prismaService.walletAsset.findUnique({
            where: {
              id: data.fullDocument._id + "",
            },
          });
          observer.next({
            event: "wallet-asset-updated",
            data: walletAsset,
          });
        });
    });
  }
}
