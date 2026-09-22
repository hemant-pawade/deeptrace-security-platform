const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Deep Trace Database Seeding ---');

  // Clean existing data in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.securityEvent.deleteMany();
  await prisma.campaignUser.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  const defaultPassword = 'Password123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // 1. Create Tenants
  const tenantApex = await prisma.tenant.create({
    data: {
      name: 'Apex Defense Systems',
      slug: 'apex-defense',
    },
  });

  const tenantSentinel = await prisma.tenant.create({
    data: {
      name: 'Sentinel Cybernetics',
      slug: 'sentinel-cyber',
    },
  });

  console.log(`Created Tenants: ${tenantApex.name} (${tenantApex.id}), ${tenantSentinel.name} (${tenantSentinel.id})`);

  // 2. Create Users for Apex Defense Systems
  const apexAdmin = await prisma.user.create({
    data: {
      tenant_id: tenantApex.id,
      email: 'admin@apex.com',
      password_hash: passwordHash,
      full_name: 'Marcus Vance (Apex Admin)',
      role: 'ADMIN',
    },
  });

  const apexManager = await prisma.user.create({
    data: {
      tenant_id: tenantApex.id,
      email: 'manager@apex.com',
      password_hash: passwordHash,
      full_name: 'Sarah Connor (Apex Manager)',
      role: 'MANAGER',
    },
  });

  const apexUser = await prisma.user.create({
    data: {
      tenant_id: tenantApex.id,
      email: 'analyst@apex.com',
      password_hash: passwordHash,
      full_name: 'David Lightman (Apex Analyst)',
      role: 'USER',
    },
  });

  // 3. Create Users for Sentinel Cybernetics
  const sentinelAdmin = await prisma.user.create({
    data: {
      tenant_id: tenantSentinel.id,
      email: 'admin@sentinel.com',
      password_hash: passwordHash,
      full_name: 'Elena Rostova (Sentinel Admin)',
      role: 'ADMIN',
    },
  });

  const sentinelManager = await prisma.user.create({
    data: {
      tenant_id: tenantSentinel.id,
      email: 'manager@sentinel.com',
      password_hash: passwordHash,
      full_name: 'Nathan Drake (Sentinel Manager)',
      role: 'MANAGER',
    },
  });

  const sentinelUser = await prisma.user.create({
    data: {
      tenant_id: tenantSentinel.id,
      email: 'user@sentinel.com',
      password_hash: passwordHash,
      full_name: 'Chloe Frazer (Sentinel User)',
      role: 'USER',
    },
  });

  console.log('Created Users across both tenants (ADMIN, MANAGER, USER).');

  // 4. Create Campaigns for Apex
  const apexCamp1 = await prisma.campaign.create({
    data: {
      tenant_id: tenantApex.id,
      name: 'Project Aegis — Perimeter Hardening',
      description: 'Comprehensive boundary defense audit, firewall policy review, and zero-trust perimeter segmentation.',
      status: 'ACTIVE',
      start_date: new Date('2026-09-01'),
      end_date: new Date('2026-10-15'),
      created_by: apexAdmin.id,
    },
  });

  const apexCamp2 = await prisma.campaign.create({
    data: {
      tenant_id: tenantApex.id,
      name: 'Vulnerability Remediation Q3',
      description: 'Patching critical CVSS 9.0+ vulnerabilities across legacy database clusters and bastion hosts.',
      status: 'DRAFT',
      start_date: new Date('2026-10-01'),
      end_date: new Date('2026-11-30'),
      created_by: apexManager.id,
    },
  });

  const apexCamp3 = await prisma.campaign.create({
    data: {
      tenant_id: tenantApex.id,
      name: 'Operation Shadow Hunter — Threat Emulation',
      description: 'Simulated APT29 adversary techniques against identity controllers and Active Directory forest.',
      status: 'COMPLETED',
      start_date: new Date('2026-08-01'),
      end_date: new Date('2026-08-30'),
      created_by: apexAdmin.id,
    },
  });

  // Assign Users to Apex Campaigns
  await prisma.campaignUser.createMany({
    data: [
      { tenant_id: tenantApex.id, campaign_id: apexCamp1.id, user_id: apexManager.id },
      { tenant_id: tenantApex.id, campaign_id: apexCamp1.id, user_id: apexUser.id },
      { tenant_id: tenantApex.id, campaign_id: apexCamp2.id, user_id: apexUser.id },
      { tenant_id: tenantApex.id, campaign_id: apexCamp3.id, user_id: apexManager.id },
      { tenant_id: tenantApex.id, campaign_id: apexCamp3.id, user_id: apexUser.id },
    ],
  });

  // 5. Create Campaigns for Sentinel
  const sentinelCamp1 = await prisma.campaign.create({
    data: {
      tenant_id: tenantSentinel.id,
      name: 'Sentinel Shield — Cloud Migration Audit',
      description: 'Security validation for AWS EKS multi-cluster deployment and IAM least-privilege role boundaries.',
      status: 'ACTIVE',
      start_date: new Date('2026-09-10'),
      end_date: new Date('2026-10-25'),
      created_by: sentinelAdmin.id,
    },
  });

  const sentinelCamp2 = await prisma.campaign.create({
    data: {
      tenant_id: tenantSentinel.id,
      name: 'Zero-Trust Architecture Rollout',
      description: 'Enforcing mTLS, micro-segmentation, and device health posture verification for remote endpoints.',
      status: 'DRAFT',
      start_date: new Date('2026-10-15'),
      end_date: new Date('2026-12-31'),
      created_by: sentinelManager.id,
    },
  });

  // Assign Users to Sentinel Campaigns
  await prisma.campaignUser.createMany({
    data: [
      { tenant_id: tenantSentinel.id, campaign_id: sentinelCamp1.id, user_id: sentinelManager.id },
      { tenant_id: tenantSentinel.id, campaign_id: sentinelCamp1.id, user_id: sentinelUser.id },
      { tenant_id: tenantSentinel.id, campaign_id: sentinelCamp2.id, user_id: sentinelManager.id },
    ],
  });

  console.log('Created Campaigns and User Assignments.');

  // 6. Create Security Events for Apex
  await prisma.securityEvent.createMany({
    data: [
      {
        tenant_id: tenantApex.id,
        event_type: 'LATERAL_MOVEMENT',
        severity: 'CRITICAL',
        status: 'OPEN',
        description: 'Lateral movement detected in subnet 10.240.12.0/24 from workstation WKST-881 attempting Pass-the-Hash.',
        source_ip: '10.240.12.188',
        created_at: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      },
      {
        tenant_id: tenantApex.id,
        event_type: 'BRUTE_FORCE_SSH',
        severity: 'HIGH',
        status: 'OPEN',
        description: 'Brute force attack on SSH gateway: 420 failed authentication attempts within 2 minutes.',
        source_ip: '185.220.101.5',
        created_at: new Date(Date.now() - 45 * 60 * 1000),
      },
      {
        tenant_id: tenantApex.id,
        event_type: 'PRIVILEGE_ESCALATION',
        severity: 'HIGH',
        status: 'RESOLVED',
        description: 'Unauthorized privilege escalation attempt intercepted by EDR agent on core file server.',
        source_ip: '10.240.4.12',
        created_at: new Date(Date.now() - 3 * 3600 * 1000),
      },
      {
        tenant_id: tenantApex.id,
        event_type: 'DNS_TUNNELING',
        severity: 'MEDIUM',
        status: 'OPEN',
        description: 'Suspicious outbound DNS tunneling pattern query detected destined for high-entropy domain ns1.exfil.xyz.',
        source_ip: '10.240.18.91',
        created_at: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        tenant_id: tenantApex.id,
        event_type: 'EXPIRED_CERTIFICATE',
        severity: 'LOW',
        status: 'RESOLVED',
        description: 'Expired TLS certificate identified during vulnerability scan on internal staging endpoint port 8443.',
        source_ip: '10.240.99.14',
        created_at: new Date(Date.now() - 24 * 3600 * 1000),
      },
    ],
  });

  // Security Events for Sentinel
  await prisma.securityEvent.createMany({
    data: [
      {
        tenant_id: tenantSentinel.id,
        event_type: 'RANSOMWARE_CANARY_ALERT',
        severity: 'CRITICAL',
        status: 'OPEN',
        description: 'Canary honeypot file modified in network share \\\\FS01\\Confidential\\Financial_Q3.xlsx. Possible crypto locker.',
        source_ip: '172.16.50.14',
        created_at: new Date(Date.now() - 20 * 60 * 1000),
      },
      {
        tenant_id: tenantSentinel.id,
        event_type: 'MFA_FATIGUE',
        severity: 'MEDIUM',
        status: 'OPEN',
        description: 'Multiple MFA push notifications consecutively rejected by user elena.rostova within 3 minutes.',
        source_ip: '91.240.118.2',
        created_at: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        tenant_id: tenantSentinel.id,
        event_type: 'PORT_SCAN',
        severity: 'LOW',
        status: 'RESOLVED',
        description: 'SYN scan targeting TCP ports 80, 443, 8080, 8443 blocked by external border firewall.',
        source_ip: '198.51.100.42',
        created_at: new Date(Date.now() - 12 * 3600 * 1000),
      },
    ],
  });

  console.log('Created Security Events for both tenants.');

  // 7. Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        tenant_id: tenantApex.id,
        user_id: apexAdmin.id,
        action: 'TENANT_INITIALIZED',
        entity_type: 'SYSTEM',
        entity_id: tenantApex.id,
        description: 'Apex Defense Systems tenant workspace initialized with baseline security policies.',
        created_at: new Date(Date.now() - 72 * 3600 * 1000),
      },
      {
        tenant_id: tenantApex.id,
        user_id: apexAdmin.id,
        action: 'USER_CREATED',
        entity_type: 'USER',
        entity_id: apexManager.id,
        description: `Admin created manager account: ${apexManager.email} with role MANAGER.`,
        created_at: new Date(Date.now() - 48 * 3600 * 1000),
      },
      {
        tenant_id: tenantApex.id,
        user_id: apexAdmin.id,
        action: 'USER_CREATED',
        entity_type: 'USER',
        entity_id: apexUser.id,
        description: `Admin created analyst account: ${apexUser.email} with role USER.`,
        created_at: new Date(Date.now() - 47 * 3600 * 1000),
      },
      {
        tenant_id: tenantApex.id,
        user_id: apexAdmin.id,
        action: 'CAMPAIGN_CREATED',
        entity_type: 'CAMPAIGN',
        entity_id: apexCamp1.id,
        description: `Created new security campaign: "${apexCamp1.name}".`,
        created_at: new Date(Date.now() - 24 * 3600 * 1000),
      },
      {
        tenant_id: tenantApex.id,
        user_id: apexManager.id,
        action: 'CAMPAIGN_USER_ASSIGNED',
        entity_type: 'CAMPAIGN',
        entity_id: apexCamp1.id,
        description: `Assigned user ${apexUser.email} to campaign "${apexCamp1.name}".`,
        created_at: new Date(Date.now() - 20 * 3600 * 1000),
      },
      // Sentinel Audit Logs
      {
        tenant_id: tenantSentinel.id,
        user_id: sentinelAdmin.id,
        action: 'TENANT_INITIALIZED',
        entity_type: 'SYSTEM',
        entity_id: tenantSentinel.id,
        description: 'Sentinel Cybernetics tenant workspace initialized.',
        created_at: new Date(Date.now() - 72 * 3600 * 1000),
      },
      {
        tenant_id: tenantSentinel.id,
        user_id: sentinelAdmin.id,
        action: 'USER_CREATED',
        entity_type: 'USER',
        entity_id: sentinelManager.id,
        description: `Admin created manager account: ${sentinelManager.email} with role MANAGER.`,
        created_at: new Date(Date.now() - 50 * 3600 * 1000),
      },
      {
        tenant_id: tenantSentinel.id,
        user_id: sentinelAdmin.id,
        action: 'CAMPAIGN_CREATED',
        entity_type: 'CAMPAIGN',
        entity_id: sentinelCamp1.id,
        description: `Created campaign: "${sentinelCamp1.name}".`,
        created_at: new Date(Date.now() - 30 * 3600 * 1000),
      },
    ],
  });

  console.log('Created Audit Logs for both tenants.');
  console.log('--- Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
