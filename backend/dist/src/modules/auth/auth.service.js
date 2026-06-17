"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const firebase_service_1 = require("../../infrastructure/firebase/firebase.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    firebase;
    constructor(prisma, jwtService, firebase) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.firebase = firebase;
    }
    async loginWithFirebase(idToken) {
        try {
            const decodedToken = await this.firebase.getAuth().verifyIdToken(idToken);
            const email = decodedToken.email;
            if (!email) {
                throw new common_1.UnauthorizedException('Email is not present in token');
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
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid Firebase Token');
        }
    }
    async getProfile(userId) {
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
            throw new common_1.UnauthorizedException('User not found');
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
    async updateProfile(userId, phone) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        firebase_service_1.FirebaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map