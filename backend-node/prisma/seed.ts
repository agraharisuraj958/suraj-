import { PrismaClient, Role, AppointmentStatus, TriageUrgency } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.user.deleteMany({}); // Cascades to everything else

  const passwordHash = await bcrypt.hash('Password123!', 10);
  console.log('Creating Admin and Receptionist...');

  await prisma.user.create({
    data: { email: 'admin@medimind.com', passwordHash, role: Role.ADMIN },
  });

  await prisma.user.create({
    data: { email: 'reception@medimind.com', passwordHash, role: Role.RECEPTIONIST },
  });

  console.log('Creating Departments and Doctors...');
  const deptNames = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology'];
  
  for (const [index, name] of deptNames.entries()) {
    const dept = await prisma.department.create({
      data: { name, description: `${name} Department` },
    });

    // Create 2 doctors per department
    for (let i = 1; i <= 2; i++) {
      const docUser = await prisma.user.create({
        data: {
          email: `dr.${name.toLowerCase().replace(' ', '')}${i}@medimind.com`,
          passwordHash,
          role: Role.DOCTOR,
        }
      });

      const doctor = await prisma.doctor.create({
        data: {
          userId: docUser.id,
          departmentId: dept.id,
          Availabilities: {
            create: [1, 2, 3, 4, 5].map(day => ({
              dayOfWeek: day, // Monday to Friday
              startTime: '09:00',
              endTime: '17:00',
              slotMinutes: 30
            }))
          }
        }
      });
    }
  }

  console.log('Creating Patients, Appointments, and Invoices...');
  const doctors = await prisma.doctor.findMany();
  
  for (let i = 1; i <= 10; i++) {
    const patientUser = await prisma.user.create({
      data: {
        email: `patient${i}@example.com`,
        passwordHash,
        role: Role.PATIENT,
      }
    });

    const patient = await prisma.patient.create({
      data: {
        userId: patientUser.id,
        allergies: i % 2 === 0 ? ['Penicillin', 'Peanuts'] : [],
        chronicConditions: i % 3 === 0 ? ['Hypertension'] : [],
      }
    });

    // Assign a demo appointment to the first doctor available
    const demoDoctor = doctors[i % doctors.length];
    
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: demoDoctor.id,
        datetime: new Date(new Date().getTime() + (i * 24 * 60 * 60 * 1000)), // Future dates
        status: AppointmentStatus.SCHEDULED,
        triageUrgency: TriageUrgency.LOW
      }
    });

    // Generate an invoice for some of them
    if (i % 2 === 0) {
      await prisma.invoice.create({
        data: {
          appointmentId: appointment.id,
          amount: 150.00,
        }
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('Demo Password for all accounts: Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });