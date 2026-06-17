import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';

@Injectable()
export class CitizensService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createCitizenDto: CreateCitizenDto) {
    return this.prisma.citizen.create({
      data: {
        ...createCitizenDto,
        birthDate: new Date(createCitizenDto.birthDate),
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.citizen.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const citizen = await this.prisma.citizen.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { family: true },
    });
    
    if (!citizen) {
      throw new NotFoundException(`Citizen with ID ${id} not found`);
    }
    return citizen;
  }

  async update(tenantId: string, id: string, updateCitizenDto: UpdateCitizenDto) {
    await this.findOne(tenantId, id); 
    
    const data: any = { ...updateCitizenDto };
    if (data.birthDate) {
      data.birthDate = new Date(data.birthDate);
    }

    const updatedCitizen = await this.prisma.citizen.update({
      where: { id },
      data,
    });

    if (updatedCitizen.userId && data.phone !== undefined) {
      await this.prisma.user.update({
        where: { id: updatedCitizen.userId },
        data: { phone: data.phone },
      });
    }

    return updatedCitizen;
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.citizen.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
