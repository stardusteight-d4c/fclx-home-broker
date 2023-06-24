import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "src/@mongoose/order.schema";
import {
  WalletAsset,
  WalletAssetSchema,
} from "src/@mongoose/wallet.asset.schema";
import { WalletAssetController } from "src/controllers/wallet-asset.controller";
import { WalletOrderController } from "src/controllers/wallet-order.controller";
import { WalletController } from "src/controllers/wallet.controller";
import { WalletAssetService } from "src/services/wallet-asset.service";
import { WalletOrderService } from "src/services/wallet-order.service";
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
            brokers: ["172.18.0.1:9092"], // for internal docker network
            // brokers: ["host.docker.internal:9094"], // special hostname that resolves
            // to the IP address of the host machine (host) when used inside a Docker container
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
