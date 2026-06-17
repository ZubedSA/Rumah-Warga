import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly firebase;
    constructor(prisma: PrismaService, jwtService: JwtService, firebase: FirebaseService);
    loginWithFirebase(idToken: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            tenantId: string | null;
            isOnboarded: boolean;
        };
    }>;
    getProfile(userId: string): Promise<{
        tenant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.TenantType;
            code: string;
        } | null;
        citizen: ({
            family: {
                id: string;
                tenantId: string;
                address: string;
                rt: string;
                rw: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                noKk: string;
            } | null;
        } & {
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
        }) | null;
    } & {
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
    updateProfile(userId: string, phone: string): Promise<{
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
}
