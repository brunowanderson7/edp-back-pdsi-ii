import { FastifyReply } from 'fastify'
import nodemailer from 'nodemailer'
import { HTTP_MESSAGE, HTTP_STATUS } from '../constants/http-constants'

const EMAIL_SERVICE = process.env.EMAIL_SERVICE
const EMAIL_HOST = process.env.EMAIL_HOST
const EMAIL_PORT = process.env.EMAIL_PORT
const EMAIL_SECURE = Boolean(process.env.EMAIL_SECURE) || false
const USER_EMAIL = process.env.USER_EMAIL
const USER_PASS = process.env.USER_PASS
const EMAIL_FROM = process.env.EMAIL_FROM

const transporter = nodemailer.createTransport({
  // @ts-expect-error "service" does not exist in transport options
  service: EMAIL_SERVICE,
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: USER_EMAIL,
    pass: USER_PASS,
  },
})

export interface ISendEmail {
  email: string
  subject: string
  text: string
}

export async function sendEmail(
  { email, subject, text }: ISendEmail,
  reply: FastifyReply,
) {
  console.log('Trying to send email')
  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject,
    text,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`Email sent:${info}`)
  } catch (err) {
    console.log(`Failed to send email: ${err}`)
    return reply
      .code(HTTP_STATUS.EMAIL_NOT_SENT_ERROR)
      .send({ message: HTTP_MESSAGE.EMAIL_NOT_SENT_ERROR })
  }
}
