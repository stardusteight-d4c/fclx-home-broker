import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import {
  WalletAsset,
  WalletAssetSchema,
} from "src/@mongoose/wallet-asset.schema";
import { Order, OrderSchema } from "src/@mongoose/order.schema";
import { WalletController } from "src/controllers/wallet.controller";
import { WalletService } from "src/services/wallet.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WalletAsset.name, schema: WalletAssetSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
