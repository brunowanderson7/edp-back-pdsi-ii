import { FastifyInstance } from 'fastify'
import { LoginUserSchema } from '../lib/validations/user.schema'
import { prisma } from '../lib/prisma'
import { HTTP_STATUS, HTTP_MESSAGE } from '../constants/http-constants'
import { decrypt } from '../lib/security/cryptography.ts'
import { expiresIn } from '../constants/token-expiration-time'
import { ISendEmail, sendEmail } from '../lib/email.ts'
import { getEmailToken } from '../lib/email-token.ts'
import { getUserPermissions } from '../lib/utils/get-user-permissions.ts'
import { emailMessage } from '../lib/email-message.ts'

export async function loginRoute(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    console.log('\n========================================')
    console.log('Trying to login')

    const { email, password } = LoginUserSchema.parse(request.body)

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          permissions: true,
        },
      })

      if (!user) {
        console.log('HTTP message: ' + HTTP_MESSAGE.NOT_FOUND)

        return reply.code(HTTP_STATUS.NOT_FOUND).send({
          message: HTTP_MESSAGE.NOT_FOUND,
        })
      }

      if (password !== decrypt(user.password)) {
        console.log('HTTP message: ' + HTTP_MESSAGE.UNAUTHORIZED)

        return reply.code(HTTP_STATUS.UNAUTHORIZED).send({
          message: HTTP_MESSAGE.UNAUTHORIZED,
        })
      }

      if (user.isBanned) {
        console.log('HTTP message: ' + HTTP_MESSAGE.BANNED)

        return reply.code(HTTP_STATUS.BANNED).send({
          message: HTTP_MESSAGE.BANNED,
        })
      }

      if (!user.isEmailApproved) {
        console.log('HTTP message: ' + HTTP_MESSAGE.UNPROCESSABLE_ENTITY)

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

        return reply.code(HTTP_STATUS.UNPROCESSABLE_ENTITY).send({
          emailVerificationUrl: backEmailVerificationUrl,
          message: HTTP_MESSAGE.UNPROCESSABLE_ENTITY,
        })
      }

      if (!user.isUserApproved) {
        console.log('HTTP message: ' + HTTP_MESSAGE.FORBIDDEN)

        return reply.code(HTTP_STATUS.FORBIDDEN).send({
          message: HTTP_MESSAGE.FORBIDDEN,
        })
      }

      if (!user.permissions) {
        throw new Error('User permissions is empty')
      }

      const token = app.jwt.sign(
        {
          name: user.name,
          userPermissions: getUserPermissions(user.permissions),
        },
        {
          sub: user.id,
          expiresIn,
        },
      )

      console.log('HTTP message: ' + HTTP_MESSAGE.OK)
      return reply.code(HTTP_STATUS.OK).send({
        token,
        message: HTTP_MESSAGE.OK,
      })
    } catch (err) {
      console.log('Error when trying to login')
      console.log('HTTP message: ' + HTTP_MESSAGE.INTERNAL_SERVER_ERROR)
      console.log('error: ' + err)
      return reply
        .code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR })
    }
  })
}
