import nodemailer from 'nodemailer'
import { randomBytes } from 'crypto'

let transporter: nodemailer.Transporter

async function getTransporter() {
  if (!transporter) {
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
    console.log('✉️ Ethereal credentials:', testAccount.user, testAccount.pass)
  }
  return transporter
}

export function genCode(): string {
  return (randomBytes(3).readUIntBE(0, 3) % 1_000_000)
    .toString()
    .padStart(6, '0')
}

export async function sendVerificationEmail(to: string, code: string) {
  const tr = await getTransporter()
  const info = await tr.sendMail({
    from: '"LumenGest" <no-reply@lumengest.com>',
    to,
    subject: 'Tu código de verificación en LumenGest',
    html: `
      <p>Tu código de verificación es:</p>
      <h2 style="letter-spacing:4px">${code}</h2>
      <p>Expira en 24 horas.</p>
    `,
  })
  console.log('💌 Preview URL:', nodemailer.getTestMessageUrl(info))
}
