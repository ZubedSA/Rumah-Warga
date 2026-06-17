import { OnboardingService } from './onboarding.service';
export declare class OnboardingController {
    private readonly onboardingService;
    constructor(onboardingService: OnboardingService);
    getTenants(): Promise<{
        id: string;
        name: string;
        code: string;
    }[]>;
    createRt(req: any, profileData: any): Promise<{
        message: string;
        tenant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.TenantType;
            code: string;
        };
        accessToken: string;
        user: {
            id: string;
            tenantId: string | null;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            avatarUrl: string | null;
            isOnboarded: boolean;
            nik: string | null;
            phone: string | null;
            address: string | null;
            provinceId: string | null;
            provinceName: string | null;
            regencyId: string | null;
            regencyName: string | null;
            districtId: string | null;
            districtName: string | null;
            villageId: string | null;
            villageName: string | null;
            rt: string | null;
            rw: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            birthPlace: string | null;
            birthDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    joinRt(req: any, code: string, nik: string): Promise<{
        message: string;
        tenant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.TenantType;
            code: string;
        };
        accessToken: string;
        user: {
            id: string;
            tenantId: string | null;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            avatarUrl: string | null;
            isOnboarded: boolean;
            nik: string | null;
            phone: string | null;
            address: string | null;
            provinceId: string | null;
            provinceName: string | null;
            regencyId: string | null;
            regencyName: string | null;
            districtId: string | null;
            districtName: string | null;
            villageId: string | null;
            villageName: string | null;
            rt: string | null;
            rw: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            birthPlace: string | null;
            birthDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
