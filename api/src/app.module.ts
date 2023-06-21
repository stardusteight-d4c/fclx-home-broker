import { Module } from '@nestjs/common';
import { PrismaModule } from './orm/prisma.module';
import { AssetModule } from './controllers/asset/asset.module';

@Module({
  imports: [PrismaModule, AssetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}