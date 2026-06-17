"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const tenantId = "test-string";
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    try {
        const income = await prisma.financeTransaction.aggregate({
            where: { tenantId, type: 'INCOME', date: { gte: startOfMonth } },
            _sum: { amount: true },
        });
        console.log("SUCCESS income:", income);
    }
    catch (e) {
        console.error("ERROR in income aggregate:", e.message);
    }
    try {
        const dues = await prisma.payment.aggregate({
            where: { due: { tenantId }, status: 'SUCCESS', createdAt: { gte: startOfMonth } },
            _sum: { amount: true },
        });
        console.log("SUCCESS dues:", dues);
    }
    catch (e) {
        console.error("ERROR in payment aggregate:", e.message);
    }
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=test.js.map