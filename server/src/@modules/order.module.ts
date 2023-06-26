import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "src/@mongoose/order.schema";
import { OrderController } from "src/controllers/order.controller";
import { OrderService } from "src/services/order.service";

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
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
