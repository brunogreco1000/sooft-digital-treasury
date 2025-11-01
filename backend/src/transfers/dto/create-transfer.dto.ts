import { IsString, IsNumber, IsNotEmpty, IsOptional, IsIn, IsDateString } from 'class-validator';

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

  @IsOptional()
  @IsIn(['ingreso', 'egreso'])
  type?: 'ingreso' | 'egreso';

  @IsOptional()
  @IsDateString() // <- acepta string ISO
  date?: string;

  @IsOptional()
  @IsString()
  status?: 'pendiente' | 'aprobado' | 'fallido';

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
