import { Module } from "@nestjs/common";
import { AssetController } from "../controllers/asset.controller";
import { AssetService } from "../services/asset.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Asset, AssetSchema } from "src/@mongoose/asset.schema";
import { AssetDaily, AssetDailySchema } from "src/@mongoose/asset-daily.schema";
import { AssetDailyService } from "src/services/asset-daily.service";
import { AssetDailyController } from "src/controllers/assets-daily.controller";

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
