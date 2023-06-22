import { Module } from "@nestjs/common";
import { PrismaModule } from "./@modules/prisma.module";
import { AssetModule } from "./@modules/asset.module";
import { WalletModule } from "./@modules/wallet.module";
import { OrderModule } from "./@modules/order.module";

@Module({
  imports: [PrismaModule, AssetModule, WalletModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
