// backend/payments/schemas/payment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId; // Usuario que realiza el pago

  @Prop({ required: true })
  amount!: number; // Monto del pago

  @Prop({ required: true })
  concept!: string; // Concepto o descripción del pago

  @Prop({ required: true })
  date!: Date; // Fecha del pago

  @Prop({ default: 'pending', enum: ['pending', 'completed', 'failed'] })
  status!: string; // Estado del pago

  @Prop()
  recipient?: string; // Beneficiario del pago

  @Prop()
  notes?: string; // Notas adicionales
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
