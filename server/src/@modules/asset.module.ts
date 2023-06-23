import { Module } from '@nestjs/common';
import { AssetController } from '../controllers/asset.controller';
import { AssetService } from '../services/asset.service';

@Module({
  controllers: [AssetController],
  providers: [AssetService]
})
export class AssetModule {}
