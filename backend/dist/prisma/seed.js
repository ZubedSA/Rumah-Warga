"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const systemTenant = await prisma.tenant.create({
        data: {
            name: 'System Admin',
            type: client_1.TenantType.KOMUNITAS,
        },
    });
    await prisma.user.create({
        data: {
            email: 'admin@rumahwarga.id',
            name: 'Super Admin',
            role: client_1.Role.SUPER_ADMIN,
            tenantId: systemTenant.id,
        },
    });
    const rtTenant = await prisma.tenant.create({
        data: {
            name: 'RT 01 / RW 02 - Sukamaju',
            type: client_1.TenantType.RT,
        },
    });
    await prisma.user.create({
        data: {
            email: 'rt01@rumahwarga.id',
            name: 'Ketua RT 01',
            role: client_1.Role.RT,
            tenantId: rtTenant.id,
        },
    });
    console.log('Seeding completed successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map