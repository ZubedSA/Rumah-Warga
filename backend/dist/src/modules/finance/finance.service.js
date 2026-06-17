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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary(tenantId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [income, expense, dues] = await Promise.all([
            this.prisma.financeTransaction.aggregate({
                where: { tenantId, type: 'INCOME', date: { gte: startOfMonth } },
                _sum: { amount: true },
            }),
            this.prisma.financeTransaction.aggregate({
                where: { tenantId, type: 'EXPENSE', date: { gte: startOfMonth } },
                _sum: { amount: true },
            }),
            this.prisma.payment.aggregate({
                where: { due: { tenantId }, status: 'SUCCESS', createdAt: { gte: startOfMonth } },
                _sum: { amount: true },
            })
        ]);
        const totalIncome = income._sum.amount || 0;
        const totalExpense = expense._sum.amount || 0;
        const totalDues = dues._sum.amount || 0;
        const allIncome = await this.prisma.financeTransaction.aggregate({
            where: { tenantId, type: 'INCOME' },
            _sum: { amount: true },
        });
        const allExpense = await this.prisma.financeTransaction.aggregate({
            where: { tenantId, type: 'EXPENSE' },
            _sum: { amount: true },
        });
        const balance = (allIncome._sum.amount || 0) - (allExpense._sum.amount || 0);
        const txCount = await this.prisma.financeTransaction.count({
            where: { tenantId, date: { gte: startOfMonth } }
        });
        const arrears = await this.prisma.due.aggregate({
            where: { tenantId, isPaid: false, dueDate: { lt: now } },
            _sum: { amount: true }
        });
        return {
            balance,
            totalIncomeMonth: totalIncome,
            totalExpenseMonth: totalExpense,
            totalDuesMonth: totalDues,
            totalArrears: arrears._sum.amount || 0,
            transactionCountMonth: txCount
        };
    }
    async getTransactions(tenantId, type) {
        const where = { tenantId };
        if (type)
            where.type = type;
        return this.prisma.financeTransaction.findMany({
            where,
            orderBy: { date: 'desc' }
        });
    }
    async createTransaction(tenantId, data) {
        if (!data.amount || !data.category || !data.type) {
            throw new common_1.BadRequestException('Amount, category, and type are required');
        }
        if (data.type === 'EXPENSE') {
            const allIncome = await this.prisma.financeTransaction.aggregate({
                where: { tenantId, type: 'INCOME' },
                _sum: { amount: true },
            });
            const allExpense = await this.prisma.financeTransaction.aggregate({
                where: { tenantId, type: 'EXPENSE' },
                _sum: { amount: true },
            });
            const balance = (allIncome._sum.amount || 0) - (allExpense._sum.amount || 0);
            if (balance < data.amount) {
                throw new common_1.BadRequestException('Saldo tidak mencukupi untuk pengeluaran ini');
            }
        }
        const count = await this.prisma.financeTransaction.count({ where: { tenantId } });
        const prefix = data.type === 'INCOME' ? 'INC' : 'EXP';
        const num = (count + 1).toString().padStart(4, '0');
        const transactionNumber = `${prefix}-${new Date().getFullYear()}${new Date().getMonth() + 1}-${num}`;
        return this.prisma.financeTransaction.create({
            data: {
                tenantId,
                type: data.type,
                category: data.category,
                amount: parseFloat(data.amount),
                description: data.description || '',
                proofUrl: data.proofUrl,
                date: new Date(data.date || new Date()),
                transactionNumber,
            }
        });
    }
    async getDues(tenantId) {
        return this.prisma.family.findMany({
            where: { tenantId },
            include: {
                citizens: { where: { isHeadOfFamily: true } },
                dues: {
                    orderBy: { dueDate: 'desc' },
                    take: 5
                }
            }
        });
    }
    async updateTransaction(tenantId, id, data) {
        const tx = await this.prisma.financeTransaction.findFirst({ where: { id, tenantId } });
        if (!tx)
            throw new common_1.NotFoundException('Transaction not found');
        if (tx.type === 'EXPENSE' && data.amount && data.amount > tx.amount) {
            const allIncome = await this.prisma.financeTransaction.aggregate({ where: { tenantId, type: 'INCOME' }, _sum: { amount: true } });
            const allExpense = await this.prisma.financeTransaction.aggregate({ where: { tenantId, type: 'EXPENSE' }, _sum: { amount: true } });
            const currentBalance = (allIncome._sum.amount || 0) - (allExpense._sum.amount || 0);
            const difference = parseFloat(data.amount) - tx.amount;
            if (currentBalance < difference) {
                throw new common_1.BadRequestException('Saldo tidak mencukupi untuk penambahan pengeluaran ini');
            }
        }
        return this.prisma.financeTransaction.update({
            where: { id },
            data: {
                category: data.category || tx.category,
                amount: data.amount ? parseFloat(data.amount) : tx.amount,
                description: data.description !== undefined ? data.description : tx.description,
                date: data.date ? new Date(data.date) : tx.date,
            }
        });
    }
    async deleteTransaction(tenantId, id) {
        const tx = await this.prisma.financeTransaction.findFirst({ where: { id, tenantId } });
        if (!tx)
            throw new common_1.NotFoundException('Transaction not found');
        return this.prisma.financeTransaction.delete({ where: { id } });
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map