// src/portfolio/schemas/portfolio.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ required: true, min: 0 })
  initialAmount!: number;

  @Prop({ default: 'ARS' })
  currency!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
