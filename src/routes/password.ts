import { FastifyInstance } from 'fastify'
import { RecoveryPasswordSchema } from '../lib/validations/user.schema'
import { prisma } from '../lib/prisma'
import { HTTP_MESSAGE, HTTP_STATUS } from '../constants/http-constants'
import { getEmailToken } from '../lib/email-token'
import { ISendEmail, sendEmail } from '../lib/email'
import { TVerifyEmail } from '../lib/types/verify-email'
import { encrypt } from '../lib/security/cryptography'
import { emailMessage } from '../lib/email-message'

export async function passwordRoutes(app: FastifyInstance) {
  app.post('/password-recovery', async (request, reply) => {
    console.log('\n========================================')
    console.log('Trying to recover password')

    const { email } = RecoveryPasswordSchema.parse(request.body)

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        console.log('HTTP message: ' + HTTP_MESSAGE.NOT_FOUND)

        return reply.status(HTTP_STATUS.NOT_FOUND).send({
          message: HTTP_MESSAGE.NOT_FOUND,
        })
      }

      const token = await getEmailToken(user.id)
      console.log(token)

      const FRONT_PASSWORD_RESET_URL = process.env.FRONT_PASSWORD_RESET_URL
      const frontPasswordResetUrl = `${FRONT_PASSWORD_RESET_URL}?id=${user.id}&token=${token}`

      const backpasswordResetUrl = `${request.protocol}://${request.hostname}/password/${user.id}/reset-password/${token}`

      const emailOptions: ISendEmail = {
        email: user.email,
        subject: 'Recuperação de senha',
        text: emailMessage(
          user.name,
          'recuperar sua senha',
          frontPasswordResetUrl,
        ),
      }

      await sendEmail(emailOptions, reply)

      console.log('HTTP message: ' + HTTP_MESSAGE.OK)
      return reply.status(HTTP_STATUS.OK).send({
        passwordResetUrl: backpasswordResetUrl,
        message: HTTP_MESSAGE.OK,
      })
    } catch (err) {
      console.log('HTTP message: ' + HTTP_MESSAGE.INTERNAL_SERVER_ERROR)
      console.log('Error: ' + err)

      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      })
    }
  })

  app.patch('/password/:id/reset-password/:token', async (request, reply) => {
    console.log('\n========================================')
    console.log('Trying to reset password')

    try {
      const { id: userId, token } = request.params as TVerifyEmail
      const { password } = request.body as { password: string }

      const userToken = await prisma.token.findUnique({
        where: {
          userId,
          token,
        },
      })

      if (!userToken) {
        console.log('HTTP message: ' + HTTP_MESSAGE.NOT_FOUND)

        return reply.code(HTTP_STATUS.NOT_FOUND).send({
          message: HTTP_MESSAGE.NOT_FOUND,
        })
      }

      const encryptedPassword = encrypt(password)

      // await Promise.all([
      //   prisma.user.update({
      //     where: {
      //       id: userId,
      //     },
      //     data: {
      //       isEmailApproved: true,
      //     },
      //   }),
      //   prisma.token.delete({
      //     where: {
      //       userId,
      //     },
      //   }),
      // ])

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: encryptedPassword,
        },
      })

      await prisma.token.delete({
        where: {
          userId,
        },
      })

      console.log('HTTP message: ' + HTTP_MESSAGE.OK)
      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
      })
    } catch (err) {
      console.log('HTTP message: ' + HTTP_MESSAGE.INTERNAL_SERVER_ERROR)
      console.log('Error: ' + err)

      return reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      })
    }
  })
}
