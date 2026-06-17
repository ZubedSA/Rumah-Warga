import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(tenantId: string, user: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        type: string;
        title: string;
        userId: string;
        message: string;
        isRead: boolean;
    }[]>;
    markAsRead(tenantId: string, id: string, user: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
