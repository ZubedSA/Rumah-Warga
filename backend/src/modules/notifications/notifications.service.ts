import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private firebase: FirebaseService,
  ) {}

  async sendToUser(tenantId: string, userId: string, title: string, body: string, data?: any) {
    const notification = await this.prisma.notification.create({
      data: {
        tenantId,
        userId,
        title,
        message: body,
        type: data ? JSON.stringify(data) : 'INFO',
      },
    });

    const tokens = await this.prisma.deviceToken.findMany({
      where: { userId },
      select: { fcmToken: true },
    });

    if (tokens.length > 0) {
      try {
        const fcmTokens = tokens.map((t) => t.fcmToken);
        await getMessaging().sendEachForMulticast({
          tokens: fcmTokens,
          notification: { title, body },
          data,
        });
      } catch (error) {
        console.error('Failed to send FCM', error);
      }
    }

    return notification;
  }

  async getMyNotifications(tenantId: string, userId: string) {
    return this.prisma.notification.findMany({
      where: { tenantId, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(tenantId: string, id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, tenantId, userId },
      data: { isRead: true },
    });
  }
}
