import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransferDocument = Transfer & Document;

@Schema({ timestamps: true })
export class Transfer {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  recipient!: string;

  @Prop({ required: true })
  concept!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true, enum: ['ingreso', 'egreso'] })
  type!: 'ingreso' | 'egreso';

  @Prop({ default: () => new Date() })
  date?: Date;

  @Prop({ default: 'pendiente', enum: ['pendiente', 'aprobado', 'fallido'] })
  status?: 'pendiente' | 'aprobado' | 'fallido';

  @Prop()
  reference?: string; // identificador único o número de transacción

  @Prop()
  notes?: string;

  _id!: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
