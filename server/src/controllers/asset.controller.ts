import { Body, Controller, Get, MessageEvent, Post, Sse } from "@nestjs/common";
import { AssetService } from "../services/asset.service";
import { Observable, map } from "rxjs";

@Controller("asset")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  async create(@Body() body: { id: string; symbol: string; price: number }) {
    return await this.assetService.create(body);
  }

  @Get()
  async all() {
    return await this.assetService.all();
  }

  @Sse("events")
  events(): Observable<MessageEvent> {
    return this.assetService.subscribeEvents().pipe(
      map((event) => ({
        type: event.event,
        data: event.data,
      }))
    );
  }
}
