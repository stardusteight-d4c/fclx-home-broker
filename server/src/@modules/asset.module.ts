import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Asset, AssetSchema } from "src/@mongoose/Asset.schema";
import { AssetDailyService } from "src/services/asset/AssetDaily.service";
import { AssetDailyController } from "src/controllers/AssetsDaily.controller";
import { AssetDaily, AssetDailySchema } from "src/@mongoose/AssetDaily.schema";
import { AssetController } from "../controllers/Asset.controller";
import { AssetService } from "../services/asset.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Asset.name, schema: AssetSchema },
      { name: AssetDaily.name, schema: AssetDailySchema },
    ]),
  ],
  controllers: [AssetController, AssetDailyController],
  providers: [AssetService, AssetDailyService],
  exports: [AssetService, AssetDailyService],
})
export class AssetModule {}
