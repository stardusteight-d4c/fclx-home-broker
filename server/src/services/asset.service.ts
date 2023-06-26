import { Observable } from "rxjs";
import { Model } from "mongoose";
import { ObjectId } from "bson";
import { AssetDaily } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Asset } from "@prisma/client";
import { Asset as AssetSchema } from "src/@mongoose/Asset.schema";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { AssetHandler } from "./@helpers/AssetHandler";
import {
  fullDocumentUpdateLookup,
  getInsertPipeline,
  updatePipeline,
} from "./@helpers/data";
import { AssetDaily as AssetDailySchema } from "../@mongoose/AssetDaily.schema";

@Injectable()
export class AssetService {
  #handler: AssetHandler;

  constructor(
    private prismaService: PrismaService,
    @InjectModel(AssetSchema.name)
    private assetModel: Model<AssetSchema>,
    @InjectModel(AssetDailySchema.name)
    private assetDailyModel: Model<AssetDailySchema>
  ) {
    this.#handler = new AssetHandler({ prismaService });
  }

  public async createAsset(data: {
    id: string;
    symbol: string;
    price: number;
  }) {
    return await this.prismaService.asset.create({
      data,
    });
  }

  public async getAllAssets() {
    return this.prismaService.asset.findMany();
  }

  public getAssetById(id: string) {
    return this.prismaService.asset.findUnique({
      where: {
        id,
      },
    });
  }

  public subscribeAssetPriceEvents(): Observable<{
    event: "asset-price-changed";
    data: Asset;
  }> {
    return new Observable((observer) => {
      this.assetModel
        .watch(updatePipeline, fullDocumentUpdateLookup)
        .on("change", async (data) =>
          this.#handler.handleAssetPriceChanged({
            changedData: data,
            observer,
          })
        );
    });
  }

  public async getAllAssetsDaily(
    assetIdOrSymbol: string
  ): Promise<AssetDaily[]> {
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

  public subscribeAssetDailyEvents(asset_id: string): Observable<{
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
