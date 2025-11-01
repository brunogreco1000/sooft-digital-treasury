import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { RiskService } from './risk.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('risk')
@UseGuards(JwtAuthGuard)
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateRiskDto) {
    return this.riskService.create(req.user!.sub, dto);
  }

  @Get()
  findByUser(@Req() req: Request) {
    return this.riskService.findByUser(req.user!.sub);
  }
}
