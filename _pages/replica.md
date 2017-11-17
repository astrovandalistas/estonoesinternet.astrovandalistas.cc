---
layout: post
title: Replica Este Sitio
permalink: /replica-este-sitio/
---
Este sitio está diseñado para existir dentro de Routers hackeados, a los cuales se les sustituye el sistema operativo para alojar este sitio. Se restringe la navegación para únicamente mostrar el usuario este contenido, el cual es diseminado como una publicación inmaterial.

La tecnología utilizada es [OpenWRT]( https://openwrt.org/)

## FUNCIONAMIENTO DEL SITIO
Este sitio web es creada desde una instalación de WordPress, en la que varios usuarios insertan contenido colaborativamente.

Dado que un ruteador no puede correr algo tan pesado como WP (debido a PHP, MYSQL, etc), tenemos que convertir este sitio dinámico en uno estático. Para esto usamos [Really Static]( https://wordpress.org/plugins/really-static/) en conjunción con un script para arreglar algunos problemas de links que tiene ese plugin. Esto nos entrega una serie de archivos HTML que podemos copiar a un USB para correr el sitio desde el ruteador.

[Copia estática del sitio](https://github.com/furenku/estonoesinternet_static)

## CONFIGURACIÓN DE UN RUTEADOR
Se necesita tener un conocimiento básico de Linux (o Unix) y uso de terminal. Es una buena manera de aprender. Degraciadamente, las guías que encontramos están sólo en inglés. (ES UN POCO DIFÍCIL! PUEDES PEDIRNOS AYUDA)

Estamos en el proceso de desarrollar un tutorial detallado, pero a continuación enlistaremos los pasos a razgos generales.

Todos los pasos para lograr este objetivo los copiamos literalmente de varios tutoriales. Es importante no saltarse ningún paso y leer bien las instrucciones de los tutoriales.

[Guía de principiantes](http://wiki.openwrt.org/doc/howto/user.beginner)

### PREPARACION
1. [Instalar openwrt en el router](http://wiki.openwrt.org/doc/howto/generic.flashing)

2. Configurar router para tener soporte USB:  
[USB](http://wiki.openwrt.org/doc/howto/usb.essentials)  
[USB STORAGE](http://wiki.openwrt.org/doc/howto/usb.storage)

3. Instalar nano (editor de texto amigable en terminal)
```
opkg update
opkg install nano
```

### SISTEMA OPERATIVO EN USB
Vamos a configurar el router para correr el sistema operativo desde una llave USB. Para esto, es necesario:

1. Formatear un USB, crear 3 particiones en él. (Para Linux, usar el programa gparted, para Mac, ipartition).

    - formato ext4, 2 GB (aquí se instalará el sistema operativo). Etiqueta: ROOT
    - formato swap, 2 GB (una memoria volátil) Etiqueta: SWAP
    - formato FAT32, espacio restante (aquí se guardarán los archivos del sitio) Etiqueta: CONTENIDOS

2. Crear dos puntos de montaje:
```
mkdir -p /mnt/root
mkdir -p /mnt/contenidos
```

3. Reiniciar y [configurar](http://wiki.openwrt.org/doc/howto/extroot) router para correr sistema operativo en el usb.

    El punto de montaje destino será: ``` /mnt/root ```

4. montar USB
```
mount /dev/sda1 /mnt/root
mount /dev/sda3 /mnt/contenidos
```

5. configurar ruteador para que monte siempre las unidades al arrancar:
```
nano /etc/config/fstab
```
Añadir las siguientes líneas:
```
config 'global'
 option anon_swap '0'
 option anon_mount '0'
 option auto_swap '1'
 option auto_mount '1'
 option delay_root '5'
 option check_fs '0'
config 'mount'
 option target '/mnt/sda1'
 option uuid 'd417e589-e49b-48fa-bb63-a8bb2745d8c5'
 option enabled '0'
config 'swap'
 option uuid '26d262d6-a8e5-48eb-a062-4e4cd83b842d'
 option enabled '0'
config 'mount'
 option target '/mnt/sda3'
 option uuid '3cfd-eaf8'
 option enabled '0'
```

Por problemas de automontaje de la unidad, la montaremos en el cargado inicial editando el archivo rc.local: 
```
nano /etc/rc.local
```

Añadir la siguiente línea:
```
mount /dev/sda3 /mnt/contenidos
```

### INSTALAR SERVIDOR
Vamos a instalar un servidor en nuestro router. Nuestra elección fue lighttpd

1. Reiniciar y instalar lighttpd en el router:
```
opkg install lighttpd
```

2. Configurar lighttpd para iniciarse cada vez que se inicia el router
```
/etc/init.d/lighttpd enable
```

3. Mover LuCi (interfaz grafica de OpenWrt) al puerto 81 (POR DOCUMENTAR)

4. Poner lighttpd en el puerto 80 (POR DOCUMENTAR)

5. Configurar lighttpd para redireccionar la IP del router 192.168.1.1 a /mnt/contenidos (POR DOCUMENTAR)

### COLOCAR CONTENIDOS
Colocar archivos del sitio en la partición CONTENIDOS del USB.

Para mover los archivos, hay opciones:

1. Moverlos manualmente (meter usb a nuestra computadora y de ahí copiar los archivos)
2. Desde nuestra computadora, conectados al routeador y utilizando el comando:
    ```
    scp -r /ruta/a/carpetaDeContenidos/ root@192.168.1.1:~/carpetaDeContenidos
    ssh root@192.168.1.1 (introducir password)
    cp -r ~/carpetaDeContenidos/* /mnt/contenidos
    ```

### REDIRECCIONAR TRÁFICO
Configurar router para redireccionar todo el tráfico a nuestro servidor lighttpd. Para esto, utilizaremos dnsmasq
```
opkg update
opkg install dnsmasq
nano /etc/dnsmasq.conf
```

Añadir las siguientes líneas al final del archivo
```
address=/google.com/192.168.1.1
address=/google.com.mx/192.168.1.1
address=/facebook.com/192.168.1.1
address=/apple.com/192.168.1.1
address=/#/192.168.1.1
# Identify android devices
dhcp-mac=android,AA:24:59:77:42:*
# Disable classless static routes for Android
dhcp-option=android,121,0.0.0.0/0,192.168.1.1
```

Reiniciar routeador: ```reboot```

### CONÉCTATE
Finalmente, conectate con una computadora o teléfono al ruteador y trate de navegar a cualquier sitio.
