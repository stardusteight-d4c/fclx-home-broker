import { Asset, AssetDaily } from "@prisma/client";
import { Subscriber } from "rxjs";
import { PrismaService } from "src/@orm/prisma/prisma.service";

export class AssetHandler {
  #prismaService: PrismaService;

  constructor(implementations: { prismaService: PrismaService }) {
    this.#prismaService = implementations.prismaService;
  }

  public async handleAssetPriceChanged(request: {
    changedData: any;
    observer: Subscriber<{
      event: "asset-price-changed";
      data: Asset;
    }>;
  }) {
    const asset = await this.#prismaService.asset.findUnique({
      where: {
        id: String(request.changedData.fullDocument._id),
      },
    });
    request.observer.next({ event: "asset-price-changed", data: asset });
  }

  public async handleAssetDailyCreated(request: {
    changedData: any;
    observer: Subscriber<{
      event: "asset-daily-created";
      data: AssetDaily;
    }>;
  }) {
    const asset = await this.#prismaService.assetDaily.findUnique({
      where: {
        id: request.changedData.fullDocument._id + "",
      },
    });
    request.observer.next({ event: "asset-daily-created", data: asset });
  }
}
