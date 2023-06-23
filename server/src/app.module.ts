import { Module } from "@nestjs/common";
import { PrismaModule } from "./@modules/prisma.module";
import { AssetModule } from "./@modules/asset.module";
import { WalletModule } from "./@modules/wallet.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AssetModule,
    WalletModule,
    MongooseModule.forRoot(process.env.DATABASE_URL),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
