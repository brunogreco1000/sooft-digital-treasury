// backend/payments/payments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

  async create(userId: string, dto: CreatePaymentDto): Promise<Payment> {
    const payment = new this.paymentModel({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
    return payment.save();
  }

  async findAll(userId: string): Promise<Payment[]> {
    return this.paymentModel.find({ userId }).sort({ date: -1 }).exec();
  }

  async findById(userId: string, paymentId: string): Promise<Payment> {
    const payment = await this.paymentModel.findOne({ _id: paymentId, userId }).exec();
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async delete(userId: string, paymentId: string): Promise<void> {
    const result = await this.paymentModel.deleteOne({ _id: paymentId, userId }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Payment not found');
  }
}
