import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/@orm/prisma/prisma.service";

@Injectable()
export class WalletService {
  constructor(private prismaService: PrismaService) {}

  async all() {
    return await this.prismaService.wallet.findMany();
  }

  async create(input: { id: string }) {
    return await this.prismaService.wallet.create({
      data: {
        id: input.id,
      },
    });
  }
}
