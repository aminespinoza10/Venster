# 🚀 Guía de Despliegue de Venster (Docker)

## 📋 Resumen de la Implementación

Se han creado todos los archivos necesarios para desplegar ambos componentes de Venster (API + Web) de forma sencilla mediante Docker o un script de bash.

## 📁 Archivos Creados

### Dockerfiles y Configuración

1. **`api/Dockerfile`** - Dockerfile multi-etapa para la API en Go
   - Construye la aplicación Go de forma optimizada
   - Imagen final ligera basada en Alpine Linux
   - Puerto expuesto: 8080

2. **`web/Dockerfile`** - Dockerfile multi-etapa para la aplicación React
   - Construye la aplicación con Vite
   - Sirve los archivos estáticos con Nginx
   - Puerto expuesto: 80

3. **`web/nginx.conf`** - Configuración de Nginx
   - Soporte para Single Page Application (SPA)
   - Proxy configurado para la API
   - Compresión Gzip activada
   - Cache para assets estáticos

4. **`docker-compose.yml`** - Orquestación de servicios
   - Define ambos servicios (api + web)
   - Configuración de red interna
   - Health checks automáticos
   - Variables de entorno

5. **`.env.docker`** - Template de variables de entorno
   - URL de Ollama configurable
   - Cópialo a `.env` y ajusta según tu configuración

### Scripts de Despliegue

6. **`deploy.sh`** - Script interactivo de despliegue
   - Menú con 8 opciones diferentes
   - Construcción y arranque de servicios
   - Gestión de logs y estado
   - Limpieza completa de recursos

### Documentación

7. **`DEPLOYMENT.md`** - Guía completa de despliegue (en inglés)
   - Instrucciones detalladas
   - Troubleshooting
   - Configuración avanzada
   - Consejos para producción

8. **Actualizado `README.md`** - Instrucciones de uso en el readme principal

9. **Actualizado `.gitignore`** - Para no subir archivos sensibles

## 🎯 Criterio de Aceptación: ✅ CUMPLIDO

> **"El proyecto debe ser ejecutado en sus dos partes por medio de un solo comando"**

### Opción 1: Docker (Recomendado)

```bash
# Un solo comando para arrancar todo
./deploy.sh
```

Luego selecciona la opción 1 del menú interactivo.

### Opción 2: Docker Compose Directo

```bash
# Un solo comando para arrancar todo
docker compose up -d --build
```

## 🔧 Cómo Usar el Despliegue

### Paso 1: Configuración Inicial

```bash
# Asegúrate de estar en la raíz del proyecto
cd /Users/aminespinoza/Documents/Github/Venster

# Copia el archivo de variables de entorno
cp .env.docker .env

# Edita el archivo .env si es necesario (opcional)
# Por defecto usa: OLLAMA_URL=http://host.docker.internal:11434
```

### Paso 2: Desplegar con el Script Interactivo

```bash
# Ejecuta el script (ya tiene permisos de ejecución)
./deploy.sh
```

Verás un menú como este:

```
╔═══════════════════════════════════════╗
║     VENSTER - Script de Despliegue    ║
╔═══════════════════════════════════════╗

Selecciona una opción:
1) Construir y arrancar ambos servicios (API + Web)
2) Construir y arrancar solo la API
3) Construir y arrancar solo la Web
4) Detener todos los servicios
5) Ver logs de los servicios
6) Reiniciar servicios
7) Limpiar todo (contenedores, imágenes y volúmenes)
8) Ver estado de los servicios
0) Salir

Opción: 
```

**Selecciona la opción 1** para arrancar ambos servicios.

### Paso 3: Acceder a la Aplicación

Una vez que los servicios estén corriendo:

- **Aplicación Web**: http://localhost
- **API**: http://localhost:8080
- **Documentación API (Swagger)**: http://localhost:8080/swagger/

## 📊 Comandos Útiles

### Ver Estado de los Servicios

```bash
docker compose ps
```

### Ver Logs en Tiempo Real

```bash
# Todos los servicios
docker compose logs -f

# Solo la API
docker compose logs -f api

# Solo la Web
docker compose logs -f web
```

### Detener Servicios

```bash
docker compose down
```

### Reiniciar Servicios

```bash
docker compose restart
```

### Limpiar Todo (Reset Completo)

```bash
docker compose down -v --rmi all
```

## 🛠️ Alternativas Incluidas

Tal como solicitaste, se incluyen **dos opciones de despliegue**:

### 1️⃣ Docker (Principal)
- ✅ Despliegue con Docker Compose
- ✅ Script interactivo para gestión
- ✅ Aislamiento completo
- ✅ Fácil de replicar en otros entornos

### 2️⃣ Nginx Manual (Alternativa)
El archivo `web/nginx.conf` está listo para usarse en un servidor Nginx tradicional:

```bash
# Construir la aplicación web
cd web
npm run build

# Copiar archivos al servidor web
cp -r dist/* /var/www/html/

# Usar la configuración de Nginx
cp nginx.conf /etc/nginx/sites-available/venster
```

## ✨ Beneficios de Esta Implementación

1. **Despliegue rápido**: Un solo comando para arrancar todo
2. **Portabilidad**: Funciona en cualquier máquina con Docker
3. **Aislamiento**: Cada componente en su propio contenedor
4. **Producción-ready**: Configuración optimizada con multi-stage builds
5. **Fácil debugging**: Script interactivo con logs y estado
6. **Flexible**: Puedes arrancar servicios independientemente

## 🔍 Verificación del Despliegue

Después de ejecutar el despliegue, verifica que todo funciona:

```bash
# 1. Verificar estado
docker compose ps

# Deberías ver:
# venster-api     Up 1 minute (healthy)
# venster-web     Up 1 minute (healthy)

# 2. Probar la API
curl http://localhost:8080/health

# Deberías ver: {"status":"healthy"}

# 3. Probar la Web
open http://localhost
# O en Linux: xdg-open http://localhost
```

## ⚠️ Notas Importantes

### Conectividad con Ollama

El archivo `.env.docker` usa `host.docker.internal:11434` por defecto, que funciona en:
- ✅ macOS
- ✅ Windows
- ⚠️ Linux (requiere configuración adicional)

**Para Linux**, cambia la URL en el archivo `.env`:
```env
OLLAMA_URL=http://172.17.0.1:11434
```

O ejecuta Ollama en un contenedor Docker.

### Puertos en Uso

Si los puertos 80 u 8080 están ocupados, puedes cambiarlos editando `docker-compose.yml`:

```yaml
services:
  api:
    ports:
      - "8081:8080"  # Cambiar 8080 a 8081 en el host
  web:
    ports:
      - "3000:80"    # Cambiar 80 a 3000 en el host
```

## 🎉 ¡Listo para Usar!

Tu aplicación Venster ahora está completamente dockerizada y lista para desplegarse con un solo comando. El criterio de aceptación se ha cumplido exitosamente:

✅ **Ambos componentes se ejecutan con un solo comando**  
✅ **Dockerfiles para API y Web creados**  
✅ **Docker Compose configurado**  
✅ **Script de bash alternativo incluido**  
✅ **Configuración de Nginx incluida**  

## 📚 Documentación Adicional

Para información más detallada sobre troubleshooting y configuraciones avanzadas, consulta:
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Guía completa en inglés
- [README.md](../README.md) - Documentación principal del proyecto

## 💬 ¿Necesitas Ayuda?

Si encuentras algún problema, crea un [Issue en GitHub](https://github.com/aminespinoza10/Venster/issues) usando las plantillas en español que ya están configuradas.

---

**¡Disfruta de tu despliegue simplificado de Venster! 🚀**
