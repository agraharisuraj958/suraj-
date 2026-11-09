import { prisma } from '../../app';
import { AppError } from '../../utils/AppError';
import { Role } from '@prisma/client';

export class BillingService {
  static async getInvoices(userRole: Role, userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    let where = {};

    if (userRole === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      where = { appointment: { patientId: patient?.id } };
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { appointment: { select: { datetime: true, doctor: { include: { user: { select: { email: true } } } } } } }
      }),
      prisma.invoice.count({ where })
    ]);

    return { invoices, total };
  }

  static async updateInvoiceStatus(id: string, status: any) {
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new AppError('Invoice not found', 404);
    return await prisma.invoice.update({ where: { id }, data: { status } });
  }

  static async getAdminStats() {
    const [patientCount, doctorCount, appointmentCount, revenueResult] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } })
    ]);

    return {
      patients: patientCount,
      doctors: doctorCount,
      appointments: appointmentCount,
      totalRevenue: revenueResult._sum.amount || 0
    };
  }
}