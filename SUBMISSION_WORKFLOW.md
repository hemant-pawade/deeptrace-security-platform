# DEEP TRACE CYBERNETICS — TECHNICAL ASSESSMENT SUBMISSION REPORT

> **Candidate:** Hemant Pawade  
> **Role:** Full Stack Developer (Node.js / Express.js • React.js / Vite • PostgreSQL / SQL)  
> **Submission Deadline:** 23 September 2026, 6:00 PM IST  
> **Assessment Project:** Multi-Tenant Security Management Platform  

---

## 🌐 Live Submission Links

| Resource | URL |
| :--- | :--- |
| **Live Frontend Application** | [https://deeptrace-frontend-mksy.onrender.com](https://deeptrace-frontend-mksy.onrender.com) |
| **Live Backend API Gateway** | [https://deeptrace-backend-lyxk.onrender.com](https://deeptrace-backend-lyxk.onrender.com) |
| **API Health Probe** | [https://deeptrace-backend-lyxk.onrender.com/health](https://deeptrace-backend-lyxk.onrender.com/health) |
| **GitHub Repository** | [https://github.com/hemant-pawade/deeptrace-security-platform](https://github.com/hemant-pawade/deeptrace-security-platform) |
| **Google Drive Demo Video** | `[PASTE_YOUR_GOOGLE_DRIVE_VIDEO_LINK_HERE]` *(Access: Anyone with link)* |

---

## 🔑 Pre-Seeded Evaluation Credentials

Both organizations are completely seeded and isolated in the PostgreSQL database. The login portal features **one-click demo preset shortcuts** that automatically autofill these credentials.

| Organization (Tenant) | Role | Full Name | Email Address | Password |
| :--- | :---: | :--- | :--- | :--- |
| **Apex Defense Systems** | `ADMIN` | Marcus Vance | `admin@apex.com` | `Password123!` |
| **Apex Defense Systems** | `MANAGER` | Sarah Connor | `manager@apex.com` | `Password123!` |
| **Apex Defense Systems** | `USER` | David Lightman | `analyst@apex.com` | `Password123!` |
| **Sentinel Cybernetics** | `ADMIN` | Elena Rostova | `admin@sentinel.com` | `Password123!` |
| **Sentinel Cybernetics** | `MANAGER` | Nathan Drake | `manager@sentinel.com` | `Password123!` |
| **Sentinel Cybernetics** | `USER` | Chloe Frazer | `user@sentinel.com` | `Password123!` |

---

## 📋 Core Requirements Compliance Matrix (100% Implemented)

### Requirement A: Authentication & Authorization
- **JWT Authentication**: Tokens are signed using HMAC SHA-256 with an 8-hour expiry. Protected routes require `Authorization: Bearer <token>`.
- **Password Security**: Passwords are mathematically hashed using `bcryptjs` with salt work-factor 10. No plain-text passwords exist anywhere in the system.
- **Three-Tier RBAC**: Native support for `ADMIN`, `MANAGER`, and `USER` roles.
- **Server-Side Guard Enforcement**: Permissions are enforced strictly in Express middleware (`requireRole(['ADMIN', 'MANAGER'])`). Bypassing the UI or calling APIs directly will return `403 Forbidden`.

### Requirement B: Multi-Tenancy & Zero-Trust Isolation
- **Multi-Tenant Architecture**: Shared database, shared schema model where every entity (`users`, `campaigns`, `security_events`, `audit_logs`) has a mandatory `tenant_id` foreign key.
- **Zero Frontend Trust**: The server **never trusts** client-supplied `tenant_id` parameters. The tenant ID is derived exclusively from the verified JWT payload (`req.user.tenantId`).
- **Anti-Enumeration 404s**: When an operative in Tenant A attempts to access or mutate an ID belonging to Tenant B (`GET /api/campaigns/:tenantB_id`), the server returns `404 Not Found` with zero data leakage.

### Requirement C: Campaign Management
- **Full CRUD Capabilities**: Create, read, update, and delete campaigns scoped strictly to the authenticated tenant.
- **Operative Assignment**: Assign operatives to campaigns (`POST /api/campaigns/:id/users`) and unassign operatives (`DELETE /api/campaigns/:id/users/:userId`).
- **Deterministic State Machine**:
  - `DRAFT` ➔ `ACTIVE` or `CANCELLED`
  - `ACTIVE` ➔ `COMPLETED` or `CANCELLED`
  - `COMPLETED` and `CANCELLED` are terminal states.
  - Invalid transitions (e.g., `COMPLETED` ➔ `DRAFT`) return `409 Conflict`.
- **Validation**: Strict validation on dates (converting empty strings `""` to `null`), required fields, and terminal campaign protection.

### Requirement D: Security Events & Audit Logs
- **Security Event Module**: Full incident lifecycle tracking with `event_type`, `severity` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), `status` (`OPEN`, `INVESTIGATING`, `RESOLVED`, `FALSE_POSITIVE`), description, and timestamps.
- **Server-Side Filtering & Pagination**: Filter events by severity and status with server-side offset pagination.
- **Tamper-Evident Audit Logging**: Every critical lifecycle event (user login, user provisioning, campaign status change, incident triage) is written to an immutable audit log.
- **Confidentiality Guards**: Audit logs are restricted strictly to `ADMIN` and `MANAGER` roles. Operatives with the `USER` role are barred from viewing audit trails (`403 Forbidden`).

### Requirement E: React Frontend Architecture
- **Enterprise Dark Cyber Theme**: Built with React 18, Vite, Tailwind CSS, Lucide icons, and Framer Motion.
- **3D Constellation Mesh**: Custom Three.js interactive WebGL security constellation hero visual.
- **Live SOC Defense Terminal**: Real-time multi-tenant boundary visualization, live UTC chronological telemetry feed, and automated test badges (no stock photos).
- **Session Routing Guards**: Smart browser history handling (`replace: true`) and `GuestRoute` wrappers to prevent back-button navigation to login when authenticated.
- **Tenant Overview Dashboard**: Live aggregated statistics (Operatives, Campaigns, Open Incidents, Critical Threats, Posture Distribution bar).
- **Role-Aware UI**: Buttons, action triggers, and administrative screens (User Directory, Audit Trail) dynamically reflect the operative's role.

### Requirement F: SQL Database & API Design
- **Database Engine**: PostgreSQL with Prisma ORM.
- **Relational Integrity**: Foreign key constraints, composite unique indexes, and `ON DELETE CASCADE / RESTRICT` rules.
- **SQL Injection Immunity**: 100% parameterized queries via Prisma.
- **Standardized REST HTTP Codes**: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`.

---

## 🛡️ Mandatory Security Scenario Walkthrough

### The Challenge
If Campaign `dbe04352-...` belongs to **Tenant B (Sentinel Cyber)**, a user authenticated under **Tenant A (Apex Defense)** must never be able to retrieve, view, or modify it.

### How Deep Trace Solves This
1. The user authenticates as `admin@apex.com`. The server signs a JWT containing `tenantId = '11111111-1111-1111-1111-111111111111'`.
2. The user initiates `GET /api/campaigns/dbe04352-c262-4a6c-89ed-8fed82eb7945` (which belongs to Sentinel Cyber).
3. The Express middleware extracts `req.tenantId` strictly from the JWT claims.
4. The database query is parameterized as:
   ```sql
   SELECT * FROM campaigns 
   WHERE id = 'dbe04352-c262-4a6c-89ed-8fed82eb7945' 
     AND tenant_id = '11111111-1111-1111-1111-111111111111' 
   LIMIT 1;
   ```
5. Since the tenant ID does not match, PostgreSQL returns 0 rows.
6. The service throws a `NotFoundError('Campaign not found')` which responds with:
   ```json
   {
     "success": false,
     "message": "Campaign not found",
     "errors": {}
   }
   ```
7. **Zero data leaked**: The attacker cannot even determine if that campaign ID exists in another organization.

---

## 🔄 End-to-End System Workflow for Reviewers

```
[ 1. Landing Page ] ──> [ 2. Auth Portal ] ──> [ 3. SOC Dashboard ]
        │                       │                       │
        ▼                       ▼                       ▼
  3D Mesh Hero &          Live Terminal &         Aggregated Metrics &
  Technical Specs         Demo Preset Tabs        Threat Posture Bar
                                                        │
         ┌──────────────────────┬───────────────────────┼──────────────────────┐
         ▼                      ▼                       ▼                      ▼
[ 4. Campaigns ]      [ 5. Incidents ]       [ 6. Operatives ]      [ 7. Audit Trail ]
  CRUD & State          Severity & Status       ADMIN-only User        Immutable SHA-256
  Transitions           Triage Filters          Directory & Roles      Security Ledger
```

### Step 1: Landing Page (`/`)
- Demonstrates technical specification adherence, architecture pipeline, and WebGL 3D constellation.
- Dynamically displays **"Open Console"** if an active session is already authenticated.

### Step 2: Authentication Portal (`/login`)
- Click **"Apex Defense" ➔ "Admin"** to load `admin@apex.com` / `Password123!`.
- Click **"Sign In"** to authenticate. The app generates a cryptographically signed JWT and routes directly to `/dashboard`.

### Step 3: SOC Overview Dashboard (`/dashboard`)
- View aggregated operational metrics scoped exclusively to Apex Defense.
- Shows total operatives (3), active campaigns (1), open threat events (2), and recent security incidents.

### Step 4: Campaign Lifecycle Management (`/campaigns`)
- Inspect campaigns scoped to the tenant.
- Click **"New Campaign"** to create a campaign in `DRAFT` status.
- Open campaign detail to assign operatives or transition state to `ACTIVE` ➔ `COMPLETED`.
- Attempting an illegal transition is rejected with clean validation feedback.

### Step 5: Security Incident Desk (`/security-events`)
- Filter live incidents by severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) and status (`OPEN`, `INVESTIGATING`, `RESOLVED`).
- Click on an incident to triage and change status with an automatic audit trail entry.

### Step 6: Operative Directory (`/users`)
- Logged in as `ADMIN`, view and provision operatives, or promote roles between `ANALYST`, `MANAGER`, and `ADMIN`.
- *(Notice: Logging in as `USER` David Lightman hides this section and rejects direct API calls with `403 Forbidden`)*.

### Step 7: Immutable Audit Trail (`/audit-logs`)
- Review tamper-evident logs tracking every login, operative modification, and campaign update with timestamps and actor identities.

### Step 8: Multi-Tenant Verification (Sentinel Cyber)
- Click **"Sign Out"** in the top navigation bar.
- On the login screen, select **"Sentinel Cyber" ➔ "Admin"** (`admin@sentinel.com`).
- Notice that the dashboard, campaigns, users, and audit logs now display **100% distinct Sentinel Cyber data**. Zero Apex Defense records are visible.

---

## 🧪 Automated Security Test Suite (31 Passed, 0 Failed)

Run the test suite locally in the `backend/` directory:
```bash
npm test
```

### Verified Test Cases:
1. **Authentication & Token Issuance**: Valid JWT claims, distinct tenant IDs across organizations.
2. **Cross-Tenant Isolation (Tenant A vs Tenant B)**: Cross-tenant `GET`, `PATCH`, and `DELETE` return `404 Not Found` with zero data exposure.
3. **Role-Based Access Control**: `USER` role attempting administrative endpoints strictly returns `403 Forbidden`.
4. **Campaign State Transitions**: Valid transitions succeed; invalid transitions (e.g. `COMPLETED` ➔ `DRAFT`) return `409 Conflict`.
5. **Tenant ID Spoofing Immunity**: Spoofed `tenant_id` payloads in request bodies are ignored; identity is derived exclusively from JWT.
6. **Audit Log Recording**: Critical lifecycle actions are recorded with actor and timestamp metadata.
7. **Operative Role Provisioning**: `ADMIN` can provision managers and promote operatives to `ADMIN`.
8. **Dashboard Confidentiality**: `USER` role receives empty administrative audit views.
9. **Form Date Serialization**: Empty date strings serialize to `null` cleanly without validation errors.
10. **Terminal State Protection**: Assigning operatives to completed campaigns returns `409 Conflict`.
11. **Foreign Key Integrity**: Deleting active administrators or campaign creators returns clean `400/409 Conflict` without 500 server crashes.

---

## 💡 Engineering Answers to Architecture Questions

### Q1: How would you scale this to 1,000 tenants / 1M users?
1. **Database Partitioning & Read Replicas**:
   - Utilize PostgreSQL declarative table partitioning by `tenant_id` (list partitioning) or a dedicated schema-per-tenant model for enterprise tiers.
   - Deploy read-replicas with connection pooling (`PgBouncer`) to direct dashboard analytical reads away from the primary write node.
2. **Distributed Caching (Redis)**:
   - Cache dashboard KPI metrics and tenant metadata in Redis with tenant keys (`tenant:{tenantId}:metrics`), invalidated on event mutations with a short TTL (30s).
3. **Stateless Horizontal Scaling**:
   - Deploy containerized Express API instances behind an Application Load Balancer (ALB) or Kubernetes cluster with horizontal pod autoscaling based on CPU/RPS.

### Q2: How would you handle JWT revocation?
1. **Short-Lived Access Tokens + Refresh Token Rotation**:
   - Issue access tokens with a 10–15 minute lifetime, paired with opaque, single-use refresh tokens stored in PostgreSQL/Redis with family tracking.
2. **Instant User Invalidation (`token_version`)**:
   - Store an integer `token_version` on the `users` table and embed it in the JWT claims. When an admin revokes access or a password changes, increment `token_version`. Middleware rejects any token with an outdated version.
3. **Distributed Token Blocklist (Redis)**:
   - Store revoked JWT IDs (JTIs) in Redis with a TTL matching the token's remaining lifespan (`SETEX blacklist:{jti} {ttl} "revoked"`).

### Q3: How would you troubleshoot a production API returning many 500 errors?
1. **Correlate with APM & Distributed Tracing**:
   - Inspect APM error telemetry (Sentry, Datadog) and filter server logs by `X-Correlation-ID` to pinpoint failing stack traces.
2. **Determine Blast Radius**:
   - Identify whether the errors impact all tenants (database pool exhaustion, network partition, bad deployment) or an isolated tenant (corrupt data record, schema drift).
3. **Check Infrastructure Health**:
   - Monitor database active connection count, lock contention, memory usage, and recent migration status.
4. **Mitigate & Remediate**:
   - If tied to a recent deployment, execute an immediate rollback to the previous stable release artifact.
   - Reproduce the failing condition in staging, write an automated regression test in `tests/security.test.js`, and patch.

---

## 🎁 Bonus Deliverables Included

1. **Docker & Docker Compose**: Multi-container stack in [`docker-compose.yml`](./docker-compose.yml) (`PostgreSQL` + `Backend API` + `Frontend Nginx`).
2. **Postman API Collection**: [`DeepTrace_Postman_Collection.json`](./DeepTrace_Postman_Collection.json) with pre-configured requests and token capture.
3. **Automated CI/CD Pipeline**: GitHub Actions workflow in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) testing database migrations, running the 31-test security suite, and building the frontend on every push.
4. **Infrastructure as Code**: Render Blueprint specification in [`render.yaml`](./render.yaml).

---

## 🏁 Submission Summary

- **GitHub Repository**: [https://github.com/hemant-pawade/deeptrace-security-platform](https://github.com/hemant-pawade/deeptrace-security-platform)
- **Live Platform**: [https://deeptrace-frontend-mksy.onrender.com](https://deeptrace-frontend-mksy.onrender.com)
- **Status**: **100% Core Requirements Complete • 31/31 Security Tests Passing • Production Live**
