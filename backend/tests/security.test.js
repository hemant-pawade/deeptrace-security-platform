/**
 * Automated Security & Multi-Tenancy Verification Suite
 * Deep Trace Cybernetics — Security Management Platform
 * 
 * Verifies:
 * 1. Authentication & JWT issuing
 * 2. Cross-Tenant Data Isolation (Tenant A -> Tenant B resource access returns 404)
 * 3. RBAC Route Guards (USER role calling ADMIN-only endpoint returns 403)
 * 4. Campaign State Machine Validation (Illegal status transitions return 409)
 * 5. Tenant Injection Immunity (Ignored spoofed tenant_id)
 * 6. Audit Logging Verification
 */

const http = require('http');
const app = require('../src/app');

let server;
let baseUrl;

async function startTestServer() {
  return new Promise((resolve) => {
    // Bind to dynamic port
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}/api`;
      console.log(`\n======================================================`);
      console.log(`[TEST SUITE] Deep Trace Security Engine Test Runner`);
      console.log(`Test API running on ${baseUrl}`);
      console.log(`======================================================\n`);
      resolve();
    });
  });
}

function stopTestServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(resolve);
    } else {
      resolve();
    }
  });
}

async function request(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  return {
    status: response.status,
    data,
  };
}

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✔ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ✖ [FAIL] ${testName}`);
    failed++;
  }
}

async function runTests() {
  await startTestServer();

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Authentication for Tenant A (Apex) and Tenant B (Sentinel)
    // -------------------------------------------------------------------------
    console.log('\n[1] Testing Authentication & Token Issuance...');

    // 1.1 Apex Admin Login
    const apexLoginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@apex.com', password: 'Password123!' }),
    });
    assert(apexLoginRes.status === 200, 'Apex Admin can authenticate with valid credentials');
    assert(apexLoginRes.data.token && apexLoginRes.data.user.role === 'ADMIN', 'Apex Admin receives valid JWT and role claim');
    const apexAdminToken = apexLoginRes.data.token;
    const apexTenantId = apexLoginRes.data.user.tenant_id;

    // 1.2 Apex User (Analyst) Login
    const apexUserLoginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'analyst@apex.com', password: 'Password123!' }),
    });
    assert(apexUserLoginRes.status === 200, 'Apex Analyst can authenticate');
    const apexUserToken = apexUserLoginRes.data.token;

    // 1.3 Sentinel Admin Login
    const sentinelLoginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@sentinel.com', password: 'Password123!' }),
    });
    assert(sentinelLoginRes.status === 200, 'Sentinel Admin can authenticate');
    const sentinelAdminToken = sentinelLoginRes.data.token;
    const sentinelTenantId = sentinelLoginRes.data.user.tenant_id;

    assert(apexTenantId !== sentinelTenantId, 'Tenants have completely distinct tenant IDs');

    // -------------------------------------------------------------------------
    // TEST 2: Cross-Tenant Data Isolation (MANDATORY REQUIREMENT)
    // -------------------------------------------------------------------------
    console.log('\n[2] Testing Cross-Tenant Isolation (Tenant A vs Tenant B)...');

    // Fetch campaigns for Sentinel to get a Sentinel Campaign ID
    const sentinelCampaignsRes = await request('/campaigns', {
      headers: { Authorization: `Bearer ${sentinelAdminToken}` },
    });
    assert(sentinelCampaignsRes.status === 200, 'Sentinel Admin can fetch Sentinel campaigns');
    const sentinelCampaign = sentinelCampaignsRes.data.data[0];
    assert(sentinelCampaign && sentinelCampaign.id, 'Sentinel Campaign identified');

    // Crucial Security Scenario: Apex Admin attempts to GET Sentinel's Campaign
    const crossTenantGetRes = await request(`/campaigns/${sentinelCampaign.id}`, {
      headers: { Authorization: `Bearer ${apexAdminToken}` },
    });
    assert(
      crossTenantGetRes.status === 404,
      `Cross-tenant GET /api/campaigns/${sentinelCampaign.id} returned 404 Not Found (Zero data leak)`
    );

    // Crucial Security Scenario: Apex Admin attempts to PATCH Sentinel's Campaign
    const crossTenantPatchRes = await request(`/campaigns/${sentinelCampaign.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${apexAdminToken}` },
      body: JSON.stringify({ name: 'Hacked Campaign Name' }),
    });
    assert(
      crossTenantPatchRes.status === 404,
      `Cross-tenant PATCH /api/campaigns/${sentinelCampaign.id} returned 404 Not Found (Unauthorized modification blocked)`
    );

    // Crucial Security Scenario: Apex Admin attempts to DELETE Sentinel's Campaign
    const crossTenantDeleteRes = await request(`/campaigns/${sentinelCampaign.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apexAdminToken}` },
    });
    assert(
      crossTenantDeleteRes.status === 404,
      `Cross-tenant DELETE /api/campaigns/${sentinelCampaign.id} returned 404 Not Found (Unauthorized deletion blocked)`
    );

    // -------------------------------------------------------------------------
    // TEST 3: RBAC Route Guards (USER Token vs Protected Endpoints)
    // -------------------------------------------------------------------------
    console.log('\n[3] Testing Role-Based Access Control (RBAC)...');

    // 3.1 USER role attempting to DELETE a campaign
    const apexCampaignsRes = await request('/campaigns', {
      headers: { Authorization: `Bearer ${apexAdminToken}` },
    });
    const apexCampaign = apexCampaignsRes.data.data[0];

    const userDeleteRes = await request(`/campaigns/${apexCampaign.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apexUserToken}` },
    });
    assert(
      userDeleteRes.status === 403,
      'USER role attempting DELETE /api/campaigns/:id returns 403 Forbidden'
    );

    // 3.2 USER role attempting to create a new campaign
    const userCreateRes = await request('/campaigns', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apexUserToken}` },
      body: JSON.stringify({ name: 'Unauthorized Campaign' }),
    });
    assert(
      userCreateRes.status === 403,
      'USER role attempting POST /api/campaigns returns 403 Forbidden'
    );

    // 3.3 USER role attempting to view audit logs
    const userAuditRes = await request('/audit-logs', {
      headers: { Authorization: `Bearer ${apexUserToken}` },
    });
    assert(
      userAuditRes.status === 403,
      'USER role attempting GET /api/audit-logs returns 403 Forbidden'
    );

    // 3.4 USER role attempting to manage users
    const userManageUserRes = await request('/users', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apexUserToken}` },
      body: JSON.stringify({
        email: 'malicious@apex.com',
        full_name: 'Malicious User',
        password: 'Password123!',
        role: 'ADMIN',
      }),
    });
    assert(
      userManageUserRes.status === 403,
      'USER role attempting POST /api/users returns 403 Forbidden'
    );

    // -------------------------------------------------------------------------
    // TEST 4: Campaign State Machine Validation
    // -------------------------------------------------------------------------
    console.log('\n[4] Testing Campaign Status Transitions...');

    // Find completed campaign
    const completedCamp = apexCampaignsRes.data.data.find((c) => c.status === 'COMPLETED');
    assert(completedCamp !== undefined, 'Found COMPLETED campaign in Apex seed data');

    // Attempt invalid transition: COMPLETED -> DRAFT
    const invalidTransitionRes = await request(`/campaigns/${completedCamp.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${apexAdminToken}` },
      body: JSON.stringify({ status: 'DRAFT' }),
    });
    assert(
      invalidTransitionRes.status === 409,
      'Attempting transition COMPLETED -> DRAFT correctly returns 409 Conflict'
    );

    // Create a new DRAFT campaign to test valid transition
    const createDraftRes = await request('/campaigns', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apexAdminToken}` },
      body: JSON.stringify({
        name: 'Test Lifecycle Campaign',
        status: 'DRAFT',
      }),
    });
    assert(createDraftRes.status === 201, 'Created DRAFT campaign');
    const testCampId = createDraftRes.data.id;

    // Transition DRAFT -> ACTIVE (Valid)
    const validTransitionRes = await request(`/campaigns/${testCampId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${apexAdminToken}` },
      body: JSON.stringify({ status: 'ACTIVE' }),
    });
    assert(validTransitionRes.status === 200 && validTransitionRes.data.status === 'ACTIVE', 'DRAFT -> ACTIVE transition succeeded');

    // -------------------------------------------------------------------------
    // TEST 5: Tenant ID Spoofing Immunity
    // -------------------------------------------------------------------------
    console.log('\n[5] Testing Tenant ID Spoofing Immunity...');

    // Apex Admin creates a security event but sends Sentinel's tenant_id in body
    const spoofedEventRes = await request('/security-events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apexAdminToken}` },
      body: JSON.stringify({
        tenant_id: sentinelTenantId, // Spoofed tenant ID
        tenantId: sentinelTenantId,
        event_type: 'PORT_SCAN_ATTEMPT',
        severity: 'MEDIUM',
        description: 'Testing tenant injection immunity',
      }),
    });
    assert(spoofedEventRes.status === 201, 'Security event created');
    assert(
      spoofedEventRes.data.tenant_id === apexTenantId,
      'Server derived tenant_id exclusively from JWT payload, completely ignoring client spoofing!'
    );

    // -------------------------------------------------------------------------
    // TEST 6: Audit Logs Recorded
    // -------------------------------------------------------------------------
    console.log('\n[6] Testing Audit Log Recording...');
    const auditRes = await request('/audit-logs', {
      headers: { Authorization: `Bearer ${apexAdminToken}` },
    });
    assert(auditRes.status === 200, 'ADMIN can fetch tenant audit logs');
    assert(auditRes.data.data.length > 0, 'Audit log contains recorded security and lifecycle events');

    console.log('\n======================================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');
  } catch (error) {
    console.error('Fatal error during test run:', error);
    failed++;
  } finally {
    await stopTestServer();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
