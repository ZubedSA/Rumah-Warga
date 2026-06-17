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
exports.LetterTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let LetterTemplatesService = class LetterTemplatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, createDto) {
        return this.prisma.letterTemplate.create({
            data: {
                ...createDto,
                tenantId,
            },
        });
    }
    async findAll(tenantId) {
        return this.prisma.letterTemplate.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(tenantId, id) {
        const template = await this.prisma.letterTemplate.findFirst({
            where: { id, tenantId },
        });
        if (!template)
            throw new common_1.NotFoundException(`Template not found`);
        return template;
    }
    async update(tenantId, id, updateDto) {
        await this.findOne(tenantId, id);
        return this.prisma.letterTemplate.update({
            where: { id },
            data: updateDto,
        });
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        return this.prisma.letterTemplate.delete({
            where: { id },
        });
    }
};
exports.LetterTemplatesService = LetterTemplatesService;
exports.LetterTemplatesService = LetterTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LetterTemplatesService);
//# sourceMappingURL=letter-templates.service.js.map