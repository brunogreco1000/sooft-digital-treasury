import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RiskDocument = Risk & Document;

@Schema({ timestamps: true })
export class Risk {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  score?: number;

  @Prop({ default: '' })
  notes?: string;
}

export const RiskSchema = SchemaFactory.createForClass(Risk);
