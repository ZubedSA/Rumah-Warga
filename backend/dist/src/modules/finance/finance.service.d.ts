import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    getSummary(tenantId: string): Promise<{
        balance: number;
        totalIncomeMonth: number;
        totalExpenseMonth: number;
        totalDuesMonth: number;
        totalArrears: number;
        transactionCountMonth: number;
    }>;
    getTransactions(tenantId: string, type?: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        amount: number;
        description: string;
        category: string;
        proofUrl: string | null;
        date: Date;
        transactionNumber: string | null;
    }[]>;
    createTransaction(tenantId: string, data: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        amount: number;
        description: string;
        category: string;
        proofUrl: string | null;
        date: Date;
        transactionNumber: string | null;
    }>;
    getDues(tenantId: string): Promise<({
        citizens: {
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
        }[];
        dues: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.DueType;
            amount: number;
            familyId: string;
            title: string;
            dueDate: Date;
            isPaid: boolean;
        }[];
    } & {
        id: string;
        tenantId: string;
        address: string;
        rt: string;
        rw: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        noKk: string;
    })[]>;
    updateTransaction(tenantId: string, id: string, data: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        amount: number;
        description: string;
        category: string;
        proofUrl: string | null;
        date: Date;
        transactionNumber: string | null;
    }>;
    deleteTransaction(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        amount: number;
        description: string;
        category: string;
        proofUrl: string | null;
        date: Date;
        transactionNumber: string | null;
    }>;
}
