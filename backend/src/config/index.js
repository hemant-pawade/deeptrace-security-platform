require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'deeptrace_super_secret_jwt_key_2026_production_grade_security';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ WARNING: JWT_SECRET environment variable not provided. Using fallback secret for deployment resilience.');
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
