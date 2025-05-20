FROM php:8.3-apache

WORKDIR /var/www/html

# Instalar herramientas base
RUN apt-get update && apt-get install -y apt-utils nano zip unzip git curl openssl

# Instalar extensiones PHP necesarias para Symfony y Doctrine
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Instalar Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php \
    && php -r "unlink('composer-setup.php');" \
    && mv composer.phar /usr/local/bin/composer

# Instalar Symfony CLI
RUN curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.deb.sh' | bash \
    && apt-get update && apt-get install -y symfony-cli

# Copiar el código fuente
COPY . /var/www/html

# Establecer permisos correctos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Crear claves JWT
RUN mkdir -p config/jwt \
    && openssl genrsa -out config/jwt/private.pem -aes256 -passout pass:my_secret_passphrase 4096 \
    && openssl rsa -pubout -in config/jwt/private.pem -passin pass:my_secret_passphrase -out config/jwt/public.pem \
    && echo "JWT_PASSPHRASE=my_secret_passphrase" >> .env.local

# Instalar dependencias de PHP
RUN composer install --no-interaction --optimize-autoloader