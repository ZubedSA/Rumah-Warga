import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { FirebaseModule } from './infrastructure/firebase/firebase.module';
import { AuthModule } from './modules/auth/auth.module';
import { CitizensModule } from './modules/citizens/citizens.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LettersModule } from './modules/letters/letters.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { FinanceModule } from './modules/finance/finance.module';
import { SuperadminModule } from './modules/superadmin/superadmin.module';

@Module({
  imports: [
    PrismaModule,
    FirebaseModule,
    AuthModule,
    CitizensModule,
    DashboardModule,
    FinanceModule,
    LettersModule,
    NotificationsModule,
    OnboardingModule,
    SuperadminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
