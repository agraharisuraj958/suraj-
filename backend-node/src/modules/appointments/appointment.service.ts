import { prisma } from '../../app';
import { AppError } from '../../utils/AppError';
import { Role, AppointmentStatus } from '@prisma/client';

export class AppointmentService {
  static async book(patientUserId: string, doctorId: string, datetimeStr: string) {
    const patient = await prisma.patient.findUnique({ where: { userId: patientUserId } });
    if (!patient) throw new AppError('Patient profile not found', 404);

    const datetime = new Date(datetimeStr);
    
    // Basic Conflict Detection
    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId,
        datetime,
        status: { notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] }
      }
    });

    if (existing) throw new AppError('Doctor is already booked for this time slot', 409);

    return await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        datetime,
        status: AppointmentStatus.SCHEDULED
      },
      include: { doctor: { include: { user: { select: { email: true } } } } }
    });
  }

  static async getAll(userRole: Role, userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    let where = {};

    // Role-based access control for lists
    if (userRole === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      where = { patientId: patient?.id };
    } else if (userRole === Role.DOCTOR) {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      where = { doctorId: doctor?.id };
    }
    // ADMIN and RECEPTIONIST see all (where remains {})

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { datetime: 'asc' },
        include: {
          patient: { include: { user: { select: { email: true } } } },
          doctor: { include: { user: { select: { email: true } } } }
        }
      }),
      prisma.appointment.count({ where })
    ]);

    return { appointments, total };
  }

  static async updateStatus(id: string, status: AppointmentStatus) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new AppError('Appointment not found', 404);

    // If completed, automatically generate a pending invoice (as per Phase 3 requirements)
    if (status === AppointmentStatus.COMPLETED && appointment.status !== AppointmentStatus.COMPLETED) {
      await prisma.$transaction([
        prisma.appointment.update({ where: { id }, data: { status } }),
        prisma.invoice.upsert({
          where: { appointmentId: id },
          update: {},
          create: { appointmentId: id, amount: 150.00 } // Standard consultation fee
        })
      ]);
      return prisma.appointment.findUnique({ where: { id } });
    }

    return await prisma.appointment.update({
      where: { id },
      data: { status }
    });
  }
}