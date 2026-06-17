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
exports.LettersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
let LettersService = class LettersService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(user, tenantId, createLetterDto) {
        let citizenId = createLetterDto.citizenId;
        if (user.role === 'WARGA') {
            const citizen = await this.prisma.citizen.findUnique({
                where: { userId: user.id }
            });
            if (!citizen) {
                throw new common_1.NotFoundException('Data identitas warga tidak ditemukan');
            }
            citizenId = citizen.id;
        }
        let template = await this.prisma.letterTemplate.findFirst({
            where: { id: createLetterDto.letterTemplateId, tenantId }
        });
        if (!template) {
            const templateNames = {
                'TEMPLATE_SKCK': 'Pengantar SKCK',
                'TEMPLATE_DOMISILI': 'Surat Keterangan Domisili',
                'TEMPLATE_USAHA': 'Surat Keterangan Usaha',
                'TEMPLATE_TIDAK_MAMPU': 'Surat Keterangan Tidak Mampu'
            };
            template = await this.prisma.letterTemplate.create({
                data: {
                    id: createLetterDto.letterTemplateId,
                    tenantId,
                    name: templateNames[createLetterDto.letterTemplateId] || 'Surat Pengantar',
                    content: 'Orang tersebut di atas benar-benar warga kami yang berdomisili di alamat tersebut. Surat keterangan ini dibuat sebagai syarat untuk keperluan: [Keperluan].',
                }
            });
        }
        const newLetter = await this.prisma.letter.create({
            data: {
                citizenId: citizenId,
                letterTemplateId: template.id,
                notes: createLetterDto.notes,
                tenantId,
                status: client_1.LetterStatus.PENDING,
            },
            include: {
                citizen: true,
            }
        });
        const admins = await this.prisma.user.findMany({
            where: {
                tenantId,
                role: { not: 'WARGA' }
            },
        });
        for (const admin of admins) {
            const citizenName = newLetter.citizen?.name || 'Warga';
            await this.notificationsService.sendToUser(tenantId, admin.id, 'Pengajuan Surat Baru', `${citizenName} telah mengajukan permohonan ${template.name}.`, { letterId: newLetter.id, type: 'LETTER_REQUEST' });
        }
        return newLetter;
    }
    async findAll(user, tenantId) {
        let whereClause = { tenantId };
        if (user.role === 'WARGA') {
            whereClause.citizen = { userId: user.id };
        }
        return this.prisma.letter.findMany({
            where: whereClause,
            include: {
                citizen: true,
                template: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(tenantId, id) {
        const letter = await this.prisma.letter.findFirst({
            where: { id, tenantId },
            include: { citizen: true, template: true },
        });
        if (!letter)
            throw new common_1.NotFoundException(`Letter ID ${id} not found`);
        return letter;
    }
    async update(tenantId, id, updateLetterDto) {
        await this.findOne(tenantId, id);
        return this.prisma.letter.update({
            where: { id },
            data: updateLetterDto,
        });
    }
};
exports.LettersService = LettersService;
exports.LettersService = LettersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], LettersService);
//# sourceMappingURL=letters.service.js.map