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
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
