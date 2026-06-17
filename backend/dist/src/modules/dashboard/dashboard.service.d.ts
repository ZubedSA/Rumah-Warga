import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStatistics(tenantId: string): Promise<{
        totalCitizens: number;
        totalFamilies: number;
        pendingLetters: number;
        completedLetters: number;
    }>;
}
