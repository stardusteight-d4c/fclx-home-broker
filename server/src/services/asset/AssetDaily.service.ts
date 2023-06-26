import { Injectable } from "@nestjs/common";
import { ObjectId } from "bson";
import { Observable } from "rxjs";
import { AssetDaily } from "@prisma/client";
import { AssetDaily as AssetDailySchema } from "../../@mongoose/AssetDaily.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { fullDocumentUpdateLookup, getInsertPipeline } from "../@helpers/data";
import { AssetHandler } from "../@helpers/AssetHandler";

@Injectable()
export class AssetDailyService {
  #handler: AssetHandler;

  constructor(
    private prismaService: PrismaService,
    @InjectModel(AssetDailySchema.name)
    private assetDailyModel: Model<AssetDailySchema>
  ) {
    this.#handler = new AssetHandler({ prismaService });
  }

  public async getAllAssetsDaily(assetIdOrSymbol: string): Promise<AssetDaily[]> {
    const where = ObjectId.isValid(assetIdOrSymbol)
      ? { asset_id: assetIdOrSymbol }
      : { asset: { symbol: assetIdOrSymbol } };
    return this.prismaService.assetDaily
      .findMany({
        where,
        orderBy: {
          date: "desc",
        },
      })
      .then((assetsDaily) => assetsDaily)
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  public subscribeEvents(asset_id: string): Observable<{
    event: "asset-daily-created";
    data: AssetDaily;
  }> {
    return new Observable((observer) => {
      this.assetDailyModel
        .watch(getInsertPipeline(asset_id), fullDocumentUpdateLookup)
        .on("change", async (data) =>
          this.#handler.handleAssetDailyCreated({
            changedData: data,
            observer,
          })
        );
    });
  }
}
