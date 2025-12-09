# Use official PHP FPM image
FROM php:8.1-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd zip pdo pdo_mysql bcmath \
    && docker-php-ext-enable pdo_mysql bcmath \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files
COPY composer.json ./

# Install dependencies
RUN composer install --no-interaction --no-scripts

# Copy application files
COPY . .

# Create storage directories with correct permissions
RUN mkdir -p storage/logs storage/framework/{sessions,views,cache} bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Set environment variables
ENV APP_ENV=production \
    APP_DEBUG=false

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:9000/ping || exit 1

# Expose port
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
