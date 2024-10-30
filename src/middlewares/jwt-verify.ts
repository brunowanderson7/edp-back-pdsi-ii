import { FastifyReply, FastifyRequest } from 'fastify'
import { errorHandler } from '../lib/utils/error-handler'
import { UnauthorizedError } from '../lib/errors/unauthorized-error'

export async function jwtVerify(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()

    return true
  } catch (error) {
    console.log(error)
    return errorHandler(new UnauthorizedError(error.message), reply)
  }
}
