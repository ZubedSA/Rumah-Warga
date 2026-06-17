import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class OnboardingService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    getTenants(): Promise<{
        id: string;
        name: string;
        code: string;
    }[]>;
    createRt(userId: string, profileData: {
        nik?: string;
        fullName?: string;
        phone?: string;
        address?: string;
        provinceId?: string;
        provinceName?: string;
        regencyId?: string;
        regencyName?: string;
        districtId?: string;
        districtName?: string;
        villageId?: string;
        villageName?: string;
        rt?: string;
        rw?: string;
        gender?: 'LAKI_LAKI' | 'PEREMPUAN';
        birthPlace?: string;
        birthDate?: string | Date;
    }): Promise<{
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
    joinRt(userId: string, code: string, nik: string): Promise<{
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
