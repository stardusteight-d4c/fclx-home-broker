import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Post,
  Sse,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { WalletService } from "src/services/wallet.service";

@Controller("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post("asset")
  public async createWalletAsset(
    @Param("wallet_id") wallet_id: string,
    @Body() body: { asset_id: string; shares: number }
  ) {
    return await this.walletService.createWalletAsset({
      wallet_id,
      ...body,
    });
  }

  @Post()
  public async createWallet(@Body() body: { id: string }) {
    return await this.walletService.createWallet({
      wallet_id: body.id,
    });
  }

  @Get()
  public async getAllWallets() {
    return await this.walletService.getAllWallets();
  }

  @Get(":wallet_id/asset")
  public async getAllWalletAssets(@Param("wallet_id") wallet_id: string) {
    return await this.walletService.getAllWalletAssets({ wallet_id });
  }

  @Sse(":wallet_id/asset/events")
  public subscribeWalletAssetEvents(
    @Param("wallet_id") wallet_id: string
  ): Observable<MessageEvent> {
    return this.walletService.subscribeWalletAssetEvents(wallet_id).pipe(
      map((event) => ({
        type: event.event,
        data: event.data,
      }))
    );
  }
}
