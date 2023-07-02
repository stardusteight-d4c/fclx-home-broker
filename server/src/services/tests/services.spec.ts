import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AssetService } from "../asset.service";
import { OrderService } from "../order.service";
import { WalletService } from "../wallet.service";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { WalletAsset as WalletAssetSchema } from "src/@mongoose/wallet-asset.schema";
import { AssetDaily as AssetDailySchema } from "src/@mongoose/asset-daily.schema";
import { Asset as AssetSchema } from "src/@mongoose/asset.schema";
import { Order as OrderSchema } from "src/@mongoose/order.schema";
import { Model } from "mongoose";
import { ClientKafka } from "@nestjs/microservices";

const prismaService = new PrismaService();
const kafkaOptions: any = {
  client: {
    clientId: "orders",
    brokers: ["improved-lemur-14028-us1-kafka.upstash.io:9092"],
    sasl: {
      mechanism: "scram-sha-256",
      username: process.env.UPSTASH_KAFKA_USERNAME,
      password: process.env.UPSTASH_KAFKA_PASSWORD,
    },
    ssl: true,
  },
};
let walletService: WalletService;
let assetService: AssetService;
let orderService: OrderService;

// Of course you should do tests with in-memory repositories!

describe("UserService", () => {
  beforeEach(async () => {
    await prismaService.transaction.deleteMany({});
    await prismaService.walletAsset.deleteMany({});
    await prismaService.assetDaily.deleteMany({});
    await prismaService.assetHistory.deleteMany({});
    await prismaService.order.deleteMany({});
    await prismaService.asset.deleteMany({});
    await prismaService.wallet.deleteMany({});

    walletService = new WalletService(prismaService, Model<WalletAssetSchema>);
    assetService = new AssetService(
      prismaService,
      Model<AssetSchema>,
      Model<AssetDailySchema>
    );
    orderService = new OrderService(
      prismaService,
      new ClientKafka(kafkaOptions),
      Model<OrderSchema>
    );
  });

  afterEach(async () => {
    await prismaService.transaction.deleteMany({});
    await prismaService.walletAsset.deleteMany({});
    await prismaService.assetDaily.deleteMany({});
    await prismaService.assetHistory.deleteMany({});
    await prismaService.order.deleteMany({});
    await prismaService.asset.deleteMany({});
    await prismaService.wallet.deleteMany({});
  });

  it("should be possible to create assets", async () => {
    const asset1 = {
      id: "asset1",
      price: 100,
      symbol: "asset1",
    };
    const asset2 = {
      id: "asset2",
      price: 200,
      symbol: "asset2",
    };
    expect(await assetService.createAsset(asset1)).contains(asset1);
    expect(await assetService.createAsset(asset2)).contains(asset2);
  });

  it("should be possible to create a wallet just by specifying the id", async () => {
    const wallet_id1 = "wallet1";
    const wallet_id2 = "wallet2";
    expect(
      await walletService.createWallet({ wallet_id: wallet_id1 })
    ).contains({ id: wallet_id1 });
    expect(
      await walletService.createWallet({ wallet_id: wallet_id2 })
    ).contains({ id: wallet_id2 });
  });

  it("should be possible to create wallet assets", async () => {
    const wallet1asset1 = {
      asset_id: "asset1",
      wallet_id: "wallet1",
      shares: 10000,
    };
    const wallet1asset2 = {
      asset_id: "asset2",
      wallet_id: "wallet1",
      shares: 20000,
    };
    const wallet2asset1 = {
      asset_id: "asset1",
      wallet_id: "wallet2",
      shares: 5000,
    };
    const wallet2asset2 = {
      asset_id: "asset2",
      wallet_id: "wallet2",
      shares: 1000,
    };
    expect(await walletService.createWalletAsset(wallet1asset1)).contains(
      wallet1asset1
    );
    expect(await walletService.createWalletAsset(wallet1asset2)).contains(
      wallet1asset2
    );
    expect(await walletService.createWalletAsset(wallet2asset1)).contains(
      wallet2asset1
    );
    expect(await walletService.createWalletAsset(wallet2asset2)).contains(
      wallet2asset2
    );
  });

  it("should be possible to create purchase orders", async () => {
  expect(await assetService.createAsset(asset1)).contains(asset1);
    expect(await assetService.createAsset(asset2)).contains(asset2);
  });

  // async createOrders() {
  //   console.log('Creating orders...');
  //   const range = (start: number, end: number) =>
  //     Array.from({ length: end - start }, (_, i) => i + start);

  //   for (const index of range(1, 100)) {
  //     await this.ordersService.initTransaction({
  //       asset_id: 'asset1',
  //       wallet_id: 'wallet1',
  //       price: 100 + index,
  //       shares: 1000,
  //       type: 'SELL',
  //     });

  //     await this.ordersService.initTransaction({
  //       asset_id: 'asset1',
  //       wallet_id: 'wallet2',
  //       price: 100 + index + 10,
  //       shares: 1000,
  //       type: 'BUY',
  //     });

  //     await this.ordersService.initTransaction({
  //       asset_id: 'asset2',
  //       wallet_id: 'wallet1',
  //       price: 200 + index,
  //       shares: 1000,
  //       type: 'SELL',
  //     });

  //     await this.ordersService.initTransaction({
  //       asset_id: 'asset2',
  //       wallet_id: 'wallet2',
  //       price: 200 + index + 10,
  //       shares: 1000,
  //       type: 'BUY',
  //     });

  //     await sleep(2000);
  //   }
  // }

 
});
