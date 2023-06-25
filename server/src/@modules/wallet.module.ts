import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import {
  WalletAsset,
  WalletAssetSchema,
} from "src/@mongoose/WalletAsset.schema";
import { Order, OrderSchema } from "src/@mongoose/Order.schema";
import { WalletController } from "src/controllers/Wallet.controller";
import { WalletAssetController } from "src/controllers/WalletAsset.controller";
import { WalletOrderController } from "src/controllers/WalletOrder.controller";
import { WalletService } from "src/services/Wallet.service";
import { WalletAssetService } from "src/services/WalletAsset.service";
import { WalletOrderService } from "src/services/WalletOrder.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "ORDERS_PUBLISHER",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "orders",
            brokers: ["172.18.0.1:9092"],
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: WalletAsset.name, schema: WalletAssetSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [WalletController, WalletAssetController, WalletOrderController],
  providers: [WalletService, WalletAssetService, WalletOrderService],
  exports: [WalletService, WalletAssetService, WalletOrderService],
})
export class WalletModule {}
