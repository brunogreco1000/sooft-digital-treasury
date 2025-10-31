import { Controller, Get, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // Nuevo endpoint "me", no necesitas pasar ID en URL
  @Get('me')
  async getMyDashboard(@Req() req: Request) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new ForbiddenException('No autorizado');
    }
    return this.dashboardService.getDashboardData(userId);
  }
}
