import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateLetterTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
