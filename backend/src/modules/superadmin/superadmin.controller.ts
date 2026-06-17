import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Get('stats')
  getDashboardStats() {
    return this.superadminService.getDashboardStats();
  }

  @Get('tenants')
  getTenants() {
    return this.superadminService.getTenants();
  }

  @Post('tenants')
  createTenant(@Body() body: { name: string; type: any; planName: string; durationMonths: number }) {
    return this.superadminService.createTenant(body);
  }

  @Patch('tenants/:id')
  updateTenant(@Param('id') id: string, @Body() body: { name?: string; type?: any }) {
    return this.superadminService.updateTenant(id, body);
  }

  @Delete('tenants/:id')
  deleteTenant(@Param('id') id: string) {
    return this.superadminService.deleteTenant(id);
  }
  @Patch('tenants/:id/subscription')
  updateTenantSubscription(
    @Param('id') id: string, 
    @Body() body: { planName?: string; additionalMonths?: number; isActive?: boolean }
  ) {
    return this.superadminService.updateTenantSubscription(id, body);
  }

  @Get('users')
  getAllUsers() {
    return this.superadminService.getAllUsers();
  }

  @Patch('users/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: string }
  ) {
    return this.superadminService.updateUserRole(id, body);
  }

  @Get('logs')
  getGlobalAuditLogs() {
    return this.superadminService.getGlobalAuditLogs();
  }
}
