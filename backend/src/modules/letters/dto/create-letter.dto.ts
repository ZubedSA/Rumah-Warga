import { IsString, IsOptional } from 'class-validator';

export class CreateLetterDto {
  @IsString()
  citizenId: string;

  @IsString()
  letterTemplateId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
