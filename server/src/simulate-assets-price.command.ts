import { Command, CommandRunner } from "nest-commander";
import { WalletService } from "./services/wallet/Wallet.service";
import { PrismaService } from "./@orm/prisma/prisma.service";
import { AssetService } from "./services/asset/Asset.service";
import { WalletAssetService } from "./services/wallet/WalletAsset.service";
import { WalletOrderService } from "./services/wallet/WalletOrder.service";

@Command({ name: "simulate-assets-price" })
export class SimulateAssetsPriceCommand extends CommandRunner {
  constructor(
    private assetService: AssetService,
    private walletService: WalletService,
    private walletAssetService: WalletAssetService,
    private walletOrderService: WalletOrderService,
    private prismaService: PrismaService
  ) {
    super();
  }

  async run(_passedParam: string[], _options?: any): Promise<void> {
    console.log("Simulating assets price...");
    await this.cleanDatabase();
    await this.createAssets();
    await this.createWallets();
    await this.createWalletAssets();
    await this.createOrders();
  }

  async cleanDatabase() {
    await this.prismaService.$transaction([
      this.prismaService.transaction.deleteMany({}),
      this.prismaService.walletAsset.deleteMany({}),
      this.prismaService.assetDaily.deleteMany({}),
      this.prismaService.assetHistory.deleteMany({}),
      this.prismaService.order.deleteMany({}),
      this.prismaService.asset.deleteMany({}),
      this.prismaService.wallet.deleteMany({}),
    ]);
    console.log("Database cleaned");
  }

  async createAssets() {
    await this.assetService.create({
      id: "asset1",
      price: 100,
      symbol: "asset1",
    });
    console.log("Asset 1 created");
    await this.assetService.create({
      id: "asset2",
      price: 200,
      symbol: "asset2",
    });
    console.log("Asset 2 created");
  }

  async createWallets() {
    await this.walletService.createWallet("wallet1");
    console.log("Wallet 1 created");
    await this.walletService.createWallet("wallet2");
    console.log("Wallet 2 created");
  }

  async createWalletAssets() {
    await this.walletAssetService.createWalletAsset({
      asset_id: "asset1",
      wallet_id: "wallet1",
      shares: 10000,
    });
    await this.walletAssetService.create({
      asset_id: "asset2",
      wallet_id: "wallet1",
      shares: 20000,
    });
    console.log("Wallet 1 assets created");

    await this.walletAssetService.create({
      asset_id: "asset1",
      wallet_id: "wallet2",
      shares: 5000,
    });
    await this.walletAssetService.create({
      asset_id: "asset2",
      wallet_id: "wallet2",
      shares: 1000,
    });
    console.log("Wallet 2 assets created");
  }

  async createOrders() {
    console.log("Creating orders...");
    const range = (start: number, end: number) =>
      Array.from({ length: end - start }, (_, i) => i + start);

    for (const index of range(1, 100)) {
      await this.walletOrderService.initTransaction({
        asset_id: "asset1",
        wallet_id: "wallet1",
        price: 100 + index,
        shares: 1000,
        type: "SELL",
      });

      await this.walletOrderService.initTransaction({
        asset_id: "asset1",
        wallet_id: "wallet2",
        price: 100 + index + 10,
        shares: 1000,
        type: "BUY",
      });

      await this.walletOrderService.initTransaction({
        asset_id: "asset2",
        wallet_id: "wallet1",
        price: 200 + index,
        shares: 1000,
        type: "SELL",
      });

      await this.walletOrderService.initTransaction({
        asset_id: "asset2",
        wallet_id: "wallet2",
        price: 200 + index + 10,
        shares: 1000,
        type: "BUY",
      });

      await sleep(2000);
    }
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
