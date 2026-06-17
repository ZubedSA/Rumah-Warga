import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OnboardingService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async getTenants() {
    return this.prisma.tenant.findMany({
      where: { type: 'RT' },
      select: { id: true, name: true, code: true }
    });
  }

  async createRt(
    userId: string, 
    profileData: {
      nik?: string;
      fullName?: string;
      phone?: string;
      address?: string;
      provinceId?: string;
      provinceName?: string;
      regencyId?: string;
      regencyName?: string;
      districtId?: string;
      districtName?: string;
      villageId?: string;
      villageName?: string;
      rt?: string;
      rw?: string;
      gender?: 'LAKI_LAKI' | 'PEREMPUAN';
      birthPlace?: string;
      birthDate?: string | Date;
    }
  ) {
    if (!profileData.rt || !profileData.rw || !profileData.villageName) {
      throw new BadRequestException('Data wilayah (RT/RW/Desa) tidak lengkap');
    }

    const name = `RT ${profileData.rt} / RW ${profileData.rw} ${profileData.villageName}`;

    const tenant = await this.prisma.tenant.create({
      data: {
        name,
        type: 'RT'
      }
    });

    const updateData: any = {
      tenantId: tenant.id,
      role: 'SUPER_ADMIN',
      isOnboarded: true
    };

    if (profileData) {
      if (profileData.fullName) updateData.name = profileData.fullName;
      if (profileData.nik) updateData.nik = profileData.nik;
      if (profileData.phone) updateData.phone = profileData.phone;
      if (profileData.address) updateData.address = profileData.address;
      if (profileData.provinceId) updateData.provinceId = profileData.provinceId;
      if (profileData.provinceName) updateData.provinceName = profileData.provinceName;
      if (profileData.regencyId) updateData.regencyId = profileData.regencyId;
      if (profileData.regencyName) updateData.regencyName = profileData.regencyName;
      if (profileData.districtId) updateData.districtId = profileData.districtId;
      if (profileData.districtName) updateData.districtName = profileData.districtName;
      if (profileData.villageId) updateData.villageId = profileData.villageId;
      if (profileData.villageName) updateData.villageName = profileData.villageName;
      if (profileData.rt) updateData.rt = profileData.rt;
      if (profileData.rw) updateData.rw = profileData.rw;
      if (profileData.gender) updateData.gender = profileData.gender;
      if (profileData.birthPlace) updateData.birthPlace = profileData.birthPlace;
      if (profileData.birthDate) updateData.birthDate = new Date(profileData.birthDate);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId, isOnboarded: user.isOnboarded };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'RT berhasil dibuat',
      tenant,
      accessToken,
      user
    };
  }

  async joinRt(userId: string, code: string, nik: string) {
    if (!code) {
      throw new BadRequestException('Kode RT tidak boleh kosong');
    }
    if (!nik) {
      throw new BadRequestException('NIK tidak boleh kosong');
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { code }
    });

    if (!tenant) {
      throw new NotFoundException('Kode RT tidak ditemukan');
    }

    // Cari citizen berdasarkan NIK dan tenantId
    const citizen = await this.prisma.citizen.findFirst({
      where: { 
        nik,
        tenantId: tenant.id
      }
    });

    if (!citizen) {
      throw new NotFoundException('Data NIK Anda belum didaftarkan oleh Pengurus RT. Silakan hubungi RT Anda terlebih dahulu.');
    }

    // Bind userId ke Citizen
    await this.prisma.citizen.update({
      where: { id: citizen.id },
      data: { userId }
    });

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        tenantId: tenant.id,
        role: 'WARGA',
        nik, // Bind NIK to User as well
        isOnboarded: true
      }
    });

    const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId, isOnboarded: user.isOnboarded };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Berhasil bergabung dengan RT',
      tenant,
      accessToken,
      user
    };
  }
}
