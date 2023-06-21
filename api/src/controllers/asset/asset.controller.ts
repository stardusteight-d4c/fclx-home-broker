import { Body, Controller, Post } from '@nestjs/common';
import { AssetService } from './asset.service';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  async create(@Body() body: {id: string, symbol: string, price: number}) {
    console.log(body);
    return await this.assetService.create(body)
  }
}
