import { Body, Controller, Get, Post } from "@nestjs/common";
import { AssetService } from "../services/asset.service";

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
}
