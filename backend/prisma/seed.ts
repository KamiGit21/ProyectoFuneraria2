import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    // Crear usuarios administradores
    const admin1 = await prisma.usuario.create({
      data: {
        nombre_usuario: 'admin1',
        email: 'admin@funeraria.com',
        password_hash: '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX',
        rol: 'ADMIN',
        estado: 'ACTIVO',
        perfil_admin: {
          create: {
            nombre_completo: 'Administrador Principal'
          }
        }
      }
    });

    const admin2 = await prisma.usuario.create({
      data: {
        nombre_usuario: 'admin2',
        email: 'admin2@funeraria.com',
        password_hash: '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX',
        rol: 'ADMIN',
        estado: 'ACTIVO',
        perfil_admin: {
          create: {
            nombre_completo: 'Administrador Secundario'
          }
        }
      }
    });

    // Crear operadores
    const operadores = await Promise.all([
      prisma.usuario.create({
        data: {
          nombre_usuario: 'operador1',
          email: 'operador1@funeraria.com',
          password_hash: '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX',
          rol: 'OPERADOR',
          estado: 'ACTIVO',
          perfil_operador: {
            create: {
              nombres: 'Juan Pérez',
              ci: '1234567890',
              cargo: 'Coordinador de Servicios',
              telefono: '555-0001'
            }
          }
        }
      }),
      prisma.usuario.create({
        data: {
          nombre_usuario: 'operador2',
          email: 'operador2@funeraria.com',
          password_hash: '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX',
          rol: 'OPERADOR',
          estado: 'ACTIVO',
          perfil_operador: {
            create: {
              nombres: 'María García',
              ci: '0987654321',
              cargo: 'Asistente de Servicios',
              telefono: '555-0002'
            }
          }
        }
      }),
      prisma.usuario.create({
        data: {
          nombre_usuario: 'operador3',
          email: 'operador3@funeraria.com',
          password_hash: '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX',
          rol: 'OPERADOR',
          estado: 'ACTIVO',
          perfil_operador: {
            create: {
              nombres: 'Carlos López',
              ci: '1122334455',
              cargo: 'Supervisor de Servicios',
              telefono: '555-0003'
            }
          }
        }
      })
    ]);

    // Crear clientes
    const clientes = await Promise.all([
      prisma.usuario.create({
        data: {
          nombre_usuario: 'cliente1',
          email: 'cliente1@email.com',
          password_hash: '$2b$10$OoCY61LtwCUIm9hNSjN6HOB2yuHkIFi5IXw2xI9FhFQDcn9i8pu/.',
          rol: 'CLIENTE',
          estado: 'ACTIVO',
          perfil_cliente: {
            create: {
              nombres: 'Carlos',
              apellidos: 'Rodríguez',
              telefono: '555-1001',
              direccion: 'Calle Principal 123'
            }
          }
        }
      }),
      prisma.usuario.create({
        data: {
          nombre_usuario: 'cliente2',
          email: 'cliente2@email.com',
          password_hash: '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX',
          rol: 'CLIENTE',
          estado: 'ACTIVO',
          perfil_cliente: {
            create: {
              nombres: 'Ana',
              apellidos: 'Martínez',
              telefono: '555-1002',
              direccion: 'Avenida Central 456'
            }
          }
        }
      }),
      prisma.usuario.create({
        data: {
          nombre_usuario: 'cliente3',
          email: 'cliente3@email.com',
          password_hash: '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX',
          rol: 'CLIENTE',
          estado: 'ACTIVO',
          perfil_cliente: {
            create: {
              nombres: 'Roberto',
              apellidos: 'López',
              telefono: '555-1003',
              direccion: 'Plaza Mayor 789'
            }
          }
        }
      })
    ]);

    // Crear servicios
    const servicios = await Promise.all([
      prisma.servicio.create({
        data: {
          nombre: 'Servicio Básico',
          descripcion: 'Incluye velación y cremación básica',
          precio_base: 1500.00,
          activo: true
        }
      }),
      prisma.servicio.create({
        data: {
          nombre: 'Servicio Premium',
          descripcion: 'Incluye velación, cremación y ceremonia completa',
          precio_base: 3000.00,
          activo: true
        }
      }),
      prisma.servicio.create({
        data: {
          nombre: 'Urna Estándar',
          descripcion: 'Urna básica para cenizas',
          precio_base: 500.00,
          activo: true
        }
      }),
      prisma.servicio.create({
        data: {
          nombre: 'Urna Premium',
          descripcion: 'Urna decorativa de alta calidad',
          precio_base: 1000.00,
          activo: true
        }
      }),
      prisma.servicio.create({
        data: {
          nombre: 'Florería Básica',
          descripcion: 'Arreglo floral simple',
          precio_base: 300.00,
          activo: true
        }
      }),
      prisma.servicio.create({
        data: {
          nombre: 'Florería Premium',
          descripcion: 'Arreglo floral elaborado',
          precio_base: 800.00,
          activo: true
        }
      }),
      prisma.servicio.create({
        data: {
          nombre: 'Obituario Digital',
          descripcion: 'Publicación en plataforma digital',
          precio_base: 200.00,
          activo: true
        }
      }),
      prisma.servicio.create({
        data: {
          nombre: 'Ceremonia Religiosa',
          descripcion: 'Servicio religioso completo',
          precio_base: 1000.00,
          activo: true
        }
      })
    ]);

    // Crear órdenes
    const ordenes = await Promise.all([
      prisma.orden.create({
        data: {
          cliente_id: clientes[0].id,
          operador_id: operadores[0].id,
          estado: 'FINALIZADO',
          total: 2500.00,
          difunto: {
            create: {
              nombres: 'José Rodríguez',
              fecha_fallecido: new Date('2024-04-20')
            }
          },
          orden_detalle: {
            create: [
              {
                servicio_id: servicios[0].id,
                descripcion_srv: 'Servicio básico para velación',
                precio_unitario: 1500.00,
                cantidad: 1,
                subtotal: 1500.00
              },
              {
                servicio_id: servicios[2].id,
                descripcion_srv: 'Urna estándar blanca',
                precio_unitario: 500.00,
                cantidad: 1,
                subtotal: 500.00
              },
              {
                servicio_id: servicios[4].id,
                descripcion_srv: 'Arreglo floral básico',
                precio_unitario: 300.00,
                cantidad: 1,
                subtotal: 300.00
              }
            ]
          }
        }
      }),
      prisma.orden.create({
        data: {
          cliente_id: clientes[1].id,
          operador_id: operadores[1].id,
          estado: 'EN_PROCESO',
          total: 3800.00,
          difunto: {
            create: {
              nombres: 'María Martínez',
              fecha_fallecido: new Date('2024-04-21')
            }
          },
          orden_detalle: {
            create: [
              {
                servicio_id: servicios[1].id,
                descripcion_srv: 'Servicio premium completo',
                precio_unitario: 3000.00,
                cantidad: 1,
                subtotal: 3000.00
              },
              {
                servicio_id: servicios[6].id,
                descripcion_srv: 'Obituario digital con foto',
                precio_unitario: 200.00,
                cantidad: 1,
                subtotal: 200.00
              },
              {
                servicio_id: servicios[7].id,
                descripcion_srv: 'Ceremonia religiosa católica',
                precio_unitario: 1000.00,
                cantidad: 1,
                subtotal: 1000.00
              }
            ]
          }
        }
      }),
      prisma.orden.create({
        data: {
          cliente_id: clientes[2].id,
          operador_id: operadores[2].id,
          estado: 'PENDIENTE',
          total: 1500.00,
          difunto: {
            create: {
              nombres: 'Pedro López',
              fecha_fallecido: new Date('2024-04-22')
            }
          },
          orden_detalle: {
            create: {
              servicio_id: servicios[0].id,
              descripcion_srv: 'Servicio básico pendiente',
              precio_unitario: 1500.00,
              cantidad: 1,
              subtotal: 1500.00
            }
          }
        }
      })
    ]);

    // Crear obituarios
    const obituarios = await Promise.all([
      prisma.obituario.create({
        data: {
          orden_id: ordenes[0].id,
          titulo: 'In Memorian: José Rodríguez',
          mensaje: 'Con profundo pesar anunciamos el fallecimiento de nuestro querido José Rodríguez...',
          url_slug: 'jose-rodriguez-2024',
          imagen_url: 'https://ejemplo.com/foto1.jpg',
          publicado: true
        }
      }),
      prisma.obituario.create({
        data: {
          orden_id: ordenes[1].id,
          titulo: 'In Memorian: María Martínez',
          mensaje: 'Con gran tristeza compartimos la partida de nuestra amada María Martínez...',
          url_slug: 'maria-martinez-2024',
          imagen_url: 'https://ejemplo.com/foto2.jpg',
          publicado: true
        }
      })
    ]);

    // Crear condolencias
    await Promise.all([
      prisma.condolencia.create({
        data: {
          obituario_id: obituarios[0].id,
          autor_id: clientes[1].id,
          mensaje: 'Mis más sinceras condolencias a toda la familia.',
          estado: 'APROBADO'
        }
      }),
      prisma.condolencia.create({
        data: {
          obituario_id: obituarios[0].id,
          autor_id: clientes[2].id,
          mensaje: 'Que descanse en paz. Un abrazo a la familia.',
          estado: 'APROBADO'
        }
      }),
      prisma.condolencia.create({
        data: {
          obituario_id: obituarios[1].id,
          autor_id: clientes[0].id,
          mensaje: 'Lamento mucho su pérdida. Un abrazo fuerte.',
          estado: 'PENDIENTE'
        }
      })
    ]);

    // Crear pagos
    await Promise.all([
      prisma.pago.create({
        data: {
          orden_id: ordenes[0].id,
          monto: 2500.00,
          metodo: 'TARJETA',
          estado: 'COMPLETADO',
          referencia: 'REF-001'
        }
      }),
      prisma.pago.create({
        data: {
          orden_id: ordenes[1].id,
          monto: 2000.00,
          metodo: 'TRANSFERENCIA',
          estado: 'COMPLETADO',
          referencia: 'REF-002'
        }
      }),
      prisma.pago.create({
        data: {
          orden_id: ordenes[1].id,
          monto: 1800.00,
          metodo: 'EFECTIVO',
          estado: 'PENDIENTE',
          referencia: 'REF-003'
        }
      })
    ]);

    // Crear FAQs
    await Promise.all([
      prisma.faq.create({
        data: {
          pregunta: '¿Qué servicios básicos incluye un funeral?',
          respuesta: 'Nuestro servicio básico incluye velación, cremación y urna estándar.'
        }
      }),
      prisma.faq.create({
        data: {
          pregunta: '¿Cómo puedo personalizar un servicio?',
          respuesta: 'Puede contactar con nuestros operadores para discutir las opciones de personalización.'
        }
      }),
      prisma.faq.create({
        data: {
          pregunta: '¿Cuánto tiempo toma el proceso de cremación?',
          respuesta: 'El proceso de cremación típicamente toma entre 2-3 horas.'
        }
      })
    ]);

    // Crear recursos de ayuda
    await Promise.all([
      prisma.recurso_ayuda.create({
        data: {
          titulo: 'Guía de Planificación',
          contenido: 'Consejos para planificar un servicio funerario...',
          tipo: 'ARTICULO'
        }
      }),
      prisma.recurso_ayuda.create({
        data: {
          titulo: 'Video Tutorial',
          contenido: 'Cómo navegar por nuestra plataforma...',
          tipo: 'VIDEO'
        }
      }),
      prisma.recurso_ayuda.create({
        data: {
          titulo: 'Podcast: Duelo',
          contenido: 'Conversación sobre el proceso de duelo...',
          tipo: 'AUDIO'
        }
      })
    ]);

    // Crear evaluaciones
    await Promise.all([
      prisma.evaluacion.create({
        data: {
          cliente_id: clientes[0].id,
          puntuacion: 5,
          comentario: 'Excelente servicio, muy profesionales.'
        }
      }),
      prisma.evaluacion.create({
        data: {
          cliente_id: clientes[1].id,
          puntuacion: 4,
          comentario: 'Buen servicio, podría mejorar en algunos aspectos.'
        }
      }),
      prisma.evaluacion.create({
        data: {
          cliente_id: clientes[2].id,
          puntuacion: 5,
          comentario: 'Muy satisfecho con la atención recibida.'
        }
      })
    ]);

    console.log('✅ Datos de ejemplo insertados correctamente');
  } catch (error) {
    console.error('❌ Error al insertar datos de ejemplo:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();