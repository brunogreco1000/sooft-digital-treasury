// dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UsersModule } from '../users/users.module';
import { TransfersModule } from '../transfers/transfers.module'; // <-- IMPORTAR AQUÍ

@Module({
  imports: [UsersModule, TransfersModule], // <-- clave
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
