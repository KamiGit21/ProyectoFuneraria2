// backend/src/services/mailer.ts
import nodemailer, { Transporter } from 'nodemailer';
import 'dotenv/config';

let transporter: Transporter;

/**
 * Inicializa (o devuelve) el transporter SMTP.
 * Usa las variables de entorno SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
 * Si no están definidas cae en Ethereal para pruebas.
 */
async function getTransporter(): Promise<Transporter> {
  if (transporter) return transporter;

  // Si tienes SMTP real configurado en .env, úsalo:
  const host = process.env.SMTP_HOST || undefined;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,      // sólo TLS en puerto 465
      auth: { user, pass },
    });
  } else {
    // Si no están tus credenciales reales, cae en Ethereal (para desarrollo)
    const test = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: test.smtp.host,
      port: test.smtp.port,
      secure: test.smtp.secure,
      auth: {
        user: test.user,
        pass: test.pass,
      },
    });
    console.log('✉️ Ethereal credentials:', test.user, test.pass);
  }

  return transporter;
}

/**
 * Genera un código de 6 dígitos para verificación.
 */
export function genCode(): string {
  return Math.floor(100_000 + Math.random() * 900_000).toString();
}

/**
 * Envía un correo con el código de verificación al registro.
 */
export async function sendVerificationEmail(to: string, code: string) {
  const tr = await getTransporter();
  const info = await tr.sendMail({
    from: `"LumenGest" <${process.env.SMTP_USER || 'no-reply@lumengest.com'}>`,
    to,
    subject: 'Tu código de verificación en LumenGest',
    html:
      `<p>Tu código de verificación es:</p>` +
      `<h2 style="letter-spacing:4px">${code}</h2>` +
      `<p>Expira en 24 horas.</p>`,
  });
  console.log('💌 Verification Preview URL:', nodemailer.getTestMessageUrl(info));
}

/**
 * Envía un correo con el enlace de restablecimiento de contraseña.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const tr = await getTransporter();
  // Asegúrate de tener FRONTEND_URL en tu .env, e.g. http://localhost:5173
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontend}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const info = await tr.sendMail({
    from: `"LumenGest" <${process.env.SMTP_USER || 'no-reply@lumengest.com'}>`,
    to: email,
    subject: 'Restablece tu contraseña',
    html:
      `<p>Para restablecer tu contraseña, haz click en el siguiente enlace:</p>` +
      `<p><a href="${resetLink}">Restablecer contraseña</a></p>` +
      `<p>Si no solicitaste esto, ignora este correo.</p>`,
  });
  console.log('🔑 Password reset Preview URL:', nodemailer.getTestMessageUrl(info));
}
