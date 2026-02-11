# Baladia Application - cPanel Deployment Guide

## Overview

This guide explains how to deploy the Baladia application to **cPanel** while keeping all services (API, Database, Redis, Queue Worker) running properly.

---

## Prerequisites

### Before Deployment

- ✅ cPanel hosting with SSH access
- ✅ PHP 8.1+ with required extensions:
  - `php-redis` or `php-predis`
  - `php-mysql`
  - `php-gd`
  - `php-curl`
  - `php-mbstring`
  - `php-xml`
- ✅ MySQL/MariaDB database
- ✅ Redis server (or use database driver)
- ✅ Composer installed on server
- ✅ Node.js & npm (for building frontend assets)
- ✅ Domain configured in cPanel

---

## Deployment Architecture for cPanel

```
┌─────────────────────────────────────────────┐
│           cPanel Hosting Server              │
├─────────────────────────────────────────────┤
│  📱 Public Website (my-site)                │
│     └─ Vite build in public_html/           │
│                                              │
│  🔧 Admin Portal (admin-portal)             │
│     └─ React build in subdomain/            │
│                                              │
│  🚀 Laravel Backend API                     │
│     └─ In home directory (outside public)   │
│                                              │
│  📊 MySQL Database                          │
│     └─ Shared server database               │
│                                              │
│  ⚡ Redis (Optional)                        │
│     └─ On localhost:6379                    │
│                                              │
│  🔄 Queue Worker (Supervisor/Cron)         │
│     └─ Background job processor             │
└─────────────────────────────────────────────┘
```

---

## Step 1: Setup Directory Structure

### SSH into your cPanel server:

```bash
ssh username@yourdomain.com
cd ~  # Home directory
```

### Create directory structure:

```bash
# Main backend (outside public_html)
mkdir -p baladia-backend
mkdir -p baladia-admin
mkdir -p baladia-site

# Laravel storage directories
mkdir -p baladia-backend/storage/logs
mkdir -p baladia-backend/storage/framework/cache
mkdir -p baladia-backend/bootstrap/cache

# Set permissions
chmod -R 755 baladia-backend
chmod -R 777 baladia-backend/storage
chmod -R 777 baladia-backend/bootstrap/cache
```

---

## Step 2: Deploy Laravel Backend

### 1. Check Database & Create Backup (if exists):

**IMPORTANT: Always backup before deployment!**

```bash
cd ~/baladia-backend

# Check if database exists
php artisan db:show

# If database exists, backup immediately
if [ $? -eq 0 ]; then
    echo "✅ Database found. Creating backup..."
    BACKUP_FILE=~/backups/backup_before_deploy_$(date +%Y%m%d_%H%M%S).sql.gz
    mkdir -p ~/backups
    mysqldump -u yourusername_db -p'your_password' yourusername_baladia | gzip > $BACKUP_FILE
    echo "✅ Backup saved: $BACKUP_FILE"
else
    echo "ℹ️  Database doesn't exist yet (fresh installation)"
fi
```

### 2. Install dependencies:

```bash
cd ~/baladia-backend

# Install composer dependencies
composer install --no-dev --optimize-autoloader

# Generate APP_KEY
php artisan key:generate

# Clear config cache
php artisan config:clear
php artisan cache:clear
```

### 3. Setup environment file:

```bash
cp .env.example .env
```

**Edit `.env` for cPanel:**

```dotenv
APP_NAME=Baladia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

# Database
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=yourusername_baladia
DB_USERNAME=yourusername_db
DB_PASSWORD=your_secure_password

# Cache & Queue
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=null
REDIS_DB=0

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="Baladia"

# Frontend URLs
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```

### 4. Create Backup Before Migrations:

```bash
# Create backup directory
mkdir -p ~/backups/pre_deploy

# Backup database (if it exists)
DB_NAME=yourusername_baladia
DB_USER=yourusername_db
DB_PASS='your_password'
BACKUP_FILE=~/backups/pre_deploy/backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Only backup if database exists
if mysql -u $DB_USER -p"$DB_PASS" -e "SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME='$DB_NAME'" 2>/dev/null | grep -q 1; then
    echo "✅ Backing up existing database..."
    mysqldump -u $DB_USER -p"$DB_PASS" $DB_NAME | gzip > $BACKUP_FILE
    echo "✅ Backup saved to: $BACKUP_FILE"
else
    echo "ℹ️  Database doesn't exist yet (fresh installation)"
fi
```

### 5. Run migrations (only pending ones):

```bash
cd ~/baladia-backend

# View pending migrations
php artisan migrate:status

# Run only migrations that haven't executed yet
php artisan migrate --step -v
```

### 6. Seed database (only if fresh):

```bash
# Check if database is empty
php artisan tinker
> User::count()  # If 0, proceed to seed
> exit

# Seed if fresh (without --force - safer)
php artisan db:seed --class=DatabaseSeeder
```

### 7. Setup public directory:

```bash
# Option: Use symlink to public directory
ln -s ~/baladia-backend/public ~/public_html/api

# Or configure cPanel addon domain pointing to backend/public
```

### 5. Run migrations and seeders:

```bash
cd ~/baladia-backend

# Step 1: Run all migrations
php artisan migrate --force

# Step 2: Seed the database with initial data
php artisan db:seed --class=DatabaseSeeder --force
```

**Important:** This will seed the following data:
- Events
- Home Images
- Persons
- Papers
- Advertisements
- Potentials
- Important Numbers
- Roles & Permissions
- Modules & Super Admin Modules
- Admin Tools (phpMyAdmin, Redis, etc.)
- Groups
- Structures
- Quick Links
- Users (Admin accounts)

---

## Step 3A: Data Management & Migrations Strategy

### Understanding Your Seeders

Your application has **17 seeders** that create essential data:

| Seeder | Purpose | Data Type | Run Once |
|--------|---------|-----------|----------|
| **RoleSeeder** | User roles (Admin, User, etc.) | System | ✅ Yes |
| **UserSeeder** | Admin/default users | Users | ✅ Yes |
| **ModuleSeeder** | Admin modules & permissions | System | ✅ Yes |
| **SuperAdminModuleSeeder** | Super admin features | System | ✅ Yes |
| **ToolSeeder** | Admin tools (Redis, Grafana, etc.) | System | ✅ Yes |
| **GroupSeeder** | User groups | System | ✅ Yes |
| **StructureSeeder** | Organization structures | System | ✅ Yes |
| **EventSeeder** | Events | Content | ✅ Yes |
| **PersonSeeder** | Important persons | Content | ✅ Yes |
| **PaperSeeder** | Official documents | Content | ✅ Yes |
| **AdSeeder** | Advertisements | Content | ✅ Yes |
| **PotentialSeeder** | Potential services | Content | ✅ Yes |
| **HomeImageSeeder** | Homepage images | Content | ✅ Yes |
| **QuickLinkSeeder** | Quick links | Content | ✅ Yes |
| **ImportantNumberSeeder** | Important contacts | Content | ✅ Yes |
| **NewsSeeder** | News articles | Content | ✅ Yes |

### Migrations vs Seeders

**Migrations (45 total):**
- Create/modify database tables
- Run automatically: `php artisan migrate`
- Should NEVER be deleted
- Track with `migrations` table in database

**Seeders:**
- Populate tables with data
- Run manually: `php artisan db:seed`
- Safe to run multiple times (if coded properly)
- Useful for development, testing, and initial production setup

---

## Step 3B: Initial Production Deployment

### Fresh Installation (First Time):

```bash
cd ~/baladia-backend

# 1. Create database tables
php artisan migrate --force

# 2. Seed all system and initial data
php artisan db:seed --class=DatabaseSeeder --force

# 3. Verify data was seeded
php artisan tinker
> DB::table('roles')->count()        # Should show 5+
> DB::table('users')->count()        # Should show 1+ (admin)
> DB::table('modules')->count()      # Should show 10+
```

### Existing Installation (Updates):

```bash
cd ~/baladia-backend

# 1. Run only new migrations (won't rerun old ones)
php artisan migrate --force

# 2. Optional: Seed new data only
# Only seed if you've added new seeders
php artisan db:seed --class=NewSeeder --force

# 3. DO NOT re-run full DatabaseSeeder if users have added data!
```

---

## Step 3C: Protecting Existing Data

### Safe Deployment Pattern:

```bash
#!/bin/bash

cd ~/baladia-backend

# NEVER seed on existing production without backup!
# Backup database first
mysqldump -u username -p'password' database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# Run ONLY migrations (safe, won't delete data)
php artisan migrate --force

# Verify migrations completed
php artisan migrate:status

# OPTIONAL: Seed only if this is new production environment
# php artisan db:seed --class=DatabaseSeeder --force
```

---

## Step 3D: Backup Before Each Deployment

### Automated Daily Backups:

**File: `~/backup-database.sh`**

```bash
#!/bin/bash

BACKUP_DIR=~/backups
DB_NAME=yourusername_baladia
DB_USER=yourusername_db
DB_PASS='your_password'
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u $DB_USER -p"$DB_PASS" $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/db_$DATE.sql.gz"
```

**Add to crontab (runs daily at 2 AM):**

```bash
crontab -e
# Add this line:
0 2 * * * ~/backup-database.sh >> ~/backup.log 2>&1
```

---

## Step 3E: Data Synchronization Between Environments

### Development → Production Data Flow:

```
DEV Environment
    ├─ Create new migrations
    ├─ Create new seeders
    └─ Test data thoroughly

↓ Commit to Git ↓

Git Repository
    ├─ All migrations preserved
    ├─ All seeders included
    └─ Version controlled

↓ Deploy to Production ↓

Production Server
    ├─ Pull latest code
    ├─ Run migrations only
    └─ Keep existing user data
```

### Preventing Data Loss:

```bash
# ✅ SAFE - Only runs new migrations
php artisan migrate --force

# ✅ SAFE - Seed new data on fresh install
php artisan db:seed --class=SingleSeeder --force

# ❌ DANGEROUS - Re-seeds everything (might duplicate data)
php artisan migrate:refresh --force

# ❌ DANGEROUS - Drops database!
php artisan migrate:reset --force
```

---

## Step 3F: Seeding Strategies

### Strategy 1: Seed Only Once (Recommended)

```php
// In your seeder, check if data exists first
public function run(): void
{
    if (Role::where('name', 'admin')->exists()) {
        echo 'Roles already exist, skipping...';
        return;
    }

    Role::create(['name' => 'admin']);
    Role::create(['name' => 'user']);
    // ... more seeders
}
```

### Strategy 2: Fresh Content Each Deployment

```bash
# Only use this for content that changes
php artisan db:seed --class=NewsSeeder --force
php artisan db:seed --class=EventSeeder --force

# NOT for system data
# Never: php artisan db:seed --class=RoleSeeder --force
```

### Strategy 3: Conditional Seeding

```php
// Only seed if environment is production and fresh
if (env('APP_ENV') === 'production' && User::count() === 0) {
    $this->call(DatabaseSeeder::class);
}
```

---

## Step 3G: Viewing Seeded Data

### Check what was seeded:

```bash
cd ~/baladia-backend
php artisan tinker

# View roles
> Role::all();

# View users
> User::all();

# View modules
> Module::all();

# View specific seeded data
> Event::count()         # How many events?
> Person::count()        # How many persons?
> Structure::count()     # How many structures?

# Check migration status
> exit
php artisan migrate:status
```

---

## Step 3H: Handling Failed Migrations

### If a migration fails:

```bash
# View error
php artisan migrate --force -vvv

# Rollback last migration
php artisan migrate:rollback --force

# Fix the migration file
# Then re-run
php artisan migrate --force
```

### Restore from backup if needed:

```bash
# List available backups
ls -la ~/backups/

# Restore specific backup
gunzip < ~/backups/db_20260209_120000.sql.gz | mysql -u username -p database_name
```

---

## Step 3I: Your Specific Seeders Checklist

Before deploying, verify all these seeders:

- [ ] **RoleSeeder** - Creates admin/user/viewer roles
- [ ] **UserSeeder** - Creates default admin user(s)
- [ ] **ModuleSeeder** - Sets up admin modules
- [ ] **SuperAdminModuleSeeder** - Super admin features
- [ ] **ToolSeeder** - Admin tools (Redis, Grafana, PhpMyAdmin)
- [ ] **GroupSeeder** - Organization groups
- [ ] **StructureSeeder** - Administrative structures
- [ ] **EventSeeder** - Important events data
- [ ] **PersonSeeder** - Key persons/officials
- [ ] **PaperSeeder** - Official documents
- [ ] **AdSeeder** - Advertisements
- [ ] **PotentialSeeder** - Service potentials
- [ ] **HomeImageSeeder** - Homepage images
- [ ] **QuickLinkSeeder** - Quick navigation links
- [ ] **ImportantNumberSeeder** - Contact numbers

**Run once on fresh production:**

```bash
php artisan db:seed --class=DatabaseSeeder --force
```

---

## Step 3J: Monitoring Seeder Execution

### Create a seeding log:

```bash
php artisan db:seed --class=DatabaseSeeder --force 2>&1 | tee ~/seeding.log
```

### Check what was created:

```bash
# Count records in each table
php artisan tinker << 'EOF'
$tables = ['roles', 'users', 'modules', 'events', 'persons', 'papers', 'ads', 'potentials', 'groups', 'structures', 'quick_links', 'important_numbers'];
foreach ($tables as $table) {
    echo "$table: " . DB::table($table)->count() . "\n";
}
EOF
```

---

## Step 3K: Deployment Checklist for Data

Before going live:

```bash
# ✅ Backup existing database
mysqldump -u user -p'pass' db > backup.sql

# ✅ Run migrations
php artisan migrate --force --step

# ✅ Verify migrations status
php artisan migrate:status

# ✅ Check if seeds needed
php artisan tinker
> User::count()  # If 0, need to seed

# ✅ Seed if fresh install
php artisan db:seed --class=DatabaseSeeder --force

# ✅ Verify seeding worked
php artisan tinker
> User::count()  # Should be > 0
> Role::count()  # Should be > 0

# ✅ Clear caches
php artisan cache:clear
php artisan config:cache

# ✅ Restart queue worker
sudo supervisorctl restart baladia-queue-worker:*
```

---

## Step 3-Deploy

### 1. Build Admin Portal:

```bash
cd ~/baladia-admin

# Install dependencies
npm install

# Build for production
npm run build

# Copy built files to cPanel addon domain
# Create addon domain in cPanel: admin.yourdomain.com
# Then copy dist/* to its public_html
cp -r dist/* ~/public_html/admin/
```

### 2. Build Public Website:

```bash
cd ~/baladia-site

# Install dependencies
npm install

# Build for production
npm run build

# Copy to main public_html
cp -r dist/* ~/public_html/
```

---

## Step 4: Setup Queue Worker

### Option A: Using Supervisor (Recommended)

Supervisor is a process manager that keeps your queue worker running.

#### Install Supervisor:

```bash
# Contact your hosting provider to install supervisor
# Or request SSH access to install:
sudo apt-get install supervisor  # Linux
brew install supervisor          # macOS
```

#### Create Supervisor configuration:

```bash
sudo nano /etc/supervisor/conf.d/baladia-queue.conf
```

**Add this configuration:**

```ini
[program:baladia-queue-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /home/username/baladia-backend/artisan queue:work redis --queue=reset_password_mails,registered_users_mails,mail_queue --tries=3 --timeout=120
autostart=true
autorestart=true
numprocs=1
redirect_stderr=true
stdout_logfile=/home/username/baladia-backend/storage/logs/queue-worker.log
stopwait=3600
```

#### Start Supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start baladia-queue-worker:*

# Check status
sudo supervisorctl status baladia-queue-worker:*
```

### Option B: Using Cron (Alternative)

If Supervisor isn't available, use cron to keep queue running:

```bash
# Add to crontab
crontab -e
```

**Add this line:**

```bash
* * * * * cd /home/username/baladia-backend && php artisan queue:work redis --max-jobs=1000 --max-time=3600 >> /dev/null 2>&1
```

---

## Step 5: Configure Web Server

### Setup .htaccess for Laravel API:

**File: `~/baladia-backend/public/.htaccess`**

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_PATH} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Handle Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### Configure addon domains in cPanel:

1. **Main Domain**: `yourdomain.com` → points to `~/public_html`
2. **Admin Subdomain**: `admin.yourdomain.com` → points to `~/public_html/admin`
3. **API Subdomain** (Optional): `api.yourdomain.com` → points to `~/baladia-backend/public`

---

## Step 6: Setup SSL Certificates

### Using AutoSSL (Included with cPanel):

```bash
# cPanel automatically renews AutoSSL certificates
# For manual renewal:
/usr/local/cpanel/bin/checkallsslcerts
```

### Or using Let's Encrypt (Free):

```bash
# Via cPanel > SSL/TLS Status
# Or via command line:
cd ~/baladia-backend/public
certbot certonly --webroot -w . -d yourdomain.com
```

---

## Step 7: Configure Queue Worker to Process Jobs

### Test queue manually:

```bash
cd ~/baladia-backend

# Run queue worker in foreground
php artisan queue:work redis --queue=reset_password_mails,registered_users_mails,mail_queue -v

# Test dispatching a job
php artisan tinker
> \App\Jobs\SendWelcomeEmail::dispatch('test@example.com', 'John', 'en')->onQueue('mail_queue');
```

### Verify supervisor is running queue:

```bash
sudo supervisorctl status
# Should show: baladia-queue-worker:baladia-queue-worker-00  RUNNING

# View logs
tail -f ~/baladia-backend/storage/logs/queue-worker.log
```

---

## Step 8: Setup Database Backups

### Create automated MySQL backups:

```bash
# cPanel > Backup > Configure Backup

# Or via command line:
crontab -e
```

**Add weekly backup:**

```bash
0 2 * * 0 mysqldump -u yourusername_db -p'password' yourusername_baladia | gzip > ~/backups/baladia_$(date +\%Y\%m\%d).sql.gz
```

---

## Step 9: Monitor & Maintain

### Check services status:

```bash
# Queue worker
sudo supervisorctl status

# Redis (if available)
redis-cli ping
# Should return: PONG

# Laravel logs
tail -f ~/baladia-backend/storage/logs/laravel.log

# Queue jobs
cd ~/baladia-backend
php artisan queue:work redis --queue=... -vvv
```

### Clear caches:

```bash
cd ~/baladia-backend

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
```

---

## Step 10: Deployment Script (Automation)

**Create `~/deploy.sh`:**

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Baladia Deployment...${NC}"

# Navigate to backend
cd ~/baladia-backend

echo "1. Pulling latest code..."
git pull origin main

echo "2. Installing dependencies..."
composer install --no-dev --optimize-autoloader

echo "3. Running migrations..."
php artisan migrate --force

echo "4. Clearing caches..."
php artisan cache:clear
php artisan config:clear

echo "5. Caching for production..."
php artisan config:cache
php artisan route:cache

echo "6. Restarting queue worker..."
sudo supervisorctl restart baladia-queue-worker:*

echo -e "${GREEN}Deployment completed!${NC}"

# Optional: Rebuild frontend
echo "Building frontend assets..."
cd ~/baladia-admin && npm run build && cp -r dist/* ~/public_html/admin/
cd ~/baladia-site && npm run build && cp -r dist/* ~/public_html/

echo -e "${GREEN}All done!${NC}"
```

**Make executable and run:**

```bash
chmod +x ~/deploy.sh
./deploy.sh
```

---

## Troubleshooting

### Queue Worker Not Processing Jobs

```bash
# Check supervisor status
sudo supervisorctl status

# Restart queue worker
sudo supervisorctl restart baladia-queue-worker:*

# Check logs
tail -f ~/baladia-backend/storage/logs/queue-worker.log
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping

# Check Redis service
ps aux | grep redis

# If not running, ask hosting provider to enable Redis
```

### Database Connection Issues

```bash
# Test database connection
cd ~/baladia-backend
php artisan db:show

# Or via tinker
php artisan tinker
> DB::connection()->getPdo();
```

### Email Not Sending

```bash
# Check mail logs
cd ~/baladia-backend
php artisan queue:failed

# View specific failed job
php artisan queue:show

# Retry failed jobs
php artisan queue:retry --all
```

### High CPU Usage

```bash
# Check what's consuming CPU
top

# Limit queue worker processes
# Edit supervisor config: numprocs=1
# Increase timeout and decrease frequency
```

---

## Security Checklist

- ✅ Set `APP_DEBUG=false` in production
- ✅ Use strong database passwords
- ✅ Enable SSL/HTTPS for all domains
- ✅ Set proper file permissions (755 for dirs, 644 for files)
- ✅ Hide `.env` file from public access
- ✅ Setup firewall rules
- ✅ Enable automatic backups
- ✅ Monitor error logs regularly
- ✅ Keep dependencies updated: `composer update`
- ✅ Use environment variables for sensitive data

---

## Performance Optimization

### Caching:

```bash
cd ~/baladia-backend

# Cache config for faster startup
php artisan config:cache

# Cache routes for better performance
php artisan route:cache

# Cache views
php artisan view:cache
```

### Database Optimization:

```bash
# Add indexes to frequently queried columns
php artisan tinker
> DB::statement('ALTER TABLE users ADD INDEX email_idx (email)');
```

### Queue Performance:

```bash
# Increase processes in supervisor
# numprocs=3  # Run 3 queue workers

# Adjust timeout based on job complexity
--timeout=300  # 5 minutes for heavy jobs
```

---

## Monitoring & Alerts

### Setup uptime monitoring:

```bash
# Use services like:
# - UptimeRobot (https://uptimerobot.com)
# - Pingdom
# - StatusCake
```

### Log aggregation:

```bash
# Monitor queue worker logs
tail -f ~/baladia-backend/storage/logs/queue-worker.log

# Monitor Laravel errors
tail -f ~/baladia-backend/storage/logs/laravel.log

# Monitor cron jobs
# Check cPanel > Cron Jobs > View Error Logs
```

---

## Rollback Plan

If deployment fails:

```bash
# Rollback to previous version
cd ~/baladia-backend
git revert HEAD
composer install --no-dev --optimize-autoloader
php artisan migrate:rollback

# Restart services
sudo supervisorctl restart baladia-queue-worker:*
```

---

## Support & Resources

- **Laravel Documentation**: https://laravel.com/docs
- **cPanel Support**: https://cpanel.net/
- **Redis Documentation**: https://redis.io/documentation
- **Supervisor Documentation**: http://supervisord.org/

---

## Summary

| Component | Dev | Production |
|-----------|-----|------------|
| **Queue Driver** | redis/database | redis |
| **Queue Worker** | php artisan | Supervisor |
| **Cache Driver** | redis | redis |
| **Log Level** | debug | error |
| **Debug Mode** | true | false |
| **SSL** | Optional | Required |
| **Backups** | Manual | Automated |
| **Monitoring** | Manual | Automated |

