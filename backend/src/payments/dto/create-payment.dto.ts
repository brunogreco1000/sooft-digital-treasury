// backend/payments/dto/create-payment.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount!: number;

  @IsString()
  concept!: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  recipient?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
