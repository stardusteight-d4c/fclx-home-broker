import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Post,
  Sse,
} from "@nestjs/common";
import { AssetService } from "../services/asset.service";
import { Observable, map } from "rxjs";

@Controller("asset")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  public async createAsset(
    @Body() body: { id: string; symbol: string; price: number }
  ) {
    return await this.assetService.createAsset(body);
  }

  @Get()
  public async getAllAssets() {
    return await this.assetService.getAllAssets();
  }

  @Get(":id")
  public async getAssetById(@Param("id") id: string) {
    return await this.assetService.getAssetById(id);
  }

  @Get("/:id/daily")
  public async getAllAssetsDaily(@Param("id") id: string) {
    return this.assetService.getAllAssetsDaily(id);
  }

  @Sse("events")
  public subscribeAssetPriceEvents(): Observable<MessageEvent> {
    return this.assetService.subscribeAssetPriceEvents().pipe(
      map((event) => ({
        type: event.event,
        data: event.data,
      }))
    );
  }

  @Sse("daily/events")
  public subscribeAssetDailyEvents(
    @Param("id") id: string
  ): Observable<MessageEvent> {
    return this.assetService.subscribeAssetDailyEvents(id).pipe(
      map((event) => ({
        type: event.event,
        data: event.data,
      }))
    );
  }
}
