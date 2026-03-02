FROM php:8.2-apache

# Installation des extensions PHP nécessaires pour MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Activation du module rewrite d'Apache (souvent nécessaire pour le PHP)
RUN a2enmod rewrite