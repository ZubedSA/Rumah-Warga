import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateLetterTemplateDto } from './dto/create-letter-template.dto';
export declare class LetterTemplatesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, createDto: CreateLetterTemplateDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        isActive: boolean;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        isActive: boolean;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        isActive: boolean;
    }>;
    update(tenantId: string, id: string, updateDto: Partial<CreateLetterTemplateDto>): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        isActive: boolean;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        isActive: boolean;
    }>;
}
