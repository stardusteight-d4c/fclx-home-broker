import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Asset, AssetSchema } from "src/@mongoose/asset.schema";
import { AssetDaily, AssetDailySchema } from "src/@mongoose/asset-daily.schema";
import { AssetController } from "../controllers/asset.controller";
import { AssetService } from "../services/asset.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Asset.name, schema: AssetSchema },
      { name: AssetDaily.name, schema: AssetDailySchema },
    ]),
  ],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
