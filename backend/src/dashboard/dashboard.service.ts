import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async getDashboardData(userId: string) {
    // Traer info del usuario
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Traer últimos movimientos del usuario (ej: últimos 10)
    const movements = await this.paymentsService.findAll(userId);
    const lastMovements = movements.slice(0, 10);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      movements: lastMovements,
      summary: {
        totalIngresos: movements
          .filter(m => m.amount > 0)
          .reduce((sum, m) => sum + m.amount, 0),
        totalEgresos: movements
          .filter(m => m.amount < 0)
          .reduce((sum, m) => sum + m.amount, 0),
        balance: movements.reduce((sum, m) => sum + m.amount, 0),
      },
    };
  }
}
