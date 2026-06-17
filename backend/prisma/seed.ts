import { PrismaClient, TenantType, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create initial Super Admin Tenant
  const systemTenant = await prisma.tenant.create({
    data: {
      name: 'System Admin',
      type: TenantType.KOMUNITAS,
    },
  });

  // Create Super Admin User
  await prisma.user.create({
    data: {
      email: 'admin@rumahwarga.id',
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
      tenantId: systemTenant.id,
    },
  });

  // Create a sample RT Tenant
  const rtTenant = await prisma.tenant.create({
    data: {
      name: 'RT 01 / RW 02 - Sukamaju',
      type: TenantType.RT,
    },
  });

  // Create RT Admin User
  await prisma.user.create({
    data: {
      email: 'rt01@rumahwarga.id',
      name: 'Ketua RT 01',
      role: Role.RT,
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
