const userRepository = require('../repositories/user.repository');
const { hashPassword } = require('../utils/password');
const { logAudit } = require('../utils/auditLogger');

class UserService {
  async listUsers(tenantId, query) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const { users, total } = await userRepository.listUsers(tenantId, {
      skip,
      take: limit,
      search: query.search,
      role: query.role,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async getUserById(id, tenantId) {
    const user = await userRepository.findByIdAndTenant(id, tenantId);
    if (!user) {
      const error = new Error('User not found in tenant organization');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async createUser(tenantId, actorUser, data) {
    const existing = await userRepository.findByEmailAndTenant(data.email, tenantId);
    if (existing) {
      const error = new Error(`User with email '${data.email}' already exists in this tenant`);
      error.statusCode = 409;
      error.errors = { email: 'Email is already registered' };
      throw error;
    }

    const password_hash = await hashPassword(data.password);
    const newUser = await userRepository.createUser(tenantId, {
      email: data.email,
      password_hash,
      full_name: data.full_name,
      role: data.role,
    });

    await logAudit({
      tenantId,
      userId: actorUser.userId,
      action: 'USER_CREATED',
      entityType: 'USER',
      entityId: newUser.id,
      description: `User ${newUser.email} created with role ${newUser.role} by ${actorUser.email}.`,
    });

    return newUser;
  }

  async updateUser(id, tenantId, actorUser, data) {
    const existing = await userRepository.findByIdAndTenant(id, tenantId);
    if (!existing) {
      const error = new Error('User not found in tenant organization');
      error.statusCode = 404;
      throw error;
    }

    const updatePayload = {};
    if (data.full_name) updatePayload.full_name = data.full_name;
    if (data.role) updatePayload.role = data.role;
    if (data.password) {
      updatePayload.password_hash = await hashPassword(data.password);
    }

    await userRepository.updateUser(id, tenantId, updatePayload);

    await logAudit({
      tenantId,
      userId: actorUser.userId,
      action: 'USER_UPDATED',
      entityType: 'USER',
      entityId: id,
      description: `User ${existing.email} updated by ${actorUser.email}. Modified fields: ${Object.keys(updatePayload).join(', ')}.`,
    });

    return await userRepository.findByIdAndTenant(id, tenantId);
  }

  async deleteUser(id, tenantId, actorUser) {
    if (id === actorUser.userId) {
      const error = new Error('Cannot delete your own administrative account');
      error.statusCode = 400;
      throw error;
    }

    const existing = await userRepository.findByIdAndTenant(id, tenantId);
    if (!existing) {
      const error = new Error('User not found in tenant organization');
      error.statusCode = 404;
      throw error;
    }

    await userRepository.deleteUser(id, tenantId);

    await logAudit({
      tenantId,
      userId: actorUser.userId,
      action: 'USER_DELETED',
      entityType: 'USER',
      entityId: id,
      description: `User ${existing.email} deleted by ${actorUser.email}.`,
    });

    return { message: 'User deleted successfully' };
  }
}

module.exports = new UserService();
