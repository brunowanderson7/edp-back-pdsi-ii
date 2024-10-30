import { FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { HTTP_MESSAGE, HTTP_STATUS } from '../../constants/http-constants'
import { GenericError } from '../errors/generic-error'
import { getHttpResponse } from './get-http-response'

export function errorHandler(
  error: Error | GenericError | ZodError,
  reply: FastifyReply,
) {
  console.error(error)
  const httpResponse = getHttpResponse()

  if (error instanceof GenericError) {
    httpResponse.response.message = error.httpMessage
    httpResponse.statusCode = error.httpCode
  } else if (error instanceof ZodError) {
    httpResponse.response.message = HTTP_MESSAGE.BAD_REQUEST
    httpResponse.statusCode = HTTP_STATUS.BAD_REQUEST
    httpResponse.response.error = error.flatten()
  }

  return reply.code(httpResponse.statusCode).send({ ...httpResponse.response })
}
