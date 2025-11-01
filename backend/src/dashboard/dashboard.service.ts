import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TransfersService } from '../transfers/transfers.service';
import { Transfer } from '../transfers/schemas/transfer.schema';
import { UserDocument } from '../users/schemas/user.schema';

export interface DashboardTransfer {
  _id: string;
  concept: string;
  amount: number;
  date: string;
  type: 'ingreso' | 'egreso';
  recipient: string;
  description: string;
}

export interface DashboardSummary {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly transfersService: TransfersService,
  ) {}

  async getDashboardData(userId: string) {
    // <-- usamos UserDocument para que TypeScript reconozca _id
    const user: UserDocument | null = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const transfers: Transfer[] = await this.transfersService.findAll(userId);

    // Mapear a objetos simples para frontend
    const movements: DashboardTransfer[] = transfers
      .sort((a, b) => {
        const dateA = a.createdAt?.getTime() ?? 0;
        const dateB = b.createdAt?.getTime() ?? 0;
        return dateB - dateA;
      })
      .slice(0, 10)
      .map((t) => ({
        _id: t._id.toString(),
        concept: t.concept,
        amount: t.amount,
        date: t.createdAt?.toISOString() ?? new Date().toISOString(),
        type: t.type,
        recipient: t.recipient,
        description: t.description ?? '',
      }));

    // Calcular resumen
    const summary: DashboardSummary = transfers.reduce(
      (acc, t) => {
        if (t.type === 'ingreso') acc.totalIngresos += t.amount;
        else acc.totalEgresos += t.amount;

        acc.balance += t.type === 'ingreso' ? t.amount : -t.amount;
        return acc;
      },
      { totalIngresos: 0, totalEgresos: 0, balance: 0 },
    );

    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      movements,
      summary,
    };
  }
}
