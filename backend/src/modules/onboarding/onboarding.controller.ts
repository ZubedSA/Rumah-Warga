import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('tenants')
  getTenants() {
    return this.onboardingService.getTenants();
  }

  @Post('create-rt')
  createRt(
    @Req() req: any, 
    @Body('profileData') profileData: any
  ) {
    return this.onboardingService.createRt(req.user.id, profileData);
  }

  @Post('join-rt')
  joinRt(@Req() req: any, @Body('code') code: string, @Body('nik') nik: string) {
    return this.onboardingService.joinRt(req.user.id, code, nik);
  }
}
