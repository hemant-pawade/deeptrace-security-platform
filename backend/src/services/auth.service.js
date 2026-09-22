const userRepository = require('../repositories/user.repository');
const { comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { logAudit } = require('../utils/auditLogger');

class AuthService {
  async login(email, password, clientIp) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      userId: user.id,
      tenantId: user.tenant_id,
      role: user.role,
      email: user.email,
      fullName: user.full_name,
    });

    // Record login in audit log
    await logAudit({
      tenantId: user.tenant_id,
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'AUTH',
      entityId: user.id,
      description: `User ${user.email} (${user.role}) logged in successfully.`,
      metadata: { ip: clientIp },
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        tenant_id: user.tenant_id,
        tenant: user.tenant ? {
          id: user.tenant.id,
          name: user.tenant.name,
          slug: user.tenant.slug,
        } : null,
      },
    };
  }

  async getMe(userId, tenantId) {
    const user = await userRepository.findByIdAndTenant(userId, tenantId);
    if (!user) {
      const error = new Error('User account not found');
      error.statusCode = 404;
      throw error;
    }

    const prisma = require('../config/db');
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true, slug: true },
    });

    return {
      ...user,
      tenant,
    };
  }
}

module.exports = new AuthService();
