import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RiskDocument = Risk & Document;

@Schema({ timestamps: true })
export class Risk {
  @Prop({ required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  riskLevel!: 'Bajo' | 'Medio' | 'Alto';

  @Prop({ required: true })
  category!: string;

  @Prop()
  notes?: string;

  _id!: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export const RiskSchema = SchemaFactory.createForClass(Risk);
