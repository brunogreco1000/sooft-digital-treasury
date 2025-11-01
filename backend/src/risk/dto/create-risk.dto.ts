import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRiskDto {
  @IsNumber()
  score?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
