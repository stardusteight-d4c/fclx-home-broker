import { Module } from "@nestjs/common";
import { PrismaModule } from "./@modules/prisma.module";
import { AssetModule } from "./@modules/asset.module";
import { WalletModule } from "./@modules/wallet.module";

@Module({
  imports: [PrismaModule, AssetModule, WalletModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
