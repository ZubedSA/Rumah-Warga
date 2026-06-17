import { LettersService } from './letters.service';
import { CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
export declare class LettersController {
    private readonly lettersService;
    constructor(lettersService: LettersService);
    create(req: any, tenantId: string, createLetterDto: CreateLetterDto): Promise<{
        citizen: {
            id: string;
            tenantId: string;
            email: string | null;
            name: string;
            nik: string;
            phone: string | null;
            rt: string;
            rw: string;
            gender: import(".prisma/client").$Enums.Gender;
            birthPlace: string;
            birthDate: Date;
            createdAt: Date;
            updatedAt: Date;
            familyId: string | null;
            userId: string | null;
            religion: import(".prisma/client").$Enums.Religion;
            maritalStatus: import(".prisma/client").$Enums.MaritalStatus;
            occupation: string;
            isHeadOfFamily: boolean;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LetterStatus;
        citizenId: string;
        letterTemplateId: string;
        notes: string | null;
        letterNumber: string | null;
        pdfUrl: string | null;
    }>;
    findAll(req: any, tenantId: string): Promise<({
        citizen: {
            id: string;
            tenantId: string;
            email: string | null;
            name: string;
            nik: string;
            phone: string | null;
            rt: string;
            rw: string;
            gender: import(".prisma/client").$Enums.Gender;
            birthPlace: string;
            birthDate: Date;
            createdAt: Date;
            updatedAt: Date;
            familyId: string | null;
            userId: string | null;
            religion: import(".prisma/client").$Enums.Religion;
            maritalStatus: import(".prisma/client").$Enums.MaritalStatus;
            occupation: string;
            isHeadOfFamily: boolean;
            deletedAt: Date | null;
        };
        template: {
            id: string;
            tenantId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            isActive: boolean;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LetterStatus;
        citizenId: string;
        letterTemplateId: string;
        notes: string | null;
        letterNumber: string | null;
        pdfUrl: string | null;
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
        citizen: {
            id: string;
            tenantId: string;
            email: string | null;
            name: string;
            nik: string;
            phone: string | null;
            rt: string;
            rw: string;
            gender: import(".prisma/client").$Enums.Gender;
            birthPlace: string;
            birthDate: Date;
            createdAt: Date;
            updatedAt: Date;
            familyId: string | null;
            userId: string | null;
            religion: import(".prisma/client").$Enums.Religion;
            maritalStatus: import(".prisma/client").$Enums.MaritalStatus;
            occupation: string;
            isHeadOfFamily: boolean;
            deletedAt: Date | null;
        };
        template: {
            id: string;
            tenantId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            isActive: boolean;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LetterStatus;
        citizenId: string;
        letterTemplateId: string;
        notes: string | null;
        letterNumber: string | null;
        pdfUrl: string | null;
    }>;
    update(tenantId: string, id: string, updateLetterDto: UpdateLetterDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LetterStatus;
        citizenId: string;
        letterTemplateId: string;
        notes: string | null;
        letterNumber: string | null;
        pdfUrl: string | null;
    }>;
}
