import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { WalletAssetService } from "src/services/wallet-asset.service";

// Nested resources
@Controller("wallet/:wallet_id/asset")
export class WalletAssetController {
  constructor(private walletAssetService: WalletAssetService) {}

  @Get()
  async all(@Param("wallet_id") wallet_id: string) {
    return await this.walletAssetService.all({ wallet_id });
  }

  @Post()
  async create(
    @Param("wallet_id") wallet_id: string,
    @Body() body: { asset_id: string; shares: number }
  ) {
    return await this.walletAssetService.create({
      wallet_id,
      ...body,
    });
  }
}
