-- Insertar usuarios de ejemplo
INSERT INTO "usuario" (nombre_usuario, email, password_hash, rol, estado) VALUES
('admin1', 'admin@funeraria.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'ADMIN', 'ACTIVO'),
('operador1', 'operador1@funeraria.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'OPERADOR', 'ACTIVO'),
('operador2', 'operador2@funeraria.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'OPERADOR', 'ACTIVO'),
('cliente1', 'cliente1@email.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'CLIENTE', 'ACTIVO'),
('cliente2', 'cliente2@email.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'CLIENTE', 'ACTIVO'),
('cliente3', 'cliente3@email.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'CLIENTE', 'ACTIVO');

-- Insertar perfiles de administrador
INSERT INTO "perfil_admin" (usuario_id, nombre_completo) VALUES
(1, 'Administrador Principal');

-- Insertar perfiles de operadores
INSERT INTO "perfil_operador" (usuario_id, nombres, ci, cargo, telefono) VALUES
(2, 'Juan Pérez', '1234567890', 'Coordinador de Servicios', '555-0001'),
(3, 'María García', '0987654321', 'Asistente de Servicios', '555-0002');

-- Insertar perfiles de clientes
INSERT INTO "perfil_cliente" (usuario_id, nombres, apellidos, telefono, direccion) VALUES
(4, 'Carlos', 'Rodríguez', '555-1001', 'Calle Principal 123'),
(5, 'Ana', 'Martínez', '555-1002', 'Avenida Central 456'),
(6, 'Roberto', 'López', '555-1003', 'Plaza Mayor 789');

-- Insertar servicios
INSERT INTO "servicio" (nombre, descripcion, precio_base, activo) VALUES
('Servicio Básico', 'Incluye velación y cremación básica', 1500.00, true),
('Servicio Premium', 'Incluye velación, cremación y ceremonia completa', 3000.00, true),
('Urna Estándar', 'Urna básica para cenizas', 500.00, true),
('Urna Premium', 'Urna decorativa de alta calidad', 1000.00, true),
('Florería Básica', 'Arreglo floral simple', 300.00, true),
('Florería Premium', 'Arreglo floral elaborado', 800.00, true),
('Obituario Digital', 'Publicación en plataforma digital', 200.00, true),
('Ceremonia Religiosa', 'Servicio religioso completo', 1000.00, true);

-- Insertar órdenes de ejemplo
INSERT INTO "orden" (cliente_id, operador_id, estado, total) VALUES
(4, 2, 'FINALIZADO', 2500.00),
(5, 2, 'EN_PROCESO', 3800.00),
(6, 3, 'PENDIENTE', 1500.00);

-- Insertar detalles de órdenes
INSERT INTO "orden_detalle" (orden_id, servicio_id, descripcion_srv, precio_unitario, cantidad, subtotal) VALUES
(1, 1, 'Servicio básico para velación', 1500.00, 1, 1500.00),
(1, 3, 'Urna estándar blanca', 500.00, 1, 500.00),
(1, 5, 'Arreglo floral básico', 300.00, 1, 300.00),
(2, 2, 'Servicio premium completo', 3000.00, 1, 3000.00),
(2, 7, 'Obituario digital con foto', 200.00, 1, 200.00),
(2, 8, 'Ceremonia religiosa católica', 1000.00, 1, 1000.00),
(3, 1, 'Servicio básico pendiente', 1500.00, 1, 1500.00);

-- Insertar difuntos
INSERT INTO "difunto" (orden_id, nombres, fecha_fallecido) VALUES
(1, 'José Rodríguez', '2024-04-20'),
(2, 'María Martínez', '2024-04-21'),
(3, 'Pedro López', '2024-04-22');

-- Insertar obituarios
INSERT INTO "obituario" (orden_id, titulo, mensaje, url_slug, imagen_url, publicado) VALUES
(1, 'In Memorian: José Rodríguez', 'Con profundo pesar anunciamos el fallecimiento de nuestro querido José Rodríguez...', 'jose-rodriguez-2024', 'https://ejemplo.com/foto1.jpg', true),
(2, 'In Memorian: María Martínez', 'Con gran tristeza compartimos la partida de nuestra amada María Martínez...', 'maria-martinez-2024', 'https://ejemplo.com/foto2.jpg', true);

-- Insertar condolencias
INSERT INTO "condolencia" (obituario_id, autor_id, mensaje, estado) VALUES
(1, 5, 'Mis más sinceras condolencias a toda la familia.', 'APROBADO'),
(1, 6, 'Que descanse en paz. Un abrazo a la familia.', 'APROBADO'),
(2, 4, 'Lamento mucho su pérdida. Un abrazo fuerte.', 'PENDIENTE');

-- Insertar pagos
INSERT INTO "pago" (orden_id, monto, metodo, estado, referencia) VALUES
(1, 2500.00, 'TARJETA', 'COMPLETADO', 'REF-001'),
(2, 2000.00, 'TRANSFERENCIA', 'COMPLETADO', 'REF-002'),
(2, 1800.00, 'EFECTIVO', 'PENDIENTE', 'REF-003');

-- Insertar FAQs
INSERT INTO "faq" (pregunta, respuesta) VALUES
('¿Qué servicios básicos incluye un funeral?', 'Nuestro servicio básico incluye velación, cremación y urna estándar.'),
('¿Cómo puedo personalizar un servicio?', 'Puede contactar con nuestros operadores para discutir las opciones de personalización.'),
('¿Cuánto tiempo toma el proceso de cremación?', 'El proceso de cremación típicamente toma entre 2-3 horas.');

-- Insertar recursos de ayuda
INSERT INTO "recurso_ayuda" (titulo, contenido, tipo) VALUES
('Guía de Planificación', 'Consejos para planificar un servicio funerario...', 'ARTICULO'),
('Video Tutorial', 'Cómo navegar por nuestra plataforma...', 'VIDEO'),
('Podcast: Duelo', 'Conversación sobre el proceso de duelo...', 'AUDIO');

-- Insertar evaluaciones
INSERT INTO "evaluacion" (cliente_id, puntuacion, comentario) VALUES
(4, 5, 'Excelente servicio, muy profesionales.'),
(5, 4, 'Buen servicio, podría mejorar en algunos aspectos.'),
(6, 5, 'Muy satisfecho con la atención recibida.'); 