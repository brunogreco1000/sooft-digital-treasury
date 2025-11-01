import { Controller, Post, Get, Param, Body, Req, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // Crear un nuevo portafolio
  @Post()
  create(@Req() req: Request, @Body() dto: CreatePortfolioDto) {
    return this.portfolioService.create(req.user!.sub, dto);
  }

  // Obtener todos los portafolios del usuario
  @Get()
  findAll(@Req() req: Request) {
    return this.portfolioService.findAll(req.user!.sub);
  }

  // Obtener portafolio por ID
  @Get(':id')
  findById(@Req() req: Request, @Param('id') id: string) {
    return this.portfolioService.findById(req.user!.sub, id);
  }
}
