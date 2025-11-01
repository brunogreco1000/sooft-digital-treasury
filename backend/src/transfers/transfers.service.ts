import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transfer } from './schemas/transfer.schema';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(@InjectModel(Transfer.name) private readonly transferModel: Model<Transfer>) {}

  async create(userId: string, dto: CreateTransferDto) {
    const created = new this.transferModel({ ...dto, userId });
    return created.save();
  }

  async findAll(userId: string) {
    return this.transferModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findById(userId: string, id: string) {
    const transfer = await this.transferModel.findById(id);
    if (!transfer) throw new NotFoundException('Transferencia no encontrada');
    if (transfer.userId !== userId) throw new ForbiddenException('No autorizado');
    return transfer;
  }

  async delete(userId: string, id: string) {
    const transfer = await this.transferModel.findById(id);
    if (!transfer) throw new NotFoundException('Transferencia no encontrada');
    if (transfer.userId !== userId) throw new ForbiddenException('No autorizado');
    await transfer.deleteOne();
    return { message: 'Transferencia eliminada correctamente' };
  }
}
