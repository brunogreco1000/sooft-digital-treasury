// backend/payments/payments.controller.ts
import { Controller, Post, Body, Get, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(req.user!.sub, dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.paymentsService.findAll(req.user!.sub);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.paymentsService.findById(req.user!.sub, id);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.paymentsService.delete(req.user!.sub, id);
  }
}
