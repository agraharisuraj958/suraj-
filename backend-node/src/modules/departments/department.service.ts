import { prisma } from '../../app';
import { AppError } from '../../utils/AppError';

export class DepartmentService {
  static async getAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {};
    
    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.department.count({ where })
    ]);

    return { departments, total };
  }

  static async getById(id: string) {
    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) throw new AppError('Department not found', 404);
    return department;
  }

  static async create(data: { name: string; description?: string }) {
    const existing = await prisma.department.findUnique({ where: { name: data.name } });
    if (existing) throw new AppError('Department already exists', 400);

    return await prisma.department.create({ data });
  }

  static async update(id: string, data: { name?: string; description?: string }) {
    await this.getById(id); // Ensure it exists
    return await prisma.department.update({ where: { id }, data });
  }

  static async delete(id: string) {
    await this.getById(id); // Ensure it exists
    return await prisma.department.delete({ where: { id } });
  }
}