import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { LetterStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatistics(tenantId: string) {
    const totalCitizens = await this.prisma.citizen.count({ where: { tenantId, deletedAt: null } });
    const totalFamilies = await this.prisma.family.count({ where: { tenantId, deletedAt: null } });
    const pendingLetters = await this.prisma.letter.count({
      where: { tenantId, status: LetterStatus.PENDING },
    });
    const completedLetters = await this.prisma.letter.count({
      where: { tenantId, status: LetterStatus.COMPLETED },
    });

    return {
      totalCitizens,
      totalFamilies,
      pendingLetters,
      completedLetters,
    };
  }
}
