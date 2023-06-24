import { Module } from "@nestjs/common";
import { AssetController } from "../controllers/asset.controller";
import { AssetService } from "../services/asset.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Asset, AssetSchema } from "src/@mongoose/asset.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
  ],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
