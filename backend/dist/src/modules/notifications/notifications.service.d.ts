import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
export declare class NotificationsService {
    private prisma;
    private firebase;
    constructor(prisma: PrismaService, firebase: FirebaseService);
    sendToUser(tenantId: string, userId: string, title: string, body: string, data?: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        type: string;
        title: string;
        userId: string;
        message: string;
        isRead: boolean;
    }>;
    getMyNotifications(tenantId: string, userId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        type: string;
        title: string;
        userId: string;
        message: string;
        isRead: boolean;
    }[]>;
    markAsRead(tenantId: string, id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
