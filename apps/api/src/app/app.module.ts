import { Module } from '@nestjs/common';
import { FreezerController } from './freezer/freezer.controller';
import { FreezerService } from './freezer/freezer.service';

@Module({
  imports: [],
  controllers: [FreezerController],
  providers: [FreezerService]
})
export class AppModule { }
