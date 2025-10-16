import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST
const port = parseInt(process.env.SMTP_PORT || '587')
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD
const secure = port === 465
const recipient = process.env.TEST_RECIPIENT || user

if (!host || !user || !pass) {
  console.error('Fehlende SMTP-Umgebungsvariablen. Bitte setzen: SMTP_HOST, SMTP_USER, SMTP_PASS')
  process.exit(1)
}

console.log('SMTP-Konfiguration:')
console.log(`  host: ${host}`)
console.log(`  port: ${port}`)
console.log(`  secure: ${secure}`)
console.log(`  user: ${user}`)

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass }
})

try {
  console.log('Verifiziere Verbindung und Authentifizierung...')
  const ok = await transporter.verify()
  console.log('transporter.verify():', ok)

  console.log('Sende Test-E-Mail...')
  const info = await transporter.sendMail({
    from: { name: 'Kreditheld24 SMTP-Test', address: user },
    to: recipient,
    subject: 'SMTP Test – Kreditheld24',
    text: 'Dies ist eine Test-E-Mail, um die SMTP-Verbindung zu prüfen.'
  })

  console.log('E-Mail gesendet. Message-ID:', info.messageId)
  if (info.response) console.log('Server-Antwort:', info.response)
} catch (err) {
  console.error('SMTP-Test fehlgeschlagen:')
  console.error(err?.message || err)
  process.exit(2)
}