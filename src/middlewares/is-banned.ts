import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'
import { errorHandler } from '../lib/utils/error-handler'
import { BannedError } from '../lib/errors/banned-error'

export async function isBanned(request: FastifyRequest, reply: FastifyReply) {
  try {
    const id = request.user.sub
    const user = await prisma.user.findUnique({ where: { id } })

    if (user?.isBanned) {
      throw new BannedError()
    }
  } catch (error) {
    errorHandler(error, reply)
  }
}
