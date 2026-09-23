# Deep Trace Cybernetics — Multi-Tenant Security Management Platform

> **Technical Assessment Submission**  
> **Tech Stack:** Node.js / Express.js • React.js / Vite • PostgreSQL / Prisma • Tailwind CSS • Framer Motion

### 🌐 Live Production Deployment
- **Live Frontend Application**: [https://deeptrace-frontend-mksy.onrender.com](https://deeptrace-frontend-mksy.onrender.com)
- **Live Backend API Web Service**: [https://deeptrace-backend-lyxk.onrender.com](https://deeptrace-backend-lyxk.onrender.com)
- **API Health Endpoint**: [https://deeptrace-backend-lyxk.onrender.com/health](https://deeptrace-backend-lyxk.onrender.com/health)
- **GitHub Repository**: [https://github.com/hemant-pawade/deeptrace-security-platform](https://github.com/hemant-pawade/deeptrace-security-platform)
- **Walkthrough Demo Video**: [Watch Demo on Google Drive](https://drive.google.com/file/d/14N5ejFt6owvAEK8P45zLbKIyI8GY25_3/view?usp=sharing) *(Public Access)*

A production-grade, multi-tenant security operations and campaign management platform built with strict tenant isolation, cryptographic role-based access control (RBAC), tamper-evident audit logging, and deterministic campaign lifecycle state machines.

---

## 1. Architecture Overview

Deep Trace Cybernetics employs a **shared-database, shared-schema multi-tenancy model** with rigid cryptographic isolation enforced at both the middleware and query layers.

```
                           +---------------------------------------+
                           |       React 18 + Vite Frontend        |
                           |  (Cybersecurity-Themed Operations UI)  |
                           +-------------------+-------------------+
                                               | JWT Bearer Token
                                               v
+--------------------------------------------------------------------------------------------------+
|                                    Express.js API Gateway                                        |
|                                                                                                  |
|   Middleware Pipeline:                                                                           |
|   authenticateToken -> requireRole([...]) -> requireTenantAccess -> validateRequest -> Controller |
|                                                                                                  |
|   Core Modules:                                                                                  |
|   * Auth Service         (Bcrypt cost-10, JWT claim injection)                                   |
|   * User Management      (ADMIN-only mutations, tenant isolation)                               |
|   * Campaign Service     (Deterministic lifecycle transitions: DRAFT -> ACTIVE -> COMPLETED)     |
|   * Security Events      (Severity & Status filtering, server-side pagination)                   |
|   * Immutable Audit Log  (Tamper-evident record of all administrative actions)                   |
|   * Telemetry Dashboard  (Aggregated tenant KPI metrics & live security feeds)                  |
+--------------------------------------------------+-----------------------------------------------+
                                                   | Parameterized Prisma Queries
                                                   v
+--------------------------------------------------------------------------------------------------+
|                                  PostgreSQL Database (Engine)                                    |
|   tenants | users | campaigns | campaign_users | security_events | audit_logs                      |
|   Indexed by: tenant_id, status, severity, user_id, email                                        |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Mandatory Security & Tenant Isolation Model

### How Tenant Isolation is Enforced
Tenant data isolation is guaranteed through multiple layers of non-bypassable controls:

1. **Zero Client Trust (`requireTenantAccess` middleware)**:
   - Client requests are prohibited from declaring their tenant. Any `tenant_id` or `tenantId` field supplied in `req.body`, `req.query`, or `req.params` is stripped before hitting controllers.
   - The tenant identity is derived **strictly from the cryptographically verified JWT payload** (`req.user.tenantId`).
2. **Repository Query Scoping**:
   - Every single database read, write, update, and delete is explicitly scoped by `tenant_id`:
     ```typescript
     // Example from campaign.repository.js
     prisma.campaign.findFirst({
       where: {
         id: campaignId,
         tenant_id: req.tenantId  // Derived strictly from JWT
       }
     });
     ```
3. **Cross-Tenant Access Defense (404 Anti-Enumeration)**:
   - When a user from Tenant A attempts to fetch, modify, or delete a resource ID belonging to Tenant B (`GET /api/campaigns/201`), the server returns **`404 Not Found`**.
   - Returning `404` instead of `403` prevents cross-tenant resource enumeration (attackers cannot even discover if an ID exists in another tenant).
4. **Independent Role Enforcement (`requireRole` middleware)**:
   - Backend route guards verify the authenticated user's role on every single API hit, regardless of what the UI renders. Direct API calls with unauthorized roles return **`403 Forbidden`**.

---

## 3. Role-Based Access Control (RBAC) Matrix

| Resource / Action | ADMIN | MANAGER | USER (Analyst) | Backend Enforcement |
| :--- | :---: | :---: | :---: | :---: |
| **View Dashboard & Metrics** | Full Tenant View | Full Tenant View | Assigned Scope Only | `requireRole(['ADMIN','MANAGER','USER'])` |
| **List / View Campaigns** | Full Tenant View | Full Tenant View | Assigned Campaigns Only | `requireRole(['ADMIN','MANAGER','USER'])` + User assignment filter |
| **Create / Update Campaigns** | Yes | Yes | No | `requireRole(['ADMIN','MANAGER'])` |
| **Assign / Remove Campaign Users** | Yes | Yes | No | `requireRole(['ADMIN','MANAGER'])` |
| **Delete Campaigns** | Yes | Yes | No | `requireRole(['ADMIN','MANAGER'])` |
| **View Security Events** | Yes | Yes | Yes | `requireRole(['ADMIN','MANAGER','USER'])` |
| **Create / Resolve Security Events** | Yes | Yes | No | `requireRole(['ADMIN','MANAGER'])` |
| **View User Directory** | Yes | Yes | No | `requireRole(['ADMIN','MANAGER'])` |
| **Provision / Modify / Delete Users** | Yes | No | No | `requireRole(['ADMIN'])` |
| **Access Immutable Audit Trail** | Yes | Yes | No | `requireRole(['ADMIN','MANAGER'])` |

---

## 4. Campaign Lifecycle State Machine

Campaigns strictly enforce a deterministic state transition machine. Any illegal status transition returns **`409 Conflict`**:

```
           +--------------+
           |    DRAFT     |
           +-------+------+
                   |
         +---------+---------+
         |                   |
         v                   v
   +-----------+       +-----------+
   |  ACTIVE   |       | CANCELLED | (Terminal)
   +-----+-----+       +-----------+
         |
    +----+----+
    |         |
    v         v
+-------+ +-----------+
|COMPL. | | CANCELLED | (Terminal)
+-------+ +-----------+
(Terminal)
```
- `DRAFT` can move to `ACTIVE` or `CANCELLED`.
- `ACTIVE` can move to `COMPLETED` or `CANCELLED`.
- `COMPLETED` and `CANCELLED` are terminal and cannot be transitioned to any other state.

---

## 5. Sample Credentials & Test Presets

All passwords in the database are hashed with `bcryptjs` (salt cost factor 10). A convenient quick-login preset bar is available directly on the frontend login page.

| Tenant | Name | Role | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Apex Defense Systems** | Marcus Vance | `ADMIN` | `admin@apex.com` | `Password123!` |
| **Apex Defense Systems** | Sarah Connor | `MANAGER` | `manager@apex.com` | `Password123!` |
| **Apex Defense Systems** | David Lightman | `USER` | `analyst@apex.com` | `Password123!` |
| **Sentinel Cybernetics** | Elena Rostova | `ADMIN` | `admin@sentinel.com` | `Password123!` |
| **Sentinel Cybernetics** | Nathan Drake | `MANAGER` | `manager@sentinel.com` | `Password123!` |
| **Sentinel Cybernetics** | Chloe Frazer | `USER` | `user@sentinel.com` | `Password123!` |

---

## 6. Setup and Installation

### Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **PostgreSQL** v14+ (local instance running on port 5432)

### Step 1: Database Setup
Ensure PostgreSQL is running and create the database:
```sql
CREATE DATABASE deeptrace_db;
```

### Step 2: Backend Configuration & Seed
Navigate to `backend`:
```bash
cd backend
npm install
```

Configure `.env` (a pre-configured `.env.example` is included):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/deeptrace_db?schema=public"
JWT_SECRET="deeptrace_super_secret_jwt_key_2026_production_grade_security"
JWT_EXPIRES_IN="8h"
CORS_ORIGIN="http://localhost:5173"
```

Push schema to PostgreSQL and populate seed data:
```bash
npx prisma db push
node prisma/seed.js
```

Run automated security test suite (verifies cross-tenant isolation and 403 route guards):
```bash
npm test
```

Start the backend API server:
```bash
npm run dev
# Server running at http://localhost:5000
```

### Step 3: Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Frontend live at http://localhost:5173
```

---

## 7. Complete API Reference

All list endpoints support server-side pagination, search, sorting, and filtering:
Response shape: `{ "data": [...], "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 } }`

### Authentication
- `POST /api/auth/login` — Authenticate credentials, return JWT & tenant profile.
- `GET /api/auth/me` — Retrieve authenticated user profile with verified tenant identity.

### Users (ADMIN only for mutations)
- `GET /api/users` — List tenant users (filter by `role`, `search`, `sortBy`, `sortOrder`).
- `GET /api/users/:id` — View tenant user details.
- `POST /api/users` — Provision new operative (ADMIN only).
- `PATCH /api/users/:id` — Update operative details or role (ADMIN only).
- `DELETE /api/users/:id` — Revoke user access (ADMIN only).

### Campaigns (ADMIN & MANAGER)
- `GET /api/campaigns` — List tenant campaigns (USER role sees assigned only).
- `GET /api/campaigns/:id` — View campaign details.
- `POST /api/campaigns` — Create campaign (default status `DRAFT`).
- `PATCH /api/campaigns/:id` — Update campaign (enforces state machine).
- `DELETE /api/campaigns/:id` — Delete campaign.
- `GET /api/campaigns/:id/users` — List assigned operatives.
- `POST /api/campaigns/:id/users` — Assign operative to campaign.
- `DELETE /api/campaigns/:id/users/:userId` — Remove operative from campaign.

### Security Events
- `GET /api/security-events` — List events (filter by `severity`, `status`, `search`).
- `GET /api/security-events/:id` — View event details.
- `POST /api/security-events` — Record new security event.
- `PATCH /api/security-events/:id` — Update event status (`OPEN` <-> `RESOLVED`).

### Audit Trail (ADMIN & MANAGER)
- `GET /api/audit-logs` — Server-side paginated immutable audit trail.

### Dashboard Telemetry
- `GET /api/dashboard/metrics` — Tenant-scoped KPIs (users, campaigns, open/critical events).
- `GET /api/dashboard/recent-activity` — Recent security alerts and audit actions.

---

## 8. Engineering Responses to Production Questions

### Q1: How would you scale this platform to 1,000 tenants / 1M users?
1. **Database Indexing & Query Optimization**:
   - Compound indexes on all tenant tables: `(tenant_id, created_at DESC)` and `(tenant_id, status)`. Every query plans an index range scan bounded by `tenant_id`.
2. **Connection Pooling & Read Replicas**:
   - Deploy **PgBouncer** or **Prisma Accelerate** in transaction pooling mode to manage thousands of concurrent Node.js connections without saturating Postgres connection limits.
   - Route all read queries (`GET /api/campaigns`, `GET /api/security-events`) to horizontal read replicas using Prisma multi-engine read/write splitting.
3. **Partitioning & Sharding Strategy**:
   - For PostgreSQL, implement **declarative table partitioning by LIST on `tenant_id`** or hash partitioning across multiple physical nodes (Citus Data).
   - If enterprise tenants exhibit extreme throughput variance, migrate large tenants to dedicated schemas (schema-per-tenant) while keeping standard tenants in the shared schema.
4. **Caching Layer (Redis)**:
   - Cache dashboard metrics and tenant metadata in Redis with tenant keys (`tenant:{tenantId}:metrics`), invalidated on event mutations with a short TTL (30s).
5. **Horizontal API Scaling**:
   - Stateless Express instances running in Docker containers behind an Application Load Balancer (ALB) or Kubernetes Ingress with auto-scaling based on CPU/RPS.

---

### Q2: How would you handle JWT revocation?
1. **Short-Lived Access Tokens + Refresh Token Rotation**:
   - Configure access tokens with a short lifespan (10–15 minutes).
   - Issue opaque, cryptographically random refresh tokens stored in a PostgreSQL/Redis table (`refresh_tokens`) hashed with SHA-256. On token refresh, rotate the refresh token and revoke the previous family.
2. **Instant User/Session Revocation (`token_version` column)**:
   - Add an integer `token_version` column to the `users` table. Embed `tokenVersion` inside the JWT payload.
   - If an admin clicks "Revoke User Access" or changes a password, increment `token_version` in the database.
   - In authentication middleware, compare `jwt.tokenVersion === dbUser.tokenVersion`. If mismatched, immediately reject with `401 Unauthorized`.
3. **Distributed Token Blocklist (Redis)**:
   - For emergency tenant-wide or user-wide revocations, store invalidated token JTI (JWT ID) in Redis with an expiration matching the token's remaining TTL (`SETEX blacklist:{jti} {ttl} "revoked"`). The auth middleware performs an $O(1)$ cache lookup.

---

### Q3: How would you troubleshoot a production API returning many 500 errors?
1. **Correlate and Isolate (Logging & APM)**:
   - Check APM telemetry (Sentry, Datadog, AWS CloudWatch) to isolate the error spike.
   - Filter logs by HTTP 500 and inspect the distributed `X-Correlation-ID` header attached by Express to trace the failing request lifecycle.
2. **Identify Blast Radius**:
   - Determine whether the 500 errors affect **all tenants** (indicating a database connection pool exhaustion, memory leak, or bad release) or **a single tenant** (indicating an unhandled edge case or corrupted tenant record).
3. **Inspect Infrastructure & Dependencies**:
   - Check database metrics: connection pool usage, lock contention, CPU spikes, slow query logs, and disk space.
   - Check if a recent deployment or database migration occurred immediately prior to the incident.
4. **Mitigate Immediately**:
   - If tied to a recent release, roll back to the previous stable release artifact.
   - If tied to database load, scale connection pool capacity or restart stale replica connections.
5. **Root-Cause & Regression Defense**:
   - Reproduce the exact failing payload and database state in a staging environment.
   - Implement the fix, write an automated regression test in `tests/security.test.js` to ensure the bug cannot resurface, and redeploy through CI/CD with continuous health-check validation.

---

## 9. Verification & Test Suite Results

The platform includes an automated security test runner in `backend/tests/security.test.js`:
```bash
npm test
```
**Test Output Verification (31 Passed, 0 Failed):**
- **Authentication & JWT Issuance**: Valid token claims, distinct tenant IDs.
- **Cross-Tenant Isolation**: Cross-tenant `GET`, `PATCH`, `DELETE` return `404 Not Found` (Zero data leak).
- **Role-Based Access Control**: USER role attempting `DELETE /api/campaigns`, `POST /api/campaigns`, `GET /api/audit-logs`, `POST /api/users` strictly return `403 Forbidden`.
- **Campaign State Machine**: Terminal `COMPLETED` -> `DRAFT` transition returns `409 Conflict`; valid `DRAFT` -> `ACTIVE` succeeds.
- **Tenant ID Spoofing Immunity**: Spoofed `tenant_id` in request body is stripped; tenant identity derived exclusively from JWT.
- **Audit Logging**: Verified records for user logins, campaign creation, and operative assignments.
- **Role Provisioning & Mutations**: ADMIN successfully provisions `MANAGER` and promotes operatives to `ADMIN`.
- **Dashboard RBAC Confidentiality**: USER role calling `/api/dashboard/recent-activity` receives empty audit trail with zero administrative leakage.
- **Form Date Handling**: Empty date strings `""` serialize to `null` cleanly without 400 validation rejections.
- **Terminal State Protection**: Assigning operatives to a completed campaign returns `409 Conflict`.
- **Foreign Key Integrity**: Deleting active admin or campaign creators returns `400/409 Conflict` without 500 crashes.

---

## 10. Deploying to Render (Full Stack: DB, Backend, Frontend)

The repository includes a ready-to-use **`render.yaml` Blueprint** that provisions PostgreSQL, the Express API Web Service, and the Vite Static Site automatically.

### Option A: One-Click Blueprint Deployment (Recommended)
1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository: `https://github.com/hemant-pawade/deeptrace-security-platform`.
4. Render will read `render.yaml` and display the 3 resources:
   - **`deeptrace-db`**: Managed PostgreSQL Database
   - **`deeptrace-backend`**: Node.js Web Service (auto-executes Prisma schema push & seed)
   - **`deeptrace-frontend`**: Vite Static Site (with SPA client-side routing)
5. Click **Apply**.
6. Render will automatically provision the database, build & seed the backend, and deploy the frontend.

---

### Option B: Manual Service-by-Service Deployment on Render

If you prefer deploying services individually:

#### 1. PostgreSQL Database
- Click **New +** > **PostgreSQL**.
- Name: `deeptrace-db`.
- Database: `deeptrace_db`.
- User: `postgres`.
- Copy the **Internal Database URL** (e.g., `postgresql://...`).

#### 2. Backend Web Service
- Click **New +** > **Web Service**.
- Select your repository: `deeptrace-security-platform`.
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npx prisma generate && npx prisma db push && node prisma/seed.js`
- **Start Command**: `node src/server.js`
- **Environment Variables**:
  - `DATABASE_URL`: *(Paste the Internal Database URL from Step 1)*
  - `JWT_SECRET`: `deeptrace_super_secret_jwt_key_2026_production_grade_security`
  - `NODE_ENV`: `production`
  - `CORS_ORIGIN`: `*`
- Click **Create Web Service**. Copy the generated URL (e.g. `https://deeptrace-backend.onrender.com`).

#### 3. Frontend Static Site
- Click **New +** > **Static Site**.
- Select your repository: `deeptrace-security-platform`.
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://deeptrace-backend.onrender.com` *(Your Backend URL)*
- **Redirects / Rewrites**:
  - Rule already included via `frontend/public/_redirects` (`/* /index.html 200`).
- Click **Create Static Site**.

---

## 11. Docker & Docker Compose (Bonus)

Run the complete multi-container stack (PostgreSQL + Backend + Frontend) locally with a single command:

```bash
docker-compose up --build
```
- **Frontend**: `http://localhost` (Port 80 via Nginx reverse proxy)
- **Backend API**: `http://localhost:5000`
- **PostgreSQL**: `localhost:5432`

---

## 12. Postman Collection & CI Pipeline (Bonus)

### Postman Collection
Import [`DeepTrace_Postman_Collection.json`](./DeepTrace_Postman_Collection.json) into Postman to test:
- Authentication & JWT token capture (`Apex Admin`, `Apex Manager`, `Apex Analyst`, `Sentinel Admin`)
- Cross-tenant access attempts (demonstrating expected `404 Not Found`)
- State transitions (`DRAFT` -> `ACTIVE` -> `COMPLETED`)
- Security event triage & immutable audit trail queries

### GitHub Actions CI
Automated CI workflow in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml):
- Boots an isolated PostgreSQL 15 service container
- Runs database migrations & seed scripts
- Executes all 31 automated security test assertions
- Compiles & builds the production Vite frontend bundle

