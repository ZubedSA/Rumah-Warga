import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class SuperadminService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createTenant(data: { name: string; type: any; planName: string; durationMonths: number }) {
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

  async updateTenant(id: string, data: { name?: string; type?: any }) {
    return this.prisma.tenant.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type
      }
    });
  }

  async deleteTenant(id: string) {
    return this.prisma.tenant.delete({
      where: { id }
    });
  }

  async updateTenantSubscription(tenantId: string, data: { planName?: string; additionalMonths?: number; isActive?: boolean }) {
    // Cari langganan aktif
    let subscription = await this.prisma.subscription.findFirst({
      where: { tenantId, isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!subscription) {
       // Buat baru jika tidak ada
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

    const updates: any = {};
    if (data.planName) updates.planName = data.planName;
    if (data.isActive !== undefined) updates.isActive = data.isActive;

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
      take: 200 // Limit for now to avoid huge payload
    });
  }

  async updateUserRole(id: string, data: { role: any }) {
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
}
