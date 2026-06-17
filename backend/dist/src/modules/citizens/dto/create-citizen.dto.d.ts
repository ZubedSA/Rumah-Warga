import { Gender, Religion, MaritalStatus } from '@prisma/client';
export declare class CreateCitizenDto {
    familyId?: string;
    nik: string;
    name: string;
    gender: Gender;
    birthPlace: string;
    birthDate: string;
    religion: Religion;
    maritalStatus: MaritalStatus;
    occupation: string;
    phone?: string;
    email?: string;
    isHeadOfFamily?: boolean;
    rt: string;
    rw: string;
}
