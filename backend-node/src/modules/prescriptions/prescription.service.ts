import { prisma } from '../../app';
import { AppError } from '../../utils/AppError';
import { Role } from '@prisma/client';

export class PrescriptionService {
  static async create(doctorId: string, data: any) {
    const doctor = await prisma.doctor.findUnique({ where: { userId: doctorId } });
    if (!doctor) throw new AppError('Doctor profile not found', 404);

    return await prisma.prescription.create({
      data: {
        doctorId: doctor.id,
        patientId: data.patientId,
        appointmentId: data.appointmentId,
        notes: data.notes,
        Items: {
          create: data.items
        }
      },
      include: { Items: true }
    });
  }

  static async getAll(userRole: Role, userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    let where = {};

    if (userRole === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      where = { patientId: patient?.id };
    } else if (userRole === Role.DOCTOR) {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      where = { doctorId: doctor?.id };
    }

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { Items: true, doctor: { include: { user: { select: { email: true } } } } }
      }),
      prisma.prescription.count({ where })
    ]);

    return { prescriptions, total };
  }
}