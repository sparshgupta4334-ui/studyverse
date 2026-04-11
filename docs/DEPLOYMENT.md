# KhataBook Pro — Production Deployment Guide

This guide covers deploying KhataBook Pro on **AWS** (EC2 + RDS + ElastiCache) with
Nginx as a reverse proxy, PM2 as the process manager, and Let's Encrypt for SSL.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Firebase Setup for OTP](#3-firebase-setup-for-otp)
4. [AWS Infrastructure Setup](#4-aws-infrastructure-setup)
   - 4.1 [EC2 Instance](#41-ec2-instance)
   - 4.2 [RDS PostgreSQL 16](#42-rds-postgresql-16)
   - 4.3 [ElastiCache Redis 7](#43-elasticache-redis-7)
5. [Application Deployment](#5-application-deployment)
6. [Environment Variables Guide](#6-environment-variables-guide)
7. [Nginx Configuration](#7-nginx-configuration)
8. [SSL / HTTPS Setup](#8-ssl--https-setup)
9. [PM2 Process Management](#9-pm2-process-management)
10. [Database Backup Strategy](#10-database-backup-strategy)
11. [Monitoring & Logging](#11-monitoring--logging)
12. [Auto-Scaling Considerations](#12-auto-scaling-considerations)

---

## 1. Architecture Overview

```
                        ┌─────────────────────────────────┐
  Flutter App ──HTTPS──▶│  Nginx (reverse proxy + SSL)    │
                        │  EC2 t3.small (or larger)        │
                        │  ┌───────────────────────────┐  │
                        │  │  Node.js (PM2 cluster)    │  │
                        │  │  Port 3000                │  │
                        │  └───────────┬───────────────┘  │
                        └─────────────┼───────────────────┘
                                      │ Private VPC subnet
                          ┌───────────┴──────────┐
                          │                      │
                    ┌─────▼──────┐      ┌────────▼───────┐
                    │  RDS        │      │  ElastiCache    │
                    │  PostgreSQL │      │  Redis 7        │
                    │  db.t3.micro│      │  cache.t3.micro │
                    └────────────┘      └────────────────┘
```

- All database traffic stays inside the private VPC subnet.
- Nginx terminates TLS and proxies HTTP/1.1 to Node.js on `localhost:3000`.
- PM2 runs Node.js in **cluster mode** using all available CPU cores.

---

## 2. Prerequisites

| Tool | Version | Notes |
|---|---|---|
| AWS CLI | v2 | Configured with IAM user/role |
| Node.js | ≥ 18 LTS | Install via `nvm` |
| PM2 | v5 | `npm install -g pm2` |
| Nginx | 1.24+ | `apt install nginx` |
| Certbot | latest | `snap install --classic certbot` |
| Git | any | For code deployment |

---

## 3. Firebase Setup for OTP

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Create project**.
2. Enable **Phone Authentication**:
   - Authentication → Sign-in method → Phone → Enable.
3. Generate a **Service Account key**:
   - Project Settings → Service Accounts → Generate new private key.
   - Download the JSON file — you'll need its fields for `.env.production`.
4. Add your production domain to **Authorized Domains**:
   - Authentication → Settings → Authorized domains → Add domain.
5. (Flutter) Add `google-services.json` (Android) and `GoogleService-Info.plist`
   (iOS) downloaded from the Firebase project settings.

> **Security note:** Never commit the service account JSON file to source control.
> Use AWS Secrets Manager or environment variables exclusively.

---

## 4. AWS Infrastructure Setup

### 4.1 EC2 Instance

**Recommended specs (production start):**
- Instance type: `t3.small` (2 vCPU, 2 GB RAM) — scale up as needed
- OS: Ubuntu 22.04 LTS
- Storage: 20 GB gp3 root volume
- Security Group inbound rules:

| Port | Protocol | Source | Purpose |
|---|---|---|---|
| 22 | TCP | Your IP only | SSH |
| 80 | TCP | 0.0.0.0/0, ::/0 | HTTP → redirects to HTTPS |
| 443 | TCP | 0.0.0.0/0, ::/0 | HTTPS |

**Initial setup:**

```bash
# Connect
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18 && nvm use 18 && nvm alias default 18

# Install PM2 and build tools
npm install -g pm2
sudo apt install -y git nginx certbot python3-certbot-nginx
```

### 4.2 RDS PostgreSQL 16

1. RDS Console → Create database → **PostgreSQL 16**
2. Template: **Production** (Multi-AZ for HA) or **Dev/Test** for cost savings
3. Settings:
   - DB instance identifier: `khatabook-prod`
   - Master username: `khata_user`
   - Master password: *strong random password*
4. Connectivity:
   - VPC: same VPC as EC2
   - Public access: **No**
   - VPC security group: allow port 5432 **from EC2 security group only**
5. Additional configuration:
   - Initial database name: `khatabook`
   - Enable automated backups: ✅ (retention: 7 days)
   - Enable deletion protection: ✅

**Run migrations after RDS is ready:**

```bash
# From EC2 — install psql client
sudo apt install -y postgresql-client

# Run migrations
for f in ~/khatabook-pro/database/migrations/*.sql; do
  psql "host=<RDS_ENDPOINT> port=5432 dbname=khatabook user=khata_user password=<PASSWORD> sslmode=require" -f "$f"
done
```

### 4.3 ElastiCache Redis 7

1. ElastiCache Console → Create → **Redis OSS** → **Cluster mode disabled**
2. Settings:
   - Cluster name: `khatabook-redis`
   - Node type: `cache.t3.micro`
   - Number of replicas: 1 (for HA)
3. Security:
   - Subnet group: same private subnets as EC2/RDS
   - Security group: allow port 6379 **from EC2 security group only**
   - In-transit encryption: ✅
   - AUTH token: set a strong password

4. Use the **Primary Endpoint** in your `.env.production`:
   ```
   REDIS_URL=rediss://:AUTH_TOKEN@<ELASTICACHE_ENDPOINT>:6379
   ```
   (Note: `rediss://` for TLS)

---

## 5. Application Deployment

```bash
# On EC2 — clone the repository
cd ~
git clone https://github.com/your-org/khatabook-pro.git
cd khatabook-pro/backend

# Install production dependencies only
npm ci --omit=dev

# Copy and fill in env file
cp .env.example .env.production
nano .env.production   # fill in all values (see Section 6)

# Start with PM2 (see Section 9 for full config)
NODE_ENV=production pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup   # follow the printed command to enable auto-start on reboot
```

**Deploying updates (zero-downtime):**

```bash
cd ~/khatabook-pro
git pull origin main
cd backend
npm ci --omit=dev
pm2 reload all --update-env
```

---

## 6. Environment Variables Guide

Create `backend/.env.production`. **Never commit this file.**

```dotenv
# ── Application ───────────────────────────────────────────────
NODE_ENV=production
PORT=3000

# ── Security ──────────────────────────────────────────────────
# Generate with: openssl rand -hex 64
JWT_SECRET=<64-char-random-hex>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# ── PostgreSQL (RDS) ──────────────────────────────────────────
DB_HOST=<rds-endpoint>.rds.amazonaws.com
DB_PORT=5432
DB_NAME=khatabook
DB_USER=khata_user
DB_PASSWORD=<strong-rds-password>
DB_SSL=true
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECT_TIMEOUT=10000

# ── Redis (ElastiCache) ───────────────────────────────────────
REDIS_URL=rediss://:<auth-token>@<elasticache-endpoint>:6379

# ── Firebase Admin SDK ────────────────────────────────────────
FIREBASE_PROJECT_ID=your-firebase-project-id
# Escape newlines: copy the private key and replace \n with \\n
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# ── Razorpay ──────────────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=<razorpay-live-secret>
RAZORPAY_WEBHOOK_SECRET=<webhook-signing-secret>

# ── Twilio (SMS reminders) ────────────────────────────────────
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=<twilio-auth-token>
TWILIO_PHONE_NUMBER=+1234567890

# ── CORS ──────────────────────────────────────────────────────
ALLOWED_ORIGINS=https://yourdomain.com

# ── Logging ───────────────────────────────────────────────────
LOG_LEVEL=warn
LOG_DIR=/var/log/khatabook
```

### Storing secrets securely with AWS Secrets Manager (recommended)

```bash
# Store the entire .env.production as a single secret
aws secretsmanager create-secret \
  --name "khatabook/prod/env" \
  --secret-string file://backend/.env.production

# Fetch at deploy time
aws secretsmanager get-secret-value \
  --secret-id "khatabook/prod/env" \
  --query SecretString \
  --output text > backend/.env.production
```

---

## 7. Nginx Configuration

Create `/etc/nginx/sites-available/khatabook`:

```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name api.yourdomain.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS — main API
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.yourdomain.com;

    # SSL certificates (managed by Certbot — see Section 8)
    ssl_certificate     /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options    "nosniff"                              always;
    add_header X-Frame-Options           "DENY"                                 always;
    add_header X-XSS-Protection          "1; mode=block"                        always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin"      always;

    # Request limits
    client_max_body_size 10M;

    # Gzip compression
    gzip              on;
    gzip_types        application/json text/plain application/javascript;
    gzip_min_length   1000;
    gzip_proxied      any;

    # Proxy to Node.js
    location /api/ {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        'upgrade';
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }

    # Health check — no auth required
    location /health {
        proxy_pass http://127.0.0.1:3000/health;
        access_log off;
    }

    # Block direct access to any dotfiles
    location ~ /\. {
        deny all;
    }
}
```

**Enable and test:**

```bash
sudo ln -s /etc/nginx/sites-available/khatabook /etc/nginx/sites-enabled/
sudo nginx -t          # test config
sudo systemctl reload nginx
```

---

## 8. SSL / HTTPS Setup

Use **Let's Encrypt** via Certbot (free, auto-renewing):

```bash
# Obtain certificate (Nginx plugin handles validation automatically)
sudo certbot --nginx -d api.yourdomain.com

# Certbot automatically:
#   1. Obtains the certificate
#   2. Writes SSL directives into the Nginx config
#   3. Reloads Nginx

# Verify auto-renewal (runs twice daily via systemd timer)
sudo certbot renew --dry-run
sudo systemctl status snap.certbot.renew.timer
```

**Certificate renewal is fully automatic.** Certbot installs a systemd timer that
attempts renewal twice daily and reloads Nginx after a successful renewal.

---

## 9. PM2 Process Management

Create `backend/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'khatabook-api',
      script: 'server.js',
      instances: 'max',          // one worker per CPU core
      exec_mode: 'cluster',      // Node.js cluster mode (zero-downtime reload)
      env_production: {
        NODE_ENV: 'production',
        // Load remaining vars from .env.production
      },

      // Logging
      out_file: '/var/log/khatabook/pm2-out.log',
      error_file: '/var/log/khatabook/pm2-err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Auto-restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,

      // Memory guard — restart if worker exceeds 512 MB
      max_memory_restart: '512M',

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
      shutdown_with_message: true,
    },
  ],
};
```

**Useful PM2 commands:**

```bash
pm2 start ecosystem.config.js --env production   # start
pm2 reload all --update-env                      # zero-downtime reload
pm2 restart all                                  # hard restart
pm2 stop all                                     # stop
pm2 logs khatabook-api --lines 100               # tail logs
pm2 monit                                        # live dashboard
pm2 status                                       # process list
```

**Create log directory:**

```bash
sudo mkdir -p /var/log/khatabook
sudo chown ubuntu:ubuntu /var/log/khatabook
```

---

## 10. Database Backup Strategy

### Automated RDS backups

RDS automated backups (configured in Section 4.2) create daily snapshots with
point-in-time recovery for the retention window. This is sufficient for most
use cases. To restore:

```
RDS Console → Databases → khatabook-prod → Actions → Restore to point in time
```

### Manual pg_dump snapshots (additional safety)

Create a daily cron job on the EC2 instance to back up to S3:

```bash
# Install aws-cli and pg client
sudo apt install -y awscli postgresql-client

# Create backup script at ~/scripts/backup_db.sh
cat > ~/scripts/backup_db.sh << 'EOF'
#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="khatabook_${TIMESTAMP}.dump"
S3_BUCKET="your-backup-bucket"
S3_PREFIX="database/khatabook"

# Dump in custom format (compressed, supports parallel restore)
PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h "${DB_HOST}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  -F custom \
  -f "/home/ubuntu/backups/${BACKUP_FILE}"

# Upload to S3 (server-side encryption)
aws s3 cp \
  "/home/ubuntu/backups/${BACKUP_FILE}" \
  "s3://${S3_BUCKET}/${S3_PREFIX}/${BACKUP_FILE}" \
  --sse aws:kms

# Remove local copy after successful upload
rm "/home/ubuntu/backups/${BACKUP_FILE}"

echo "Backup complete: ${BACKUP_FILE}"
EOF

chmod +x ~/scripts/backup_db.sh
mkdir -p ~/backups

# Schedule daily at 02:00 UTC
(crontab -l 2>/dev/null; echo "0 2 * * * source ~/.env.production && ~/scripts/backup_db.sh >> /var/log/khatabook/backup.log 2>&1") | crontab -
```

**Restore from a custom-format dump:**

```bash
PGPASSWORD="<PASSWORD>" pg_restore \
  -h <RDS_ENDPOINT> \
  -U khata_user \
  -d khatabook \
  -F custom \
  --no-owner \
  --clean \
  khatabook_20240101_020000.dump
```

### Retention policy

| Backup type | Retention | Storage |
|---|---|---|
| RDS automated snapshots | 7 days | RDS managed |
| Manual pg_dump (S3) | 30 days | S3 Standard |
| Monthly archive | 12 months | S3 Glacier |

Add an **S3 Lifecycle policy** to move dumps to Glacier after 30 days automatically.

---

## 11. Monitoring & Logging

### Application logs (Winston + PM2)

- Winston writes structured JSON logs to `/var/log/khatabook/app-YYYY-MM-DD.log`
  with daily rotation (configured via `winston-daily-rotate-file`).
- PM2 captures stdout/stderr per worker in `/var/log/khatabook/pm2-*.log`.

### System metrics (CloudWatch Agent)

```bash
# Install CloudWatch agent on EC2
sudo apt install -y amazon-cloudwatch-agent

# Minimal config — ship CPU, memory, disk
sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'EOF'
{
  "metrics": {
    "namespace": "KhataBook/EC2",
    "metrics_collected": {
      "cpu":    { "measurement": ["cpu_usage_idle", "cpu_usage_user"], "metrics_collection_interval": 60 },
      "mem":    { "measurement": ["mem_used_percent"], "metrics_collection_interval": 60 },
      "disk":   { "measurement": ["disk_used_percent"], "resources": ["/"], "metrics_collection_interval": 300 }
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          { "file_path": "/var/log/khatabook/*.log", "log_group_name": "/khatabook/app", "log_stream_name": "{instance_id}" }
        ]
      }
    }
  }
}
EOF

sudo systemctl start amazon-cloudwatch-agent
sudo systemctl enable amazon-cloudwatch-agent
```

### Recommended CloudWatch Alarms

| Metric | Threshold | Action |
|---|---|---|
| `CPUUtilization` | > 80% for 5 min | SNS email alert |
| `DatabaseConnections` | > 80% of max | SNS email alert |
| `FreeStorageSpace` (RDS) | < 5 GB | SNS email alert |
| `CacheEngineCPUUtilization` | > 70% | SNS email alert |
| `HTTPCode_ELB_5XX_Count` | > 10 per min | SNS + PagerDuty |

### Health check endpoint

The backend exposes `GET /health` which returns:

```json
{
  "status": "ok",
  "timestamp": "2024-06-15T10:30:00.000Z",
  "uptime": 86400,
  "database": "connected",
  "redis": "connected"
}
```

Configure an **AWS Route 53 health check** or an **ALB target group health check**
to hit `GET /health` every 30 seconds.

---

## 12. Auto-Scaling Considerations

### Vertical scaling (scale up EC2)

The simplest first step. Stop the instance, change the instance type, restart.
PM2 cluster mode automatically uses all new cores.

### Horizontal scaling with an ALB

1. Create an **Application Load Balancer** (HTTPS on 443, HTTP → HTTPS redirect).
2. Create a **Target Group** pointing to EC2 instances on port 3000.
3. Update Route 53 to point `api.yourdomain.com` → ALB DNS name.
4. Move SSL certificate management to **AWS Certificate Manager** (ACM) — the
   ALB terminates TLS so you no longer need Certbot on the instance.

### Auto Scaling Group (ASG)

```
Launch Template:
  - AMI: golden AMI with Node.js + app pre-installed
  - Instance type: t3.small (start)
  - User data: pulls latest code and starts PM2

ASG Settings:
  - Min: 1  Desired: 2  Max: 6
  - Scale-out trigger: CPU > 70% for 3 min
  - Scale-in trigger:  CPU < 30% for 10 min
  - Health check: ELB (uses /health endpoint)
```

### Session stickiness & Redis

The backend is **stateless** — JWTs carry all auth state. Redis is used for
OTP storage and rate-limiting with keys prefixed by user ID, so any EC2 instance
can serve any request. No sticky sessions required.

### Database connection pooling

With multiple EC2 instances, total DB connections multiply.
Deploy **PgBouncer** (transaction pooling mode) on each EC2 instance to avoid
exhausting RDS connection limits:

```bash
sudo apt install -y pgbouncer
# Configure /etc/pgbouncer/pgbouncer.ini
# Point backend DB_HOST to localhost:6432 (PgBouncer)
# PgBouncer connects to RDS
```

---

*For questions or improvements, open an issue or PR at
https://github.com/your-org/khatabook-pro.*
