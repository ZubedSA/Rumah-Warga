import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser } from '../../common/decorators/tenant.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getMyNotifications(@TenantId() tenantId: string, @CurrentUser() user: any) {
    return this.notificationsService.getMyNotifications(tenantId, user.id);
  }

  @Patch(':id/read')
  markAsRead(@TenantId() tenantId: string, @Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(tenantId, id, user.id);
  }
}
