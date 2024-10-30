import { FastifyRequest, FastifyReply } from 'fastify'
import { HTTP_MESSAGE, HTTP_STATUS } from '../constants/http-constants'
import { errorHandler } from '../lib/utils/error-handler'
import { CreateSignatuteSchema } from '../lib/validations/signatures.schema'
import { signaturesService } from '../services/signatures.service'
import { tokenSchema } from '../lib/validations/token.schema'

class SignaturesController {
  async createSignature(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body
      const inputData = CreateSignatuteSchema.parse(body)

      const data = await signaturesService.createSignatute(inputData)

      return reply.code(HTTP_STATUS.CREATED).send({
        message: HTTP_MESSAGE.CREATED,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async verifySignature(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params
      const { token } = tokenSchema.parse(params)

      const data = await signaturesService.verifySignature(token)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }
}

export const signaturesController = new SignaturesController()
