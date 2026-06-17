import { SuperadminService } from './superadmin.service';
export declare class SuperadminController {
    private readonly superadminService;
    constructor(superadminService: SuperadminService);
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
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            tenantId: string;
            planName: string;
            startDate: Date;
            endDate: Date;
        }[];
    } & {
        id: string;
        code: string;
        name: string;
        type: import(".prisma/client").$Enums.TenantType;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createTenant(body: {
        name: string;
        type: any;
        planName: string;
        durationMonths: number;
    }): Promise<{
        subscriptions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            tenantId: string;
            planName: string;
            startDate: Date;
            endDate: Date;
        }[];
    } & {
        id: string;
        code: string;
        name: string;
        type: import(".prisma/client").$Enums.TenantType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTenant(id: string, body: {
        name?: string;
        type?: any;
    }): Promise<{
        id: string;
        code: string;
        name: string;
        type: import(".prisma/client").$Enums.TenantType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTenant(id: string): Promise<{
        id: string;
        code: string;
        name: string;
        type: import(".prisma/client").$Enums.TenantType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTenantSubscription(id: string, body: {
        planName?: string;
        additionalMonths?: number;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        tenantId: string;
        planName: string;
        startDate: Date;
        endDate: Date;
    }>;
    getAllUsers(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        tenant: {
            name: string;
            type: import(".prisma/client").$Enums.TenantType;
        } | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    updateUserRole(id: string, body: {
        role: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        email: string;
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
    }>;
    getGlobalAuditLogs(): Promise<({
        tenant: {
            name: string;
        };
        user: {
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string;
        action: string;
        entity: string;
        entityId: string;
        oldValues: string | null;
        newValues: string | null;
    })[]>;
}
