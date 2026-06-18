FROM php:8.4-fpm-alpine
# Instalar dependencias
RUN apk add --no-cache \
    nginx \
    bash \
    curl \
    libpng-dev \
    libzip-dev \
    postgresql-dev \
    zip \
    unzip

# Instalar extensiones PHP
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    zip \
    gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# composer install --no-dev --optimize-autoloader --ignore-platform-reqs

# Permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
#RUN composer install --no-dev --optimize-autoloader --no-scripts --ignore-platform-reqs
RUN composer install --no-dev --optimize-autoloader --no-scripts
# Configuración nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf


EXPOSE 80
CMD ["sh", "-c", "php artisan config:cache && php artisan migrate --force && php-fpm -D && nginx -g 'daemon off;'"]