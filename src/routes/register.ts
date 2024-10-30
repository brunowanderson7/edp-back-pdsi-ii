import { FastifyInstance } from 'fastify'
import { RegisterUserSchema } from '../lib/validations/user.schema'
import { prisma } from '../lib/prisma'
import { HTTP_MESSAGE, HTTP_STATUS } from '../constants/http-constants'
import { encrypt } from '../lib/security/cryptography'
import { ISendEmail, sendEmail } from '../lib/email'
import { getEmailToken } from '../lib/email-token.ts'
import { emailMessage } from '../lib/email-message.ts'

export async function registerRoute(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    console.log('\n========================================')
    console.log('Trying to register')

    const { name, email, password } = RegisterUserSchema.parse(request.body)

    try {
      const isEmailAlreadyRegistered = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (
        isEmailAlreadyRegistered &&
        !isEmailAlreadyRegistered.isEmailApproved
      ) {
        const token = await getEmailToken(isEmailAlreadyRegistered.id)
        console.log(token)

        const FRONT_EMAIL_VERIFICATION_URL =
          process.env.FRONT_EMAIL_VERIFICATION_URL
        const frontEmailVerificationUrl = `${FRONT_EMAIL_VERIFICATION_URL}?id=${isEmailAlreadyRegistered.id}&token=${token}`

        const backEmailVerificationUrl = `${request.protocol}://${request.hostname}/email/${isEmailAlreadyRegistered.id}/verify-email/${token}`

        const emailOptions: ISendEmail = {
          email: isEmailAlreadyRegistered.email,
          subject: 'Verifique seu email',
          text: emailMessage(
            isEmailAlreadyRegistered.name,
            'verificar seu email',
            frontEmailVerificationUrl,
          ),
        }

        await sendEmail(emailOptions, reply)

        console.log('HTTP message: ' + HTTP_MESSAGE.UNPROCESSABLE_ENTITY)

        return reply.code(HTTP_STATUS.UNPROCESSABLE_ENTITY).send({
          message: HTTP_MESSAGE.UNPROCESSABLE_ENTITY,
          emailVerificationUrl: backEmailVerificationUrl,
        })
      }

      if (isEmailAlreadyRegistered) {
        console.log('HTTP message: ' + HTTP_MESSAGE.CONFLICT)
        return reply.code(HTTP_STATUS.CONFLICT).send({
          message: HTTP_MESSAGE.CONFLICT,
        })
      }

      const criptedPassword = encrypt(password)

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: criptedPassword,
          permissions: {
            create: {},
          },
        },
      })

      const token = await getEmailToken(user.id)
      console.log(token)

      const FRONT_EMAIL_VERIFICATION_URL =
        process.env.FRONT_EMAIL_VERIFICATION_URL
      const frontEmailVerificationUrl = `${FRONT_EMAIL_VERIFICATION_URL}?id=${user.id}&token=${token}`

      const backEmailVerificationUrl = `${request.protocol}://${request.hostname}/email/${user.id}/verify-email/${token}`

      const emailOptions: ISendEmail = {
        email: user.email,
        subject: 'Verifique seu email',
        text: emailMessage(
          user.name,
          'verificar seu email',
          frontEmailVerificationUrl,
        ),
      }

      await sendEmail(emailOptions, reply)

      console.log('HTTP message: ' + HTTP_MESSAGE.CREATED)

      return reply.code(HTTP_STATUS.CREATED).send({
        message: HTTP_MESSAGE.CREATED,
        emailVerificationUrl: backEmailVerificationUrl,
      })
    } catch (error) {
      console.log('Error when trying to register')
      console.log('HTTP message: ' + HTTP_MESSAGE.INTERNAL_SERVER_ERROR)
      console.log('Error: ' + error)
      return reply
        .code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR })
    }
  })
}
