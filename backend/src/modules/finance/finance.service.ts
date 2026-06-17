import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getSummary(tenantId: string) {
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

    // Calculate overall balance (sum of all incomes - sum of all expenses)
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

  async getTransactions(tenantId: string, type?: string) {
    const where: any = { tenantId };
    if (type) where.type = type;

    return this.prisma.financeTransaction.findMany({
      where,
      orderBy: { date: 'desc' }
    });
  }

  async createTransaction(tenantId: string, data: any) {
    // Basic validation
    if (!data.amount || !data.category || !data.type) {
      throw new BadRequestException('Amount, category, and type are required');
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
        throw new BadRequestException('Saldo tidak mencukupi untuk pengeluaran ini');
      }
    }

    // Generate transaction number
    const count = await this.prisma.financeTransaction.count({ where: { tenantId } });
    const prefix = data.type === 'INCOME' ? 'INC' : 'EXP';
    const num = (count + 1).toString().padStart(4, '0');
    const transactionNumber = `${prefix}-${new Date().getFullYear()}${new Date().getMonth()+1}-${num}`;

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

  async getDues(tenantId: string) {
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

  async updateTransaction(tenantId: string, id: string, data: any) {
    const tx = await this.prisma.financeTransaction.findFirst({ where: { id, tenantId } });
    if (!tx) throw new NotFoundException('Transaction not found');

    if (tx.type === 'EXPENSE' && data.amount && data.amount > tx.amount) {
      const allIncome = await this.prisma.financeTransaction.aggregate({ where: { tenantId, type: 'INCOME' }, _sum: { amount: true } });
      const allExpense = await this.prisma.financeTransaction.aggregate({ where: { tenantId, type: 'EXPENSE' }, _sum: { amount: true } });
      const currentBalance = (allIncome._sum.amount || 0) - (allExpense._sum.amount || 0);
      const difference = parseFloat(data.amount) - tx.amount;
      if (currentBalance < difference) {
        throw new BadRequestException('Saldo tidak mencukupi untuk penambahan pengeluaran ini');
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

  async deleteTransaction(tenantId: string, id: string) {
    const tx = await this.prisma.financeTransaction.findFirst({ where: { id, tenantId } });
    if (!tx) throw new NotFoundException('Transaction not found');

    return this.prisma.financeTransaction.delete({ where: { id } });
  }
}
