-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('CLIENTE', 'OPERADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "OrdenEstado" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'FINALIZADO', 'PAGADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('TARJETA', 'TRANSFERENCIA', 'EFECTIVO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'COMPLETADO', 'FALLIDO');

-- CreateEnum
CREATE TYPE "CondolenciaEstado" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "Operacion" AS ENUM ('INSERT', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "RecursoTipo" AS ENUM ('ARTICULO', 'VIDEO', 'AUDIO');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfil_cliente" (
    "usuario_id" INTEGER NOT NULL,
    "nombres" TEXT,
    "apellidos" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,

    CONSTRAINT "perfil_cliente_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "perfil_operador" (
    "usuario_id" INTEGER NOT NULL,
    "ci" TEXT,
    "cargo" TEXT,
    "telefono" TEXT,

    CONSTRAINT "perfil_operador_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "perfil_admin" (
    "usuario_id" INTEGER NOT NULL,
    "nombre_completo" TEXT,

    CONSTRAINT "perfil_admin_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "servicio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio_base" DECIMAL(65,30) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "operador_id" INTEGER,
    "estado" "OrdenEstado" NOT NULL DEFAULT 'PENDIENTE',
    "total" DECIMAL(65,30) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden_detalle" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "servicio_id" INTEGER NOT NULL,
    "descripcion_srv" TEXT,
    "precio_unitario" DECIMAL(65,30) NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "subtotal" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "orden_detalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "difunto" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "nombres" TEXT NOT NULL,
    "fecha_fallecido" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "difunto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pago" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "estado" "EstadoPago" NOT NULL,
    "referencia" TEXT,
    "pagado_en" TIMESTAMP(3),

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obituario" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "titulo" TEXT,
    "mensaje" TEXT NOT NULL,
    "url_slug" TEXT NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "obituario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condolencia" (
    "id" SERIAL NOT NULL,
    "obituario_id" INTEGER NOT NULL,
    "autor_id" INTEGER NOT NULL,
    "mensaje" TEXT,
    "imagen_url" TEXT,
    "estado" "CondolenciaEstado" NOT NULL DEFAULT 'PENDIENTE',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "condolencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacion" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "asunto" TEXT,
    "cuerpo" TEXT,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fecha_envio" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "importacion_csv" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "archivo_nombre" TEXT,
    "total_registros" INTEGER NOT NULL,
    "exitosos" INTEGER NOT NULL,
    "con_errores" INTEGER NOT NULL,
    "ejecutado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "importacion_csv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tabla" TEXT NOT NULL,
    "operacion" "Operacion" NOT NULL,
    "registro_id" INTEGER NOT NULL,
    "antes" JSONB,
    "despues" JSONB,
    "realizado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,

    CONSTRAINT "faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurso_ayuda" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "tipo" "RecursoTipo" NOT NULL,

    CONSTRAINT "recurso_ayuda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluacion" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "puntuacion" INTEGER NOT NULL DEFAULT 0,
    "comentario" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personalizacion" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "detalles" TEXT NOT NULL,
    "fecha_solicitud" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personalizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "obituario_url_slug_key" ON "obituario"("url_slug");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- AddForeignKey
ALTER TABLE "perfil_cliente" ADD CONSTRAINT "perfil_cliente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_operador" ADD CONSTRAINT "perfil_operador_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_admin" ADD CONSTRAINT "perfil_admin_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden" ADD CONSTRAINT "orden_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden" ADD CONSTRAINT "orden_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_detalle" ADD CONSTRAINT "orden_detalle_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "orden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_detalle" ADD CONSTRAINT "orden_detalle_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "difunto" ADD CONSTRAINT "difunto_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "orden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obituario" ADD CONSTRAINT "obituario_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condolencia" ADD CONSTRAINT "condolencia_obituario_id_fkey" FOREIGN KEY ("obituario_id") REFERENCES "obituario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condolencia" ADD CONSTRAINT "condolencia_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacion" ADD CONSTRAINT "notificacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "importacion_csv" ADD CONSTRAINT "importacion_csv_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluacion" ADD CONSTRAINT "evaluacion_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalizacion" ADD CONSTRAINT "personalizacion_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
