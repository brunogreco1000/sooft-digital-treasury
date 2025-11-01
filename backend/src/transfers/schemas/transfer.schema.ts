import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Transfer extends Document {
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

  @Prop({ enum: ['ingreso', 'egreso'], default: 'egreso' })
  type!: 'ingreso' | 'egreso';
}


export const TransferSchema = SchemaFactory.createForClass(Transfer);
