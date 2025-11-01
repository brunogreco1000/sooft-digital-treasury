import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';
import { Risk, RiskSchema } from './schemas/risk.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Risk.name, schema: RiskSchema }])],
  providers: [RiskService],
  controllers: [RiskController],
  exports: [RiskService],
})
export class RiskModule {}
