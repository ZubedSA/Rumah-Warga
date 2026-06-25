import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class SuperadminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalTenants: number;
        totalUsers: number;
        tenantsByType: {
            type: import(".prisma/client").$Enums.TenantType;
            count: number;
        }[];
    }>;
    getTenants(): Promise<({
        _count: {
            users: number;
            citizens: number;
        };
        subscriptions: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            planName: string;
            startDate: Date;
            endDate: Date;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.TenantType;
        code: string;
    })[]>;
    createTenant(data: {
        name: string;
        type: any;
        planName: string;
        durationMonths: number;
    }): Promise<{
        subscriptions: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            planName: string;
            startDate: Date;
            endDate: Date;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.TenantType;
        code: string;
    }>;
    updateTenant(id: string, data: {
        name?: string;
        type?: any;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.TenantType;
        code: string;
    }>;
    deleteTenant(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.TenantType;
        code: string;
    }>;
    updateTenantSubscription(tenantId: string, data: {
        planName?: string;
        additionalMonths?: number;
        isActive?: boolean;
    }): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        planName: string;
        startDate: Date;
        endDate: Date;
    }>;
    getAllUsers(): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        tenant: {
            name: string;
            type: import(".prisma/client").$Enums.TenantType;
        } | null;
    }[]>;
    updateUserRole(id: string, data: {
        role: any;
    }): Promise<{
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
    }>;
    deleteUser(id: string): Promise<{
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
    }>;
    getGlobalAuditLogs(): Promise<({
        user: {
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
        tenant: {
            name: string;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        userId: string;
        action: string;
        entity: string;
        entityId: string;
        oldValues: string | null;
        newValues: string | null;
    })[]>;
}
