import { RequestHandler } from 'express'
import prisma from '../config/prismaClient'
import { genCode, sendVerificationEmail } from '../services/mailer'
import bcrypt from 'bcrypt'

/**
 * Paso 1: Crear usuario INACTIVO + perfil_cliente + código + email_verificacion + envío de código
 */
export const registerClient: RequestHandler = async (req, res) => {
  const {
    nombre_usuario,
    email,
    password,
    nombres,
    apellidos,
    telefono,
    direccion,
  } = req.body

  // 1) Validar campos
  if (
    !nombre_usuario ||
    !email ||
    !password ||
    !nombres ||
    !apellidos
  ) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' })
  }

  // 2) Revisar duplicados
  const dup = await prisma.usuario.findFirst({
    where: {
      OR: [{ email }, { nombre_usuario }],
    },
  })
  if (dup) {
    return res
      .status(409)
      .json({ error: 'Email o usuario ya registrados.' })
  }

  // 3) Hashear contraseña
  const hash = await bcrypt.hash(password, 10)

  // 4) Crear usuario INACTIVO + perfil_cliente
  const user = await prisma.usuario.create({
    data: {
      nombre_usuario,
      email,
      password_hash: hash,
      rol: 'CLIENTE',
      estado: 'INACTIVO',
      perfil_cliente: {
        create: {
          nombres,
          apellidos,
          telefono,
          direccion,
        },
      },
    },
  })

  // 5) Generar y guardar código en email_verificacion
  const code = genCode()
  await prisma.email_verificacion.upsert({
    where: { usuario_id: user.id },
    update: { token: code },
    create: {
      usuario_id: user.id,
      token: code,
    },
  })

  // 6) Enviar correo (no bloqueante si falla)
  sendVerificationEmail(email, code).catch((e) =>
    console.error('Error enviando email:', e)
  )

  return res
    .status(201)
    .json({ message: 'Usuario creado. Revisa tu correo para verificar.' })
}

/**
 * Paso 2: Verificar código y activar la cuenta
 */
export const verifyCode: RequestHandler = async (req, res) => {
  const { email, code } = req.body
  if (!email || !code)
    return res.status(400).json({ error: 'Email y código son requeridos.' })

  // 1) Buscar usuario
  const user = await prisma.usuario.findUnique({ where: { email } })
  if (!user) return res.status(404).json({ error: 'Usuario no existe.' })

  // 2) Buscar registro de verificación
  const rec = await prisma.email_verificacion.findUnique({
    where: { usuario_id: user.id },
  })
  if (!rec || rec.token !== code) {
    return res.status(400).json({ error: 'Código inválido.' })
  }

  // 3) Activar usuario y eliminar el token
  await prisma.$transaction([
    prisma.usuario.update({
      where: { id: user.id },
      data: { estado: 'ACTIVO' },
    }),
    prisma.email_verificacion.delete({
      where: { usuario_id: user.id },
    }),
  ])

  return res.json({ message: 'Cuenta verificada. Ya puedes iniciar sesión.' })
}