const config = require('../config');

function getGatewayRoot(req, res) {
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');

  if (!acceptsHtml) {
    return res.status(200).json({
      service: 'Deep Trace Cybernetics — Security Gateway API',
      status: 'OPERATIONAL',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      frontend_url: 'https://deeptrace-frontend-mksy.onrender.com',
      health_check: '/health',
      documentation: 'https://github.com/hemant-pawade/deeptrace-security-platform#readme',
      endpoints: {
        auth: ['POST /api/auth/login', 'GET /api/auth/me'],
        users: ['GET /api/users', 'POST /api/users', 'PATCH /api/users/:id', 'DELETE /api/users/:id'],
        campaigns: ['GET /api/campaigns', 'POST /api/campaigns', 'PATCH /api/campaigns/:id', 'DELETE /api/campaigns/:id'],
        security_events: ['GET /api/security-events', 'POST /api/security-events', 'PATCH /api/security-events/:id'],
        audit_logs: ['GET /api/audit-logs'],
        dashboard: ['GET /api/dashboard/summary', 'GET /api/dashboard/activity'],
      },
    });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deep Trace Cybernetics — API Gateway</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #07090e;
      --card-bg: rgba(15, 23, 42, 0.75);
      --border: rgba(30, 41, 59, 0.8);
      --border-glow: rgba(16, 185, 129, 0.25);
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --emerald: #10b981;
      --emerald-glow: rgba(16, 185, 129, 0.15);
      --cyan: #06b6d4;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
      line-height: 1.5;
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.12) 0%, transparent 60%),
        radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 40%);
    }
    .container {
      width: 100%;
      max-width: 960px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--emerald-glow);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.lead {
      color: var(--text-muted);
      font-size: 16px;
      max-width: 600px;
      margin: 0 auto;
    }
    .cta-card {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%);
      border: 1px solid var(--border-glow);
      border-radius: 16px;
      padding: 28px;
      text-align: center;
      margin-bottom: 32px;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }
    .cta-card h2 {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #fff;
    }
    .cta-card p {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .btn-group {
      display: flex;
      gap: 14px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-primary {
      background: #10b981;
      color: #04100b;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.35);
    }
    .btn-primary:hover {
      background: #059669;
      transform: translateY(-2px);
      box-shadow: 0 0 25px rgba(16, 185, 129, 0.5);
    }
    .btn-secondary {
      background: rgba(30, 41, 59, 0.8);
      color: #e2e8f0;
      border: 1px solid rgba(51, 65, 85, 0.8);
    }
    .btn-secondary:hover {
      background: rgba(51, 65, 85, 0.8);
      color: #fff;
      transform: translateY(-2px);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 22px;
      backdrop-filter: blur(12px);
    }
    .card h3 {
      font-size: 15px;
      font-weight: 700;
      color: #e2e8f0;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card p, .card li {
      font-size: 13px;
      color: var(--text-muted);
    }
    .card ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .card code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      background: rgba(2, 6, 23, 0.8);
      padding: 2px 6px;
      border-radius: 4px;
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.2);
    }
    .endpoint-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      font-family: 'JetBrains Mono', monospace;
      margin-top: 8px;
    }
    .endpoint-table td {
      padding: 6px 0;
      border-bottom: 1px solid rgba(30, 41, 59, 0.5);
    }
    .method-get { color: #38bdf8; font-weight: 600; }
    .method-post { color: #34d399; font-weight: 600; }
    .method-patch { color: #fbbf24; font-weight: 600; }
    .method-delete { color: #f87171; font-weight: 600; }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #64748b;
      margin-top: 10px;
      padding-top: 20px;
      border-top: 1px solid rgba(30, 41, 59, 0.4);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">
        <div class="pulse-dot"></div>
        Core Gateway Status: Operational
      </div>
      <h1>Deep Trace Cybernetics — API Gateway</h1>
      <p class="lead">Multi-Tenant Security Operations Platform & Defense Telemetry Engine</p>
    </div>

    <div class="cta-card">
      <h2>Looking for the Web Application?</h2>
      <p>You have accessed the backend REST API gateway service directly. To access the interactive Security Command Center, click the button below:</p>
      <div class="btn-group">
        <a href="https://deeptrace-frontend-mksy.onrender.com" target="_blank" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          Launch Web Console
        </a>
        <a href="https://github.com/hemant-pawade/deeptrace-security-platform" target="_blank" class="btn btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          GitHub Repository
        </a>
        <a href="https://drive.google.com/file/d/14N5ejFt6owvAEK8P45zLbKIyI8GY25_3/view?usp=sharing" target="_blank" class="btn btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Walkthrough Video
        </a>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>🛡️ Platform Architecture</h3>
        <ul>
          <li>• Shared-DB / Shared-Schema PostgreSQL Multi-Tenancy</li>
          <li>• Cryptographic HMAC SHA-256 JWT Authorization</li>
          <li>• Zero-Trust Server-Side Tenant Isolation</li>
          <li>• Three-Tier RBAC: <code>ADMIN</code>, <code>MANAGER</code>, <code>USER</code></li>
          <li>• 31/31 Automated Security Test Coverage</li>
        </ul>
      </div>

      <div class="card">
        <h3>🔑 Evaluation Credentials</h3>
        <ul>
          <li><strong>Apex Defense Systems (Tenant 1):</strong></li>
          <li><code>admin@apex.com</code> | <code>Password123!</code> (ADMIN)</li>
          <li><code>manager@apex.com</code> | <code>Password123!</code> (MANAGER)</li>
          <li style="margin-top: 6px;"><strong>Sentinel Cybernetics (Tenant 2):</strong></li>
          <li><code>admin@sentinel.com</code> | <code>Password123!</code> (ADMIN)</li>
          <li><code>user@sentinel.com</code> | <code>Password123!</code> (USER)</li>
        </ul>
      </div>

      <div class="card" style="grid-column: 1 / -1;">
        <h3>⚡ Active REST API Routes</h3>
        <table class="endpoint-table">
          <tr><td class="method-post">POST</td><td>/api/auth/login</td><td>Public authentication & token issuance</td></tr>
          <tr><td class="method-get">GET</td><td>/api/auth/me</td><td>Verify session identity & tenant context</td></tr>
          <tr><td class="method-get">GET</td><td>/api/campaigns</td><td>List tenant security campaigns</td></tr>
          <tr><td class="method-post">POST</td><td>/api/campaigns</td><td>Create campaign (ADMIN / MANAGER)</td></tr>
          <tr><td class="method-get">GET</td><td>/api/security-events</td><td>Paginated severity & status telemetry</td></tr>
          <tr><td class="method-get">GET</td><td>/api/audit-logs</td><td>Tamper-evident audit trail (ADMIN only)</td></tr>
          <tr><td class="method-get">GET</td><td>/health</td><td>Container health & liveness probe (200 OK)</td></tr>
        </table>
      </div>
    </div>

    <div class="footer">
      Deep Trace Cybernetics Technical Assessment • Candidate: Hemant Pawade • Full Stack Developer
    </div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
}

module.exports = {
  getGatewayRoot,
};
