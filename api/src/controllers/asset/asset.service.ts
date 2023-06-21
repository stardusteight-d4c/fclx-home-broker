import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/orm/prisma/prisma.service';

@Injectable()
export class AssetService {
  constructor(private prismaService: PrismaService) {}
  
  async create(data: { id: string, symbol: string, price: number }) {
    console.log('data', data);
    return await this.prismaService.asset.create({
      data,
    })
  }
}
