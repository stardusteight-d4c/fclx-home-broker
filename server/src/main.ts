import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ["improved-lemur-14028-us1-kafka.upstash.io:9092"],
        sasl: {
          mechanism: "scram-sha-256",
          username: process.env.UPSTASH_KAFKA_USERNAME,
          password: process.env.UPSTASH_KAFKA_PASSWORD,
        },
        ssl: true,
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
