"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
let OnboardingService = class OnboardingService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async getTenants() {
        return this.prisma.tenant.findMany({
            where: { type: 'RT' },
            select: { id: true, name: true, code: true }
        });
    }
    async createRt(userId, profileData) {
        if (!profileData.rt || !profileData.rw || !profileData.villageName) {
            throw new common_1.BadRequestException('Data wilayah (RT/RW/Desa) tidak lengkap');
        }
        const name = `RT ${profileData.rt} / RW ${profileData.rw} ${profileData.villageName}`;
        const tenant = await this.prisma.tenant.create({
            data: {
                name,
                type: 'RT'
            }
        });
        const updateData = {
            tenantId: tenant.id,
            role: 'SUPER_ADMIN',
            isOnboarded: true
        };
        if (profileData) {
            if (profileData.fullName)
                updateData.name = profileData.fullName;
            if (profileData.nik)
                updateData.nik = profileData.nik;
            if (profileData.phone)
                updateData.phone = profileData.phone;
            if (profileData.address)
                updateData.address = profileData.address;
            if (profileData.provinceId)
                updateData.provinceId = profileData.provinceId;
            if (profileData.provinceName)
                updateData.provinceName = profileData.provinceName;
            if (profileData.regencyId)
                updateData.regencyId = profileData.regencyId;
            if (profileData.regencyName)
                updateData.regencyName = profileData.regencyName;
            if (profileData.districtId)
                updateData.districtId = profileData.districtId;
            if (profileData.districtName)
                updateData.districtName = profileData.districtName;
            if (profileData.villageId)
                updateData.villageId = profileData.villageId;
            if (profileData.villageName)
                updateData.villageName = profileData.villageName;
            if (profileData.rt)
                updateData.rt = profileData.rt;
            if (profileData.rw)
                updateData.rw = profileData.rw;
            if (profileData.gender)
                updateData.gender = profileData.gender;
            if (profileData.birthPlace)
                updateData.birthPlace = profileData.birthPlace;
            if (profileData.birthDate)
                updateData.birthDate = new Date(profileData.birthDate);
        }
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: updateData
        });
        const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId, isOnboarded: user.isOnboarded };
        const accessToken = this.jwtService.sign(payload);
        return {
            message: 'RT berhasil dibuat',
            tenant,
            accessToken,
            user
        };
    }
    async joinRt(userId, code, nik) {
        if (!code) {
            throw new common_1.BadRequestException('Kode RT tidak boleh kosong');
        }
        if (!nik) {
            throw new common_1.BadRequestException('NIK tidak boleh kosong');
        }
        const tenant = await this.prisma.tenant.findUnique({
            where: { code }
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Kode RT tidak ditemukan');
        }
        const citizen = await this.prisma.citizen.findFirst({
            where: {
                nik,
                tenantId: tenant.id
            }
        });
        if (!citizen) {
            throw new common_1.NotFoundException('Data NIK Anda belum didaftarkan oleh Pengurus RT. Silakan hubungi RT Anda terlebih dahulu.');
        }
        await this.prisma.citizen.update({
            where: { id: citizen.id },
            data: { userId }
        });
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                tenantId: tenant.id,
                role: 'WARGA',
                nik,
                isOnboarded: true
            }
        });
        const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId, isOnboarded: user.isOnboarded };
        const accessToken = this.jwtService.sign(payload);
        return {
            message: 'Berhasil bergabung dengan RT',
            tenant,
            accessToken,
            user
        };
    }
};
exports.OnboardingService = OnboardingService;
exports.OnboardingService = OnboardingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], OnboardingService);
//# sourceMappingURL=onboarding.service.js.map