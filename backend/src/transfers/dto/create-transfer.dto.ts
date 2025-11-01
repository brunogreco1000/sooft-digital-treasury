import { IsString, IsNumber, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  recipient!: string;

  @IsString()
  @IsNotEmpty()
  concept!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsOptional()
  @IsIn(['ingreso', 'egreso'])
  type?: 'ingreso' | 'egreso';
}
