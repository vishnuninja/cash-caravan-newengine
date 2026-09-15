FROM php:7.4.3-fpm-alpine3.11

RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli 

COPY ./php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

COPY . /app/src/cyprusSlots/

COPY ./probabilitiy-common/ /app/common/

EXPOSE 9000

VOLUME ["/app"]
#docker build . --progress=plain -t ninjargs/sugarbox5000gold-server:2.0.1 --no-cache