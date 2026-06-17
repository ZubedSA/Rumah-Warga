import { Module } from '@nestjs/common';
import { LettersService } from './letters.service';
import { LettersController } from './letters.controller';
import { LetterTemplatesService } from './letter-templates.service';
import { LetterTemplatesController } from './letter-templates.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [LettersController, LetterTemplatesController],
  providers: [LettersService, LetterTemplatesService],
})
export class LettersModule {}
