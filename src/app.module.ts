import { Module } from '@nestjs/common';
import { GatherModule } from './modules/gather.module';
import { CoreModule } from './modules/core.module';

@Module({
  imports: [GatherModule, CoreModule],
  controllers: [],
  providers: []
})
export class AppModule {}
