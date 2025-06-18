-- CreateTable
CREATE TABLE "auditoria" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT,
    "tabla" VARCHAR(60) NOT NULL,
    "operacion" VARCHAR(10) NOT NULL,
    "registro_id" BIGINT NOT NULL,
    "antes" JSONB,
    "despues" JSONB,
    "realizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condolencia" (
    "id" BIGSERIAL NOT NULL,
    "obituario_id" BIGINT NOT NULL,
    "autor_id" BIGINT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "imagen_url" TEXT,
    "estado" VARCHAR(10) NOT NULL DEFAULT 'PENDIENTE',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "condolencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "difunto" (
    "id" BIGSERIAL NOT NULL,
    "orden_id" BIGINT NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "fecha_fallecido" DATE NOT NULL,

    CONSTRAINT "difunto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verificacion" (
    "usuario_id" BIGINT NOT NULL,
    "token" UUID NOT NULL,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiracion" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() + '1 day'::interval),

    CONSTRAINT "email_verificacion_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "evaluacion" (
    "id" BIGSERIAL NOT NULL,
    "cliente_id" BIGINT,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq" (
    "id" BIGSERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,

    CONSTRAINT "faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "importacion_csv" (
    "id" BIGSERIAL NOT NULL,
    "admin_id" BIGINT NOT NULL,
    "archivo_nombre" VARCHAR(180) NOT NULL,
    "total_registros" INTEGER NOT NULL DEFAULT 0,
    "exitosos" INTEGER NOT NULL DEFAULT 0,
    "con_errores" INTEGER NOT NULL DEFAULT 0,
    "ejecutado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "importacion_csv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacion" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "asunto" VARCHAR(120) NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "enviado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obituario" (
    "id" BIGSERIAL NOT NULL,
    "orden_id" BIGINT NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "mensaje" TEXT,
    "url_slug" VARCHAR(160) NOT NULL,
    "imagen_url" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "obituario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden" (
    "id" BIGSERIAL NOT NULL,
    "cliente_id" BIGINT NOT NULL,
    "operador_id" BIGINT,
    "estado" VARCHAR(15) NOT NULL DEFAULT 'PENDIENTE',
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden_detalle" (
    "id" BIGSERIAL NOT NULL,
    "orden_id" BIGINT NOT NULL,
    "servicio_id" BIGINT NOT NULL,
    "descripcion_srv" TEXT,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "orden_detalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pago" (
    "id" BIGSERIAL NOT NULL,
    "orden_id" BIGINT NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "metodo" VARCHAR(15) NOT NULL,
    "estado" VARCHAR(12) NOT NULL,
    "referencia" VARCHAR(120),
    "pagado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "token" UUID NOT NULL,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiracion" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() + '01:00:00'::interval),

    CONSTRAINT "password_reset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfil_admin" (
    "usuario_id" BIGINT NOT NULL,
    "nombre_completo" VARCHAR(160) NOT NULL,

    CONSTRAINT "perfil_admin_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "perfil_cliente" (
    "usuario_id" BIGINT NOT NULL,
    "nombres" VARCHAR(80) NOT NULL,
    "apellidos" VARCHAR(80) NOT NULL,
    "telefono" VARCHAR(20),
    "direccion" TEXT,

    CONSTRAINT "perfil_cliente_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "perfil_operador" (
    "usuario_id" BIGINT NOT NULL,
    "nombres" VARCHAR(80) NOT NULL,
    "ci" VARCHAR(20) NOT NULL,
    "cargo" VARCHAR(60) NOT NULL,
    "telefono" VARCHAR(20),

    CONSTRAINT "perfil_operador_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "recurso_ayuda" (
    "id" BIGSERIAL NOT NULL,
    "titulo" VARCHAR(120) NOT NULL,
    "contenido" TEXT NOT NULL,
    "tipo" VARCHAR(10) NOT NULL,

    CONSTRAINT "recurso_ayuda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicio" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "precio_base" DECIMAL(12,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" BIGSERIAL NOT NULL,
    "nombre_usuario" VARCHAR(32) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" VARCHAR(15) NOT NULL,
    "estado" VARCHAR(10) NOT NULL DEFAULT 'ACTIVO',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_auditoria_tabla" ON "auditoria"("tabla");

-- CreateIndex
CREATE INDEX "idx_auditoria_usuario" ON "auditoria"("usuario_id");

-- CreateIndex
CREATE INDEX "idx_condolencia_estado" ON "condolencia"("estado");

-- CreateIndex
CREATE INDEX "idx_condolencia_obituario" ON "condolencia"("obituario_id");

-- CreateIndex
CREATE INDEX "idx_difunto_orden" ON "difunto"("orden_id");

-- CreateIndex
CREATE INDEX "idx_email_verificacion_token" ON "email_verificacion"("token");

-- CreateIndex
CREATE INDEX "idx_evaluacion_cliente" ON "evaluacion"("cliente_id");

-- CreateIndex
CREATE INDEX "idx_import_admin" ON "importacion_csv"("admin_id");

-- CreateIndex
CREATE INDEX "idx_notificacion_usuario" ON "notificacion"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "obituario_url_slug_key" ON "obituario"("url_slug");

-- CreateIndex
CREATE INDEX "idx_obituario_slug" ON "obituario"("url_slug");

-- CreateIndex
CREATE INDEX "idx_orden_cliente" ON "orden"("cliente_id");

-- CreateIndex
CREATE INDEX "idx_orden_operador" ON "orden"("operador_id");

-- CreateIndex
CREATE INDEX "idx_detalle_orden" ON "orden_detalle"("orden_id");

-- CreateIndex
CREATE INDEX "idx_pago_orden" ON "pago"("orden_id");

-- CreateIndex
CREATE INDEX "idx_password_reset_token" ON "password_reset"("token");

-- CreateIndex
CREATE INDEX "idx_servicio_nombre" ON "servicio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_nombre_usuario_key" ON "usuario"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "condolencia" ADD CONSTRAINT "condolencia_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "condolencia" ADD CONSTRAINT "condolencia_obituario_id_fkey" FOREIGN KEY ("obituario_id") REFERENCES "obituario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "difunto" ADD CONSTRAINT "difunto_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "orden"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_verificacion" ADD CONSTRAINT "email_verificacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evaluacion" ADD CONSTRAINT "evaluacion_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "importacion_csv" ADD CONSTRAINT "importacion_csv_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificacion" ADD CONSTRAINT "notificacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "obituario" ADD CONSTRAINT "obituario_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "orden"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orden" ADD CONSTRAINT "orden_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orden" ADD CONSTRAINT "orden_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orden_detalle" ADD CONSTRAINT "orden_detalle_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "orden"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orden_detalle" ADD CONSTRAINT "orden_detalle_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicio"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "orden"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "password_reset" ADD CONSTRAINT "password_reset_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfil_admin" ADD CONSTRAINT "perfil_admin_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfil_cliente" ADD CONSTRAINT "perfil_cliente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfil_operador" ADD CONSTRAINT "perfil_operador_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
