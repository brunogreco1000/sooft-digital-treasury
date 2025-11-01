import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { RiskModule } from './risk/risk.module';
import { TransfersModule } from './transfers/transfers.module'; // <--- agregar esto

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule, 
    AuthModule,
    UsersModule,
    PaymentsModule,
    DashboardModule,
    PortfolioModule,
    RiskModule,
    TransfersModule, 
  ],
})
export class AppModule {}
