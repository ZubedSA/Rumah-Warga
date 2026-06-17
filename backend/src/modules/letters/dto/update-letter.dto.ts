import { PartialType } from '@nestjs/mapped-types';
import { CreateLetterDto } from './create-letter.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LetterStatus } from '@prisma/client';

export class UpdateLetterDto extends PartialType(CreateLetterDto) {
  @IsOptional()
  @IsEnum(LetterStatus)
  status?: LetterStatus;

  @IsOptional()
  @IsString()
  letterNumber?: string;

  @IsOptional()
  @IsString()
  pdfUrl?: string;
}
