// src/portfolio/dto/create-portfolio.dto.ts
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  initialAmount!: number;

  @IsString()
  @IsOptional()
  currency?: string;
}
