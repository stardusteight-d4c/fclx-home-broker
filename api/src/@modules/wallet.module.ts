import { Module } from "@nestjs/common";
import { WalletAssetController } from "src/controllers/wallet-asset.controller";
import { WalletController } from "src/controllers/wallet.controller";
import { WalletAssetService } from "src/services/wallet-asset.service";
import { WalletService } from "src/services/wallet.service";

@Module({
  controllers: [WalletController, WalletAssetController],
  providers: [WalletService, WalletAssetService],
})
export class WalletModule {}
