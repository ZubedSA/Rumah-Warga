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
exports.CitizensService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let CitizensService = class CitizensService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, createCitizenDto) {
        return this.prisma.citizen.create({
            data: {
                ...createCitizenDto,
                birthDate: new Date(createCitizenDto.birthDate),
                tenantId,
            },
        });
    }
    async findAll(tenantId) {
        return this.prisma.citizen.findMany({
            where: { tenantId, deletedAt: null },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(tenantId, id) {
        const citizen = await this.prisma.citizen.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: { family: true },
        });
        if (!citizen) {
            throw new common_1.NotFoundException(`Citizen with ID ${id} not found`);
        }
        return citizen;
    }
    async update(tenantId, id, updateCitizenDto) {
        await this.findOne(tenantId, id);
        const data = { ...updateCitizenDto };
        if (data.birthDate) {
            data.birthDate = new Date(data.birthDate);
        }
        const updatedCitizen = await this.prisma.citizen.update({
            where: { id },
            data,
        });
        if (updatedCitizen.userId && data.phone !== undefined) {
            await this.prisma.user.update({
                where: { id: updatedCitizen.userId },
                data: { phone: data.phone },
            });
        }
        return updatedCitizen;
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        return this.prisma.citizen.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.CitizensService = CitizensService;
exports.CitizensService = CitizensService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CitizensService);
//# sourceMappingURL=citizens.service.js.map