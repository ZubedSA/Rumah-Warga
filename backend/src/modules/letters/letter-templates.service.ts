import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateLetterTemplateDto } from './dto/create-letter-template.dto';

@Injectable()
export class LetterTemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createDto: CreateLetterTemplateDto) {
    return this.prisma.letterTemplate.create({
      data: {
        ...createDto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.letterTemplate.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const template = await this.prisma.letterTemplate.findFirst({
      where: { id, tenantId },
    });
    if (!template) throw new NotFoundException(`Template not found`);
    return template;
  }

  async update(tenantId: string, id: string, updateDto: Partial<CreateLetterTemplateDto>) {
    await this.findOne(tenantId, id);
    return this.prisma.letterTemplate.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.letterTemplate.delete({
      where: { id },
    });
  }
}
