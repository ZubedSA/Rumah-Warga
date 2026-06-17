import { LetterTemplatesService } from './letter-templates.service';
import { CreateLetterTemplateDto } from './dto/create-letter-template.dto';
export declare class LetterTemplatesController {
    private readonly letterTemplatesService;
    constructor(letterTemplatesService: LetterTemplatesService);
    create(tenantId: string, createLetterTemplateDto: CreateLetterTemplateDto): Promise<{
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
    update(tenantId: string, id: string, updateLetterTemplateDto: Partial<CreateLetterTemplateDto>): Promise<{
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
