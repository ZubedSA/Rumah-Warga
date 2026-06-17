import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly firebase: FirebaseService,
  ) {}

  async loginWithFirebase(idToken: string) {
    try {
      const decodedToken = await this.firebase.getAuth().verifyIdToken(idToken);
      const email = decodedToken.email;

      if (!email) {
        throw new UnauthorizedException('Email is not present in token');
      }

      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email,
            name: decodedToken.name || email.split('@')[0],
            role: 'WARGA',
            isOnboarded: false
          }
        });
      }

      const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId, isOnboarded: user.isOnboarded };
      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          isOnboarded: user.isOnboarded,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase Token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
        citizen: {
          include: {
            family: true
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.citizen) {
      return {
        ...user,
        name: user.citizen.name || user.name,
        phone: user.citizen.phone || user.phone,
        nik: user.citizen.nik || user.nik,
        rt: user.citizen.rt || user.rt,
        rw: user.citizen.rw || user.rw,
        address: user.citizen.family?.address || user.address,
      };
    }

    return user;
  }

  async updateProfile(userId: string, phone: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { phone },
    });

    const citizen = await this.prisma.citizen.findUnique({
      where: { userId },
    });

    if (citizen) {
      await this.prisma.citizen.update({
        where: { id: citizen.id },
        data: { phone },
      });
    }

    return user;
  }
}
