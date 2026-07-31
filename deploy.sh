#!/bin/bash

##############################################
# Script de Despliegue para Venster
# Autor: Venster Team
# Descripción: Script para desplegar la API y Web de Venster
##############################################

set -e  # Salir si algún comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[Venster]${NC} $1"
}

print_error() {
    echo -e "${RED}[Error]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[Advertencia]${NC} $1"
}

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║     VENSTER - Script de Despliegue    ║"
echo "╔═══════════════════════════════════════╗"
echo -e "${NC}"

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Determinar comando de Docker Compose
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Menú de opciones
echo ""
echo "Selecciona una opción:"
echo "1) Construir y arrancar ambos servicios (API + Web)"
echo "2) Construir y arrancar solo la API"
echo "3) Construir y arrancar solo la Web"
echo "4) Detener todos los servicios"
echo "5) Ver logs de los servicios"
echo "6) Reiniciar servicios"
echo "7) Limpiar todo (contenedores, imágenes y volúmenes)"
echo "8) Ver estado de los servicios"
echo "0) Salir"
echo ""

read -p "Opción: " option

case $option in
    1)
        print_message "Construyendo y arrancando todos los servicios..."
        $DOCKER_COMPOSE up -d --build
        print_message "✓ Servicios iniciados correctamente"
        echo ""
        print_message "Accede a los servicios en:"
        echo "  - Web:     ${GREEN}http://localhost${NC}"
        echo "  - API:     ${GREEN}http://localhost:8080${NC}"
        echo "  - Swagger: ${GREEN}http://localhost:8080/swagger/${NC}"
        ;;
    2)
        print_message "Construyendo y arrancando la API..."
        $DOCKER_COMPOSE up -d --build api
        print_message "✓ API iniciada correctamente"
        echo ""
        print_message "Accede a la API en:"
        echo "  - API:     ${GREEN}http://localhost:8080${NC}"
        echo "  - Swagger: ${GREEN}http://localhost:8080/swagger/${NC}"
        ;;
    3)
        print_message "Construyendo y arrancando la Web..."
        $DOCKER_COMPOSE up -d --build web
        print_message "✓ Web iniciada correctamente"
        echo ""
        print_message "Accede a la Web en: ${GREEN}http://localhost${NC}"
        ;;
    4)
        print_message "Deteniendo todos los servicios..."
        $DOCKER_COMPOSE down
        print_message "✓ Servicios detenidos"
        ;;
    5)
        print_message "Mostrando logs de los servicios (Ctrl+C para salir)..."
        $DOCKER_COMPOSE logs -f
        ;;
    6)
        print_message "Reiniciando servicios..."
        $DOCKER_COMPOSE restart
        print_message "✓ Servicios reiniciados"
        ;;
    7)
        print_warning "Esto eliminará todos los contenedores, imágenes y volúmenes de Venster"
        read -p "¿Estás seguro? (s/N): " confirm
        if [[ $confirm == [sS] ]]; then
            print_message "Limpiando todo..."
            $DOCKER_COMPOSE down -v --rmi all
            print_message "✓ Limpieza completada"
        else
            print_message "Operación cancelada"
        fi
        ;;
    8)
        print_message "Estado de los servicios:"
        $DOCKER_COMPOSE ps
        ;;
    0)
        print_message "¡Hasta luego!"
        exit 0
        ;;
    *)
        print_error "Opción inválida"
        exit 1
        ;;
esac

echo ""
print_message "Operación completada. Ejecuta './deploy.sh' nuevamente para más opciones."
