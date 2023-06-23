import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ["172.18.0.1:9092"],
      },
      consumer: {
        groupId: "orders-consumer",
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
