import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Asset } from "@prisma/client";
import { Asset as AssetSchema } from "../@mongoose/asset.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PrismaService } from "src/@orm/prisma/prisma.service";

@Injectable()
export class AssetService {
  constructor(
    private prismaService: PrismaService,
    @InjectModel(AssetSchema.name) private assetModel: Model<AssetSchema>
  ) {}

  async create(data: { id: string; symbol: string; price: number }) {
    return await this.prismaService.asset.create({
      data,
    });
  }

  async all() {
    return this.prismaService.asset.findMany();
  }

  findOne(id: string) {
    return this.prismaService.asset.findUnique({
      where: {
        id,
      },
    });
  }

  subscribeEvents(): Observable<{ event: "asset-price-changed"; data: Asset }> {
    return new Observable((observer) => {
      this.assetModel
        .watch(
          [
            {
              $match: {
                operationType: "update",
              },
            },
          ],
          {
            fullDocument: "updateLookup",
          }
        )
        .on("change", async (data) => {
          console.log(data);
          const asset = await this.prismaService.asset.findUnique({
            where: {
              id: data.fullDocument._id + "",
            },
          });
          observer.next({ event: "asset-price-changed", data: asset });
        });
    });
  }
}
