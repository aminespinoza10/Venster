# Etapa de construcción
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Etapa de producción
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copiar el binario desde la etapa de construcción
COPY --from=builder /app/main .

# Exponer el puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV PORT=8080
ENV OLLAMA_URL=http://host.docker.internal:11434

# Comando para ejecutar
CMD ["./main"]
