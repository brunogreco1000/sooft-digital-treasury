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

  _id!: Types.ObjectId; // <-- importante para TypeScript
  createdAt?: Date;
  updatedAt?: Date;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
