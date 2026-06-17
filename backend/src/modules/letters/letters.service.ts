import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { LetterStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LettersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(user: any, tenantId: string, createLetterDto: CreateLetterDto) {
    let citizenId = createLetterDto.citizenId;

    if (user.role === 'WARGA') {
      const citizen = await this.prisma.citizen.findUnique({
        where: { userId: user.id }
      });
      if (!citizen) {
        throw new NotFoundException('Data identitas warga tidak ditemukan');
      }
      citizenId = citizen.id;
    }
    // Ensure template exists to avoid foreign key constraint errors
    let template = await this.prisma.letterTemplate.findFirst({
      where: { id: createLetterDto.letterTemplateId, tenantId }
    });

    if (!template) {
      const templateNames: Record<string, string> = {
        'TEMPLATE_SKCK': 'Pengantar SKCK',
        'TEMPLATE_DOMISILI': 'Surat Keterangan Domisili',
        'TEMPLATE_USAHA': 'Surat Keterangan Usaha',
        'TEMPLATE_TIDAK_MAMPU': 'Surat Keterangan Tidak Mampu'
      };
      
      template = await this.prisma.letterTemplate.create({
        data: {
          id: createLetterDto.letterTemplateId,
          tenantId,
          name: templateNames[createLetterDto.letterTemplateId] || 'Surat Pengantar',
          content: 'Orang tersebut di atas benar-benar warga kami yang berdomisili di alamat tersebut. Surat keterangan ini dibuat sebagai syarat untuk keperluan: [Keperluan].',
        }
      });
    }

    const newLetter = await this.prisma.letter.create({
      data: {
        citizenId: citizenId,
        letterTemplateId: template.id,
        notes: createLetterDto.notes,
        tenantId,
        status: LetterStatus.PENDING,
      },
      include: {
        citizen: true,
      }
    });

    // Notify admins
    const admins = await this.prisma.user.findMany({
      where: { 
        tenantId, 
        role: { not: 'WARGA' } 
      },
    });
    
    for (const admin of admins) {
      const citizenName = newLetter.citizen?.name || 'Warga';
      await this.notificationsService.sendToUser(
        tenantId,
        admin.id,
        'Pengajuan Surat Baru',
        `${citizenName} telah mengajukan permohonan ${template.name}.`,
        { letterId: newLetter.id, type: 'LETTER_REQUEST' }
      );
    }

    return newLetter;
  }

  async findAll(user: any, tenantId: string) {
    let whereClause: any = { tenantId };
    
    if (user.role === 'WARGA') {
      whereClause.citizen = { userId: user.id };
    }

    return this.prisma.letter.findMany({
      where: whereClause,
      include: {
        citizen: true,
        template: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const letter = await this.prisma.letter.findFirst({
      where: { id, tenantId },
      include: { citizen: true, template: true },
    });
    if (!letter) throw new NotFoundException(`Letter ID ${id} not found`);
    return letter;
  }

  async update(tenantId: string, id: string, updateLetterDto: UpdateLetterDto) {
    await this.findOne(tenantId, id);
    return this.prisma.letter.update({
      where: { id },
      data: updateLetterDto,
    });
  }
}
