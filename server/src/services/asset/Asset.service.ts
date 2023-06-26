import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Asset } from "@prisma/client";
import { Asset as AssetSchema } from "src/@mongoose/Asset.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { AssetHandler } from "../@helpers/AssetHandler";
import { fullDocumentUpdateLookup, updatePipeline } from "../@helpers/data";

@Injectable()
export class AssetService {
  #handler: AssetHandler;

  constructor(
    private prismaService: PrismaService,
    @InjectModel(AssetSchema.name) private assetModel: Model<AssetSchema>
  ) {}

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

  public subscribeEvents(): Observable<{
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
}
