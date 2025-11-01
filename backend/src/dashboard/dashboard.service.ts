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
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const movements = await this.paymentsService.findAll(userId);

    // Ordenar por fecha descendente y tomar últimos 10 movimientos
    const lastMovements = movements
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    // Resumen financiero en un solo reduce
    const summary = movements.reduce(
      (acc, m) => {
        if (m.amount > 0) acc.totalIngresos += m.amount;
        else acc.totalEgresos += m.amount;
        acc.balance += m.amount;
        return acc;
      },
      { totalIngresos: 0, totalEgresos: 0, balance: 0 },
    );

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      movements: lastMovements,
      summary,
    };
  }
}
