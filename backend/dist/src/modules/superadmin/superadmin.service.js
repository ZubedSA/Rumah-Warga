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
exports.SuperadminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let SuperadminService = class SuperadminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const totalTenants = await this.prisma.tenant.count();
        const totalUsers = await this.prisma.user.count();
        const tenantsByType = await this.prisma.tenant.groupBy({
            by: ['type'],
            _count: {
                id: true,
            },
        });
        return {
            totalTenants,
            totalUsers,
            tenantsByType: tenantsByType.map(t => ({
                type: t.type,
                count: t._count.id
            }))
        };
    }
    async getTenants() {
        return this.prisma.tenant.findMany({
            include: {
                _count: {
                    select: { users: true, citizens: true },
                },
                subscriptions: {
                    where: { isActive: true },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createTenant(data) {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + data.durationMonths);
        return this.prisma.tenant.create({
            data: {
                name: data.name,
                type: data.type,
                subscriptions: {
                    create: {
                        planName: data.planName,
                        startDate: new Date(),
                        endDate: endDate,
                        isActive: true
                    }
                }
            },
            include: {
                subscriptions: true
            }
        });
    }
    async updateTenant(id, data) {
        return this.prisma.tenant.update({
            where: { id },
            data: {
                name: data.name,
                type: data.type
            }
        });
    }
    async deleteTenant(id) {
        return this.prisma.tenant.delete({
            where: { id }
        });
    }
    async updateTenantSubscription(tenantId, data) {
        let subscription = await this.prisma.subscription.findFirst({
            where: { tenantId, isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        if (!subscription) {
            subscription = await this.prisma.subscription.create({
                data: {
                    tenantId,
                    planName: data.planName || 'FREE',
                    startDate: new Date(),
                    endDate: new Date(),
                    isActive: true
                }
            });
        }
        const updates = {};
        if (data.planName)
            updates.planName = data.planName;
        if (data.isActive !== undefined)
            updates.isActive = data.isActive;
        if (data.additionalMonths) {
            const currentEndDate = new Date(subscription.endDate);
            const newEndDate = currentEndDate < new Date() ? new Date() : currentEndDate;
            newEndDate.setMonth(newEndDate.getMonth() + data.additionalMonths);
            updates.endDate = newEndDate;
        }
        return this.prisma.subscription.update({
            where: { id: subscription.id },
            data: updates
        });
    }
    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                tenant: {
                    select: { name: true, type: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 200
        });
    }
    async updateUserRole(id, data) {
        return this.prisma.user.update({
            where: { id },
            data: {
                role: data.role
            }
        });
    }
    async getGlobalAuditLogs() {
        return this.prisma.auditLog.findMany({
            include: {
                user: { select: { name: true, role: true } },
                tenant: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    }
};
exports.SuperadminService = SuperadminService;
exports.SuperadminService = SuperadminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuperadminService);
//# sourceMappingURL=superadmin.service.js.map