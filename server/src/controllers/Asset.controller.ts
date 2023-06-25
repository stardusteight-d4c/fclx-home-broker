import { Body, Controller, Get, MessageEvent, Param, Post, Sse } from "@nestjs/common";
import { AssetService } from "../services/Asset.service";
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
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
