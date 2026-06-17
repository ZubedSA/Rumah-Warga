import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('summary')
  getSummary(@Request() req: any) {
    // Both super admin and tenant users can see it, but tenant users are limited to their tenantId
    const tenantId = req.user.tenantId; // Assume user has tenantId if not super admin
    // If super admin wants global summary, we handle it, but for now focus on tenant
    return this.financeService.getSummary(tenantId);
  }

  @Get('test-summary')
  async testSummary(@Query('tenantId') tenantId: string) {
    try {
      return await this.financeService.getSummary(tenantId);
    } catch (e: any) {
      return { error: e.message, stack: e.stack };
    }
  }

  @Get('transactions')
  getTransactions(@Request() req: any, @Query('type') type?: string) {
    return this.financeService.getTransactions(req.user.tenantId, type);
  }

  @Post('transactions')
  createTransaction(@Request() req: any, @Body() body: any) {
    // Additional role check: only RT/RW/Bendahara should do this
    return this.financeService.createTransaction(req.user.tenantId, body);
  }

  @Patch('transactions/:id')
  updateTransaction(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.financeService.updateTransaction(req.user.tenantId, id, body);
  }

  @Delete('transactions/:id')
  deleteTransaction(@Request() req: any, @Param('id') id: string) {
    return this.financeService.deleteTransaction(req.user.tenantId, id);
  }

  @Get('dues')
  getDues(@Request() req: any) {
    return this.financeService.getDues(req.user.tenantId);
  }
}
