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
import { WalletAssetService } from "src/services/WalletAsset.service";

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

  @Sse("events")
  async events(
    @Param("wallet_id") wallet_id: string
  ): Promise<Observable<MessageEvent>> {
    return (await this.walletAssetService.subscribeEvents(wallet_id)).pipe(
      map((event) => ({
        type: event.event,
        data: event.data,
      }))
    );
  }
}
