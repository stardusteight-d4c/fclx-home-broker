import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Sse,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { AssetDailyService } from 'src/services/asset-daily.service';

@Controller('assets/:id/daily')
export class AssetDailyController {
  constructor(private assetsDaily: AssetDailyService) {}

  @Get()
  all(@Param('id') id: string) {
    return this.assetsDaily.findAll(id);
  }

  @Sse('events')
  events(@Param('id') id: string): Observable<MessageEvent> {
    return this.assetsDaily.subscribeEvents(id).pipe(
      map((event) => ({
        type: event.event,
        data: event.data,
      })),
    );
  }
}