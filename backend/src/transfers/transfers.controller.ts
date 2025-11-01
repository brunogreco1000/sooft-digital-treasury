import { Controller, Post, Get, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateTransferDto) {
    return this.transfersService.create(req.user!.sub, dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.transfersService.findAll(req.user!.sub);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.transfersService.findById(req.user!.sub, id);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.transfersService.delete(req.user!.sub, id);
  }
}
