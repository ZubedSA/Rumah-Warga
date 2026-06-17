import { IsString, IsEnum, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { Gender, Religion, MaritalStatus } from '@prisma/client';

export class CreateCitizenDto {
  @IsOptional()
  @IsString()
  familyId?: string;

  @IsString()
  nik: string;

  @IsString()
  name: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  birthPlace: string;

  @IsDateString()
  birthDate: string;

  @IsEnum(Religion)
  religion: Religion;

  @IsEnum(MaritalStatus)
  maritalStatus: MaritalStatus;

  @IsString()
  occupation: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isHeadOfFamily?: boolean;

  @IsString()
  rt: string;

  @IsString()
  rw: string;
}
