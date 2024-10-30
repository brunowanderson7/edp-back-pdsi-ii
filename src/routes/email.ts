import { FastifyInstance } from 'fastify'
import { TVerifyEmail } from '../lib/types/verify-email'
import { prisma } from '../lib/prisma'
import { HTTP_MESSAGE, HTTP_STATUS } from '../constants/http-constants'

export async function emailRoute(app: FastifyInstance) {
  app.get('/email/:id/verify-email/:token', async (request, reply) => {
    console.log('\n========================================')
    console.log('Trying to verify email')

    try {
      const { id: userId, token } = request.params as TVerifyEmail

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
          isEmailApproved: true,
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
