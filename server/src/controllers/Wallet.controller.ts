import { Body, Controller, Get, Post } from "@nestjs/common";
import { WalletService } from "src/services/Wallet.service";

@Controller("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async all() {
    return await this.walletService.all();
  }

  @Post()
  async create(@Body() body: { id: string }) {
    return await this.walletService.create({
      id: body.id,
    });
  }
}
