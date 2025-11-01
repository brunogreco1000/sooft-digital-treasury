import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateRiskDto {
  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Bajo', 'Medio', 'Alto'])
  riskLevel!: 'Bajo' | 'Medio' | 'Alto';

  @IsString()
  @IsOptional()
  notes?: string;
}
