const prisma = require('../config/db');

class UserRepository {
  async findByEmail(email) {
    // Note: Used during initial login lookup & global uniqueness check
    return await prisma.user.findFirst({
      where: { email },
      include: { tenant: true },
    });
  }

  async findByIdAndTenant(id, tenantId) {
    return await prisma.user.findFirst({
      where: {
        id,
        tenant_id: tenantId,
      },
      select: {
        id: true,
        tenant_id: true,
        email: true,
        full_name: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findByEmailAndTenant(email, tenantId) {
    return await prisma.user.findFirst({
      where: {
        email,
        tenant_id: tenantId,
      },
    });
  }

  async listUsers(tenantId, { skip = 0, take = 20, search, role, sortBy = 'created_at', sortOrder = 'desc' }) {
    const where = {
      tenant_id: tenantId,
    };

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { full_name: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Whitelist sort columns
    const allowedSortFields = ['full_name', 'email', 'role', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { [safeSortBy]: safeSortOrder },
        select: {
          id: true,
          tenant_id: true,
          email: true,
          full_name: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async createUser(tenantId, data) {
    return await prisma.user.create({
      data: {
        tenant_id: tenantId,
        email: data.email,
        password_hash: data.password_hash,
        full_name: data.full_name,
        role: data.role,
      },
      select: {
        id: true,
        tenant_id: true,
        email: true,
        full_name: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async updateUser(id, tenantId, data) {
    return await prisma.user.updateMany({
      where: {
        id,
        tenant_id: tenantId,
      },
      data,
    });
  }

  async deleteUser(id, tenantId) {
    return await prisma.user.deleteMany({
      where: {
        id,
        tenant_id: tenantId,
      },
    });
  }
}

module.exports = new UserRepository();
