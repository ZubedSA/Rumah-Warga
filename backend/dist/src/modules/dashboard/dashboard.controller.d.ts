import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStatistics(tenantId: string): Promise<{
        totalCitizens: number;
        totalFamilies: number;
        pendingLetters: number;
        completedLetters: number;
    }>;
}
