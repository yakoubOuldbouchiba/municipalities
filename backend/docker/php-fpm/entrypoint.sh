#!/bin/bash

# Laravel environment setup for PHP-FPM

# Wait for database connection before starting
echo "Waiting for MySQL to be ready..."
while ! nc -z $DB_HOST $DB_PORT 2>/dev/null; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - continuing..."

# Run migrations if needed (optional)
# php artisan migrate --force

# Start PHP-FPM
php-fpm
